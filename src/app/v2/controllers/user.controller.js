//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const userService = require("../services/user.service");

class UserV2Controller {
  async loginPhone(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.loginPhone(req.body),
    }).send(res);
  }
  async verifyOTP(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.verifyOTP(res, req.body),
    }).send(res);
  }

  async loginGooglePopup(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.loginGooglePopup(res, req.body),
    }).send(res);
  }
}

module.exports = new UserV2Controller();
