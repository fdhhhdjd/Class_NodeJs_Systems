//* LIB
const otpGenerator = require("otp-generator");
const _ = require("lodash");
const validator = require("validator");
const userModel = require("../../v1/models/user.model");

//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const { formatPhone } = require("../../../commons/utils/convert");
const { firebase } = require("../../../databases/init.firebase");
const sendEmail = require("../../../commons/utils/sendEmail");

class UserV2Service {
  async loginPhone({ phone }) {
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
      ["username", "email"]
    );

    if (_.isEmpty(result)) {
      throw new BadRequestRequestError();
    }

    this.sendOTP(result);
    return `OTP had send email ${result.email}`;
  }

  async sendOTP({ username, email }) {
    const OTP = await otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
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

  async verifyOTP(confirmationResult, verificationCode) {
    return "ok";
  }
}

module.exports = new UserV2Service();
