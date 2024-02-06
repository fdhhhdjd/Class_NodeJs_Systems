//* LIB
const _ = require("lodash");
const validator = require("validator");
const path = require("path");

//* IMPORT
const {
  BadRequestRequestError,
  NotFoundError,
  UnauthorizedError,
  GoneError,
} = require("../../../cores/error.response");
const userModel = require("../models/user.model");
const userVerificationModel = require("../models/user_verification");
const { createTokenJWT, verifyTokenJWT } = require("../../../auth/auth.token");

const {
  app: { accessKey, refetchKey },
} = require("../../../commons/configs/app.config");
const {
  TIME_TOKEN,
  TOKEN_EXPIRE,
  INVALID_TOKEN,
  TIME,
} = require("../../../commons/constants");
const { createCookie } = require("../../../auth/auth.cookie");
const { RefetchToken } = require("../../../commons/keys/token");
const {
  encodePassword,
  comparePassword,
} = require("../../../auth/auth.password");
const redisInstance = require("../../../databases/init.redis");
const { BlacklistTokens } = require("../../../commons/keys/blacklist");
const {
  generateRandomString,
  generateRandomLink,
} = require("../../../commons/utils/random");
const { checkUserSpam } = require("../../../auth/auth.blacklist");
const { SpamForget } = require("../../../commons/keys/spam");
const sendEmail = require("../../../commons/utils/sendEmail");
class UserService {
  async getAll(req) {
    const data = {
      id: "id",
      username: "username",
      email: "email",
      password: "password",
      refetch_token: "refetch_token",
    };
    console.info({
      "User Info": req.userInfo,
      "Access Token": req.accessToken,
    });

    const result = await userModel.getAllUser(data);
    return result;
  }

  async getDetail({ userId }) {
    if (_.isEmpty(userId)) {
      throw new BadRequestRequestError();
    }
    const data = {
      id: "id",
      username: "username",
      email: "email",
    };
    const result = await userModel.getUserById({ id: userId }, data);

    if (_.isEmpty(result)) {
      throw new BadRequestRequestError();
    }
    return result;
  }

  async getTodoFollowUser({ userId }) {
    if (_.isEmpty(userId)) {
      throw new BadRequestRequestError();
    }

    const data = {
      id: "todo_list.id",
      title: "todo_list.title",
      username: "user.username",
      email: "user.email",
    };

    const result = await userModel.getTodoFollowUser(
      { "user.id": userId },
      data
    );
    return result;
  }

  async create({ username, email }) {
    const shouldEmpty = _.isEmpty(username) || _.isEmpty(email);
    if (shouldEmpty) {
      throw new BadRequestRequestError();
    }

    const foundUser = await userModel.checkExitUserNameAndEmail({
      username,
      email,
    });

    if (foundUser) {
      throw new BadRequestRequestError();
    }

    const randomPassword = generateRandomString(10);
    const hashPassword = await encodePassword(randomPassword);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }

    const result = await userModel.createUser({
      username,
      email,
      password: hashPassword,
    });
    return result;
  }

  async update({ username, email, password }, { userId }) {
    const shouldEmpty =
      _.isEmpty(username) ||
      _.isEmpty(email) ||
      _.isEmpty(password) ||
      _.isEmpty(userId);
    if (shouldEmpty) {
      throw new BadRequestRequestError();
    }

    const foundUser = await userModel.checkExists({
      id: userId,
    });

    if (!foundUser) {
      throw new UnauthorizedError();
    }

    const duplicateUser = await userModel.checkExitUserNameAndEmail({
      username,
      email,
    });

    if (duplicateUser) {
      throw new BadRequestRequestError();
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      throw new UnauthorizedError();
    }

    const hashPassword = await encodePassword(password);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }
    const result = await userModel.updateUser(
      { username, email, password: hashPassword },
      { id: userId }
    );
    return result;
  }

  async delete({ userId }) {
    if (_.isEmpty(userId)) {
      throw new BadRequestRequestError();
    }

    const foundUser = await userModel.checkExists({
      id: userId,
    });

    if (!foundUser) {
      throw new UnauthorizedError();
    }

    const result = await userModel.deleteId({ id: userId });
    return result;
  }

  async register({ email, password, username }) {
    const checkInputEmpty =
      _.isEmpty(email) || _.isEmpty(password) || _.isEmpty(username);
    if (checkInputEmpty) {
      throw new BadRequestRequestError();
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestRequestError();
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      throw new UnauthorizedError();
    }

    const foundUser = await userModel.checkExitUserNameAndEmail({
      username,
      email,
    });

    if (foundUser) {
      throw new BadRequestRequestError();
    }

    const hashPassword = await encodePassword(password);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }

    const result = await userModel.createUser({
      email,
      password: hashPassword,
      username,
    });
    return result;
  }

  async login(res, { email_or_username, password }) {
    const checkInputEmpty = _.isEmpty(email_or_username) || _.isEmpty(password);

    if (checkInputEmpty) {
      throw new BadRequestRequestError();
    }
    const isEmail = validator.isEmail(email_or_username);
    let foundUser;

    if (isEmail) {
      foundUser = await userModel.checkExists({
        email: email_or_username,
      });
    } else {
      foundUser = await userModel.checkExists({
        username: email_or_username,
      });
    }

    if (!foundUser) {
      throw new UnauthorizedError();
    }

    let userInfo;
    const dataInfo = ["id", "username", "email", "role", "password"];
    if (isEmail) {
      userInfo = await userModel.getUserById(
        { email: email_or_username },
        dataInfo
      );
    } else {
      userInfo = await userModel.getUserById(
        { username: email_or_username },
        dataInfo
      );
    }

    const checkPassword = await comparePassword(password, userInfo?.password);

    if (!checkPassword) {
      throw new UnauthorizedError();
    }

    // Remove Token accessToken
    const { password: userPassword, ...userInfoWithoutPassword } = userInfo;

    const resultAccessToken = createTokenJWT(
      userInfoWithoutPassword,
      accessKey,
      TIME_TOKEN.ACCESS
    );
    const resultRefetchToken = createTokenJWT(
      userInfo,
      refetchKey,
      TIME_TOKEN.REFETCH
    );

    const checkEmptyToken =
      _.isEmpty(resultRefetchToken) || _.isEmpty(resultRefetchToken);

    if (checkEmptyToken) {
      throw new BadRequestRequestError();
    }

    if (isEmail) {
      userModel.updateUser(
        {
          refetch_token: resultRefetchToken,
        },
        {
          email: email_or_username,
        }
      );
    } else {
      userModel.updateUser(
        {
          refetch_token: resultRefetchToken,
        },
        {
          username: email_or_username,
        }
      );
    }

    createCookie(res, RefetchToken, resultRefetchToken);

    userInfo.accessToken = resultAccessToken;

    return userInfo;
  }

  async renewToken({ refetchToken }, { accessToken }) {
    if (_.isEmpty(accessToken) || _.isEmpty(refetchToken)) {
      throw new NotFoundError();
    }

    const infoTokenAccess = await verifyTokenJWT(accessToken, accessKey);

    const checkAccessToken = [TOKEN_EXPIRE].includes(infoTokenAccess);

    if (!checkAccessToken) {
      throw new NotFoundError();
    }

    const infoRefetchToken = await verifyTokenJWT(refetchToken, refetchKey);

    const checkRefetchToken = [TOKEN_EXPIRE, INVALID_TOKEN].includes(
      infoTokenAccess
    );

    if (!checkRefetchToken) {
      throw new NotFoundError();
    }
    const dataInfo = ["id", "username", "email", "role"];

    const userInfo = await userModel.getUserById(
      { id: infoRefetchToken.id },
      dataInfo
    );

    const resultAccessToken = createTokenJWT(
      userInfo,
      accessKey,
      TIME_TOKEN.ACCESS
    );

    const checkEmptyToken = _.isEmpty(resultAccessToken);

    if (checkEmptyToken) {
      throw new BadRequestRequestError();
    }

    userInfo.accessToken = resultAccessToken;

    return userInfo;
  }

  async logout(res, { refetchToken }) {
    if (_.isEmpty(refetchToken)) {
      throw new NotFoundError();
    }

    const infoRefetchToken = await verifyTokenJWT(refetchToken, refetchKey);

    const checkRefetchToken = [TOKEN_EXPIRE, INVALID_TOKEN].includes(
      infoRefetchToken
    );

    if (checkRefetchToken) {
      throw new NotFoundError();
    }

    redisInstance.lpush(BlacklistTokens, refetchToken);

    res.clearCookie(RefetchToken);

    return infoRefetchToken;
  }

  async blockRefetchToken({ userId }) {
    if (_.isEmpty(userId)) {
      throw new NotFoundError();
    }

    const dataInfo = ["id", "refetch_token"];

    const userInfo = await userModel.getUserById({ id: userId }, dataInfo);
    if (_.isEmpty(userInfo)) {
      throw new NotFoundError();
    }

    const infoRefetchToken = await verifyTokenJWT(
      userInfo.refetch_token,
      refetchKey
    );

    const checkRefetchToken = [TOKEN_EXPIRE, INVALID_TOKEN].includes(
      infoRefetchToken
    );

    if (checkRefetchToken) {
      throw new NotFoundError();
    }

    const [start, end] = [0, -1];

    const blacklistTokens = await redisInstance.lrange(
      BlacklistTokens,
      start,
      end
    );
    const isTokenInBlacklist = blacklistTokens.includes(userInfo.refetch_token);

    if (isTokenInBlacklist) {
      return userInfo;
    }

    redisInstance.lpush(BlacklistTokens, userInfo.refetch_token);

    return userInfo;
  }

  async forgetPassword(req, { email }) {
    const result = await checkUserSpam({
      key: SpamForget,
      blockDuration: TIME._1_MINUTE,
      delDuration: TIME._3_MINUTE,
      maxRequest: 3,
    });

    if (result === true) {
      if (_.isEmpty(email)) {
        throw new BadRequestRequestError();
      }

      const userInfo = await userModel.getUserById({ email }, [
        "id",
        "username",
      ]);

      if (_.isEmpty(userInfo)) {
        throw new BadRequestRequestError();
      }

      const uniqueString = await generateRandomLink(20);

      if (_.isEmpty(uniqueString)) {
        throw new BadRequestRequestError();
      }

      const _15_minutes = new Date(Date.now() + 15 * 60 * 1000);

      userVerificationModel.createUserVerification({
        user_id: userInfo.id,
        unique_string: uniqueString,
        expires_at: _15_minutes,
      });

      const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
      )}/user/password/reset/${uniqueString}`;

      if (resetPasswordUrl) {
        sendEmail({
          to: email,
          subject: `Forgot Password`,
          template: "forgotPassword",
          attachments: [
            {
              filename: "logo.png",
              path: path.resolve("./src/views", "images", "logo.png"),
              cid: "logoTai",
            },
          ],
          context: {
            username: userInfo.username,
            resetPasswordUrl,
          },
        });
      }

      return resetPasswordUrl;
    }
    throw new BadRequestRequestError(result);
  }

  async resetPassword({ uniqueString }, { password }) {
    const resultInfo = await userVerificationModel.getUserVerificationById(
      {
        unique_string: uniqueString,
      },
      ["user_id", "expires_at"]
    );

    if (_.isEmpty(resultInfo)) {
      throw new BadRequestRequestError();
    }

    const hadExpired = resultInfo.expires_at <= new Date();
    if (hadExpired) {
      throw new GoneError();
    }

    const userInfo = await userModel.getUserById({ id: resultInfo.user_id }, [
      "username",
      "email",
    ]);

    if (_.isEmpty(userInfo)) {
      throw new BadRequestRequestError();
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      throw new UnauthorizedError();
    }

    const hashPassword = await encodePassword(password);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }

    const updateUserPromise = userModel.updateUser(
      { password: hashPassword },
      { id: resultInfo.user_id }
    );

    const deleteIdPromise = userVerificationModel.deleteId({
      user_id: resultInfo.user_id,
    });

    Promise.all([updateUserPromise, deleteIdPromise]);

    sendEmail({
      to: userInfo.email,
      subject: `Reset ThankYou!`,
      template: "resetThankYou",
      context: {
        username: userInfo.username,
      },
    });

    return resultInfo;
  }

  async changePassword({ id, username, email }, { password }) {
    if (_.isEmpty(id) || _.isEmpty(password)) {
      throw new BadRequestRequestError();
    }

    const foundUser = await userModel.checkExists({
      id,
    });

    if (!foundUser) {
      throw new UnauthorizedError();
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      throw new UnauthorizedError();
    }

    const hashPassword = await encodePassword(password);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }

    userModel.updateUser({ password: hashPassword }, { id });

    sendEmail({
      to: email,
      subject: `Change Password Thank You!`,
      template: "changePasswordThankYou",
      context: {
        username,
      },
    });

    return id;
  }

  async acceptResetLogin(res, { refetchToken }) {
    return await this.logout(res, { refetchToken });
  }
}

module.exports = new UserService();
