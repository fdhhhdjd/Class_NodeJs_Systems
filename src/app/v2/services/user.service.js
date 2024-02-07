//* LIB
const otpGenerator = require("otp-generator");
const _ = require("lodash");
const validator = require("validator");
const userModel = require("../../v1/models/user.model");

//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const { formatPhone } = require("../../../commons/utils/convert");
const sendEmail = require("../../../commons/utils/sendEmail");
const userOtpModel = require("../models/user_otp.model");
const { checkUserSpam } = require("../../../auth/auth.blacklist");
const { SpamOTP } = require("../../../commons/keys/spam");
const { TIME } = require("../../../commons/constants");

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

  async verifyOTP({ otp }) {
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

    return result;
  }
}

module.exports = new UserV2Service();
