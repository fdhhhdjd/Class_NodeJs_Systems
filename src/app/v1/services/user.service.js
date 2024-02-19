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
const CheckFieldsBuilder = require("../../../commons/helpers/checkFieldsBuilder");
const notificationService = require("../../v2/services/notification.service");
class UserService {
  async getAll(req) {
    const data = {
      id: "id",
      username: "username",
      email: "email",
      password: "password",
      refetch_token: "refetch_token",
      phone: "phone",
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
    const checkFieldsBuilder = new CheckFieldsBuilder();

    const fields = checkFieldsBuilder
      .setUsername(username)
      .setEmail(email)
      .build();

    const foundUser = await userModel.checkExitUserNameAndEmail(fields);

    if (foundUser) {
      throw new BadRequestRequestError();
    }

    const randomPassword = generateRandomString(10);

    if (!randomPassword) {
      throw new BadRequestRequestError();
    }

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

  async update({ username, email, password, phone }, { userId }) {
    const updateFieldsBuilder = new CheckFieldsBuilder();

    if (username !== undefined) {
      updateFieldsBuilder.setUsername(username);
    }

    if (email !== undefined) {
      updateFieldsBuilder.setEmail(email);
    }

    if (password !== undefined) {
      updateFieldsBuilder.setPassword(password);
    }

    if (phone !== undefined) {
      updateFieldsBuilder.setPhone(phone);
    }

    const updateFields = updateFieldsBuilder.build();

    if (Object.keys(updateFields).length !== 0) {
      updateFields.userId = userId;
      const duplicateUser = await userModel.checkExitUserNameAndEmail(
        updateFields
      );
      if (duplicateUser) {
        throw new BadRequestRequestError(
          "Username or email or phone already exists"
        );
      }

      userModel.updateUser(updateFields, { id: userId });
    }

    return userId;
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
    const checkFieldsBuilder = new CheckFieldsBuilder();

    const fields = checkFieldsBuilder
      .setEmail(email)
      .setUsername(username)
      .setPassword(password)
      .build();

    const foundUser = await userModel.checkExitUserNameAndEmail({
      username: fields.username,
      email: fields.email,
    });

    if (foundUser) {
      throw new BadRequestRequestError();
    }

    const hashPassword = await encodePassword(fields.password);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }

    fields.password = hashPassword;

    const result = await userModel.createUser(fields);
    return result;
  }

  async login(res, { email_or_username, password, deviceId }) {
    const checkFieldsBuilder = new CheckFieldsBuilder();

    checkFieldsBuilder.setPassword(password);

    const isEmail = validator.isEmail(email_or_username);
    let foundUser;

    if (isEmail) {
      checkFieldsBuilder.setEmail(email_or_username);
      foundUser = await userModel.checkExists({
        email: email_or_username,
      });
    } else {
      checkFieldsBuilder.setUsername(email_or_username);
      foundUser = await userModel.checkExists({
        username: email_or_username,
      });
    }

    if (!foundUser) {
      throw new UnauthorizedError();
    }

    const fields = checkFieldsBuilder.build();

    let userInfo;
    const dataInfo = ["id", "username", "email", "role", "password"];
    if (isEmail) {
      userInfo = await userModel.getUserById({ email: fields.email }, dataInfo);
    } else {
      userInfo = await userModel.getUserById(
        { username: fields.username },
        dataInfo
      );
    }

    const checkPassword = await comparePassword(
      fields.password,
      userInfo?.password
    );

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
          email: fields.email,
        }
      );
    } else {
      userModel.updateUser(
        {
          refetch_token: resultRefetchToken,
        },
        {
          username: fields.username,
        }
      );
    }

    createCookie(res, RefetchToken, resultRefetchToken);

    userInfo.accessToken = resultAccessToken;

    if (deviceId) {
      notificationService.sendDeviceId({
        deviceId,
        notification: {
          title: "Login Success!!",
          body: "Did you just login ?",
          mutable_content: true,
        },
      });
    }

    return userInfo;
  }

  async renewToken({ refetchToken }, { accessToken }) {
    const checkFieldsBuilder = new CheckFieldsBuilder();

    const fields = checkFieldsBuilder
      .setAccessToken(accessToken)
      .setRefetchToken(refetchToken)
      .build();

    const infoTokenAccess = await verifyTokenJWT(fields.accessToken, accessKey);

    const checkAccessToken = [TOKEN_EXPIRE].includes(infoTokenAccess);

    if (!checkAccessToken) {
      throw new NotFoundError();
    }

    const infoRefetchToken = await verifyTokenJWT(
      fields.refetchToken,
      refetchKey
    );

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
    const fields = new CheckFieldsBuilder()
      .setRefetchToken(refetchToken)
      .build();

    const infoRefetchToken = await verifyTokenJWT(
      fields.refetchToken,
      refetchKey
    );

    const checkRefetchToken = [TOKEN_EXPIRE, INVALID_TOKEN].includes(
      infoRefetchToken
    );

    if (checkRefetchToken) {
      throw new NotFoundError();
    }

    redisInstance.lpush(BlacklistTokens, fields.refetchToken);

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
    const fields = new CheckFieldsBuilder().setEmail(email).build();

    const result = await checkUserSpam({
      key: SpamForget,
      blockDuration: TIME._1_MINUTE,
      delDuration: TIME._3_MINUTE,
      maxRequest: 3,
    });

    if (result === true) {
      const userInfo = await userModel.getUserById({ email: fields.email }, [
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
    const fields = new CheckFieldsBuilder()
      .setGeneralRandomString(uniqueString)
      .setPassword(password)
      .build();

    const resultInfo = await userVerificationModel.getUserVerificationById(
      {
        unique_string: fields.string,
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

    const hashPassword = await encodePassword(fields.password);

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
    const fields = new CheckFieldsBuilder()
      .setId(id)
      .setEmail(email)
      .setUsername(username)
      .setPassword(password)
      .build();

    const foundUser = await userModel.checkExists({
      id: fields.id,
    });

    if (!foundUser) {
      throw new UnauthorizedError();
    }

    const hashPassword = await encodePassword(fields.password);

    if (!hashPassword) {
      throw new BadRequestRequestError();
    }

    userModel.updateUser({ password: hashPassword }, { id: fields.id });

    sendEmail({
      to: fields.email,
      subject: `Change Password Thank You!`,
      template: "changePasswordThankYou",
      context: {
        username: fields.username,
      },
    });

    const { password: removePassword, ...newData } = fields;

    return newData;
  }

  async acceptResetLogin(res, { refetchToken }) {
    const fields = new CheckFieldsBuilder()
      .setRefetchToken(refetchToken)
      .build();
    return await this.logout(res, { refetchToken: fields.refetchToken });
  }
}

module.exports = new UserService();
