//* LIB
const _ = require("lodash");
const { UnauthorizedError, NotFoundError } = require("../cores/error.response");
const { verifyTokenJWT } = require("./auth.token");

//* IMPORT
const {
  app: { accessKey },
} = require("../commons/configs/app.config");
const { TOKEN_EXPIRE, INVALID_TOKEN } = require("../commons/constants");

const checkAuthorizationAccessToken = async (req, __, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const isTokenEmpty = _.isEmpty(token);

    if (isTokenEmpty) {
      next(new UnauthorizedError());
    }

    const infoToken = await verifyTokenJWT(token, accessKey);

    const checkToken = [TOKEN_EXPIRE, INVALID_TOKEN].includes(infoToken);

    if (checkToken) {
      req.accessToken = token;
      next(new UnauthorizedError());
    }

    req.userInfo = infoToken;
    req.accessToken = token;

    next();
  } catch (error) {
    next(new NotFoundError(error));
  }
};

module.exports = {
  checkAuthorizationAccessToken,
};
