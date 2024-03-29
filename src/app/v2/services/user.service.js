//* LIB
const otpGenerator = require("otp-generator");
const _ = require("lodash");

//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const {
  formatPhone,
  splitUsername,
} = require("../../../commons/utils/convert");
const sendEmail = require("../../../commons/utils/sendEmail");
const userOtpModel = require("../models/user_otp.model");
const { checkUserSpam } = require("../../../auth/auth.blacklist");
const { SpamOTP } = require("../../../commons/keys/spam");
const { TIME, TIME_TOKEN } = require("../../../commons/constants");
const { createTokenJWT } = require("../../../auth/auth.token");
const userModel = require("../../v1/models/user.model");
const {
  app: { accessKey, refetchKey },
} = require("../../../commons/configs/app.config");
const { RefetchToken } = require("../../../commons/keys/token");
const { createCookie } = require("../../../auth/auth.cookie");
const CheckFieldsBuilder = require("../../../commons/helpers/checkFieldsBuilder");

class UserV2Service {
  async loginPhone({ phone }) {
    const resultSpam = await checkUserSpam({
      key: SpamOTP,
      blockDuration: TIME._1_MINUTE,
      delDuration: TIME._3_MINUTE,
      maxRequest: 3,
    });

    if (resultSpam) {
      throw new BadRequestRequestError(resultSpam);
    }
    const checkFieldsBuilder = new CheckFieldsBuilder();

    const fields = checkFieldsBuilder.setPhone(phone).build();

    const formatPhoneVietnamese = formatPhone(fields.phone);

    const result = await userModel.getUserById(
      { phone: formatPhoneVietnamese },
      ["username", "email", "id"]
    );

    if (_.isEmpty(result)) {
      throw new BadRequestRequestError();
    }

    this.sendOTP(result);
    return `OTP had send email ${result.email}`;
  }

  async sendOTP({ username, email, id }) {
    const OTP = await otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const _5_minutes = new Date(Date.now() + 5 * 60 * 1000);

    userOtpModel.createUserOtp({
      user_id: id,
      otp: OTP,
      expires_at: _5_minutes,
    });

    sendEmail({
      to: email,
      subject: `Send OTP Login Phone`,
      template: "otpPhone",
      context: {
        username,
        otp: OTP,
      },
    });
    return OTP;
  }

  async verifyOTP(res, { otp }) {
    if (_.isEmpty(otp)) {
      throw new BadRequestRequestError();
    }

    if (_.isNaN(_.toNumber(otp))) {
      throw new BadRequestRequestError("Otp must be a number");
    }

    const result = await userOtpModel.getUserOTPById(
      {
        otp,
      },
      ["user_id"]
    );

    if (_.isEmpty(result)) {
      throw new BadRequestRequestError("Login Phone Failed");
    }
    const dataInfo = ["id", "username", "email", "role", "password"];

    const userInfo = await userModel.getUserById(
      { id: result.user_id },
      dataInfo
    );
    const resultAccessToken = createTokenJWT(
      userInfo,
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

    const resultUpdatePromise = userModel.updateUser(
      {
        refetch_token: resultRefetchToken,
      },
      {
        id: result.user_id,
      }
    );

    const resultDeleteOtpPromise = userOtpModel.deleteId({
      user_id: result.user_id,
    });

    Promise.all([resultUpdatePromise, resultDeleteOtpPromise]);

    createCookie(res, RefetchToken, resultRefetchToken);

    userInfo.accessToken = resultAccessToken;

    return userInfo;
  }

  async loginGooglePopup(res, info) {
    if (_.isEmpty(info)) {
      throw new BadRequestRequestError();
    }

    info.username = splitUsername(info.email);

    const resultUser = await userModel.upsertUser({
      email: info.email,
      username: info.username,
    });

    if (_.isEmpty(resultUser)) {
      throw new BadRequestRequestError();
    }

    const { id } = resultUser[0];

    const dataInfo = ["id", "username", "email", "role"];

    const userInfo = await userModel.getUserById({ id }, dataInfo);
    const resultAccessToken = createTokenJWT(
      userInfo,
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

    userModel.updateUser(
      {
        refetch_token: resultRefetchToken,
      },
      {
        id,
      }
    );

    createCookie(res, RefetchToken, resultRefetchToken);

    userInfo.accessToken = resultAccessToken;

    return userInfo;
  }
}

module.exports = new UserV2Service();
