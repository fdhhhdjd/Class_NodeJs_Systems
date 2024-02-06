//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const imageService = require("../services/image.service");

class UploadController {
  async upload(_, res, ___) {
    new SuccessResponse({
      metadata: await imageService.upload(),
    }).send(res);
  }
}

module.exports = new UploadController();
