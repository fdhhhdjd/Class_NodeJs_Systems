const labelService = require("../services/label.service");

class LabelController {
  async getAll(_, res, __) {
    return res.status(200).json({
      message: "Get all Success",
      metadata: await labelService.getAll(),
    });
  }

  async getDetail(req, res, _) {
    return res.status(200).json({
      message: "Get detail Success",
      metadata: await labelService.getDetail(req.params),
    });
  }

  async create(req, res, _) {
    return res.status(201).json({
      message: "Create success",
      metadata: await labelService.create(req.body),
    });
  }

  async update(req, res, _) {
    return res.status(200).json({
      message: "Update success",
      metadata: await labelService.update(req.body, req.params),
    });
  }

  async delete(req, res, _) {
    return res.status(200).json({
      message: "Delete success",
      metadata: await labelService.delete(req.params),
    });
  }
}

module.exports = new LabelController();
