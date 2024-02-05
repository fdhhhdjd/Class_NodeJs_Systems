//* LIB
const _ = require("lodash");
const validator = require("validator");

//* IMPORT
const {
  BadRequestRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../../cores/error.response");
const userModel = require("../models/user.model");
const { createTokenJWT, verifyTokenJWT } = require("../../../auth/auth.token");

const {
  app: { accessKey, refetchKey },
} = require("../../../commons/configs/app.config");
const {
  TIME_TOKEN,
  TOKEN_EXPIRE,
  INVALID_TOKEN,
} = require("../../../commons/constants");
const { createCookie } = require("../../../auth/auth.cookie");
const { RefetchToken } = require("../../../commons/keys/token");
const {
  encodePassword,
  comparePassword,
} = require("../../../auth/auth.password");
const redisInstance = require("../../../databases/init.redis");
const { BlacklistTokens } = require("../../../commons/keys/blacklist");
const { generateRandomPassword } = require("../../../commons/utils/random");
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
    const data = {
      id: "id",
      username: "username",
      email: "email",
    };
    const result = await userModel.getUserById({ id: userId }, data);
    return result;
  }

  async getTodoFollowUser({ userId }) {
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
    const randomPassword = generateRandomPassword(20);
    console.log(randomPassword);
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
    const result = await userModel.updateUser(
      { username, email, password },
      { id: userId }
    );
    return result;
  }

  async delete({ userId }) {
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

    const foundUser = await userModel.checkExists(
      {
        email,
      },
      {
        id: "id",
      }
    );

    if (foundUser) {
      throw new UnauthorizedError();
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

    if (!userInfo) {
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
}

module.exports = new UserService();
