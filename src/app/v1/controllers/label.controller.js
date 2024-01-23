//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const labelService = require("../services/label.service");

class LabelController {
  async getAll(_, res, ___) {
    new SuccessResponse({
      metadata: await labelService.getAll(),
    }).send(res);
  }

  async getDetail(req, res, ___) {
    new SuccessResponse({
      metadata: await labelService.getDetail(req.params),
    }).send(res);
  }

  async create(req, res, ___) {
    new Created({
      metadata: await labelService.create(req.body),
    }).send(res);
  }

  async update(req, res, ___) {
    new SuccessResponse({
      metadata: await labelService.update(req.body, req.params),
    }).send(res);
  }

  async delete(req, res, ___) {
    new SuccessResponse({
      metadata: await labelService.delete(req.params),
    }).send(res);
  }
}

module.exports = new LabelController();
