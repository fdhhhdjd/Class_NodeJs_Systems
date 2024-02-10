//* LIB
const otpGenerator = require("otp-generator");
const _ = require("lodash");
const validator = require("validator");

//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const { formatPhone } = require("../../../commons/utils/convert");
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

class UserV2Service {
  async loginPhone({ phone }) {
    const result = await checkUserSpam({
      key: SpamOTP,
      blockDuration: TIME._1_MINUTE,
      delDuration: TIME._3_MINUTE,
      maxRequest: 3,
    });

    if (result) {
      if (validator.isEmpty(phone)) {
        throw new BadRequestRequestError();
      }

      if (!validator.isNumeric(phone)) {
        throw new BadRequestRequestError("Number must be a number");
      }

      if (!validator.isLength(phone, { min: 10, max: 11 })) {
        throw new BadRequestRequestError("Number must be between 10 and 11");
      }

      if (!/^(0\d{9}|84\d{9})$/.test(phone)) {
        throw new BadRequestRequestError("Number must be vietnamese");
      }

      const formatPhoneVietnamese = formatPhone(phone);

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
    throw new BadRequestRequestError(result);
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
}

module.exports = new UserV2Service();
