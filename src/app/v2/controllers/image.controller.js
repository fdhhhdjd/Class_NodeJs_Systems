//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const imageService = require("../services/image.service");

class UploadController {
  async upload(req, res, ___) {
    new SuccessResponse({
      metadata: await imageService.upload(req.userInfo, req.file),
    }).send(res);
  }

  async uploadMulti(req, res, ___) {
    new SuccessResponse({
      metadata: await imageService.uploadMulti(req.userInfo, {
        files: req.files,
      }),
    }).send(res);
  }

  async removeImage(req, res, ___) {
    new SuccessResponse({
      metadata: await imageService.removePublicId(req.body),
    }).send(res);
  }
}

module.exports = new UploadController();
