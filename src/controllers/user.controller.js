const userService = require("../services/user.service");

class UserController {
  async getAll(req, res, next) {
    return res.status(200).json({
      message: "Get all Success",
      metadata: await userService.getAll(),
    });
  }

  async getDetail(req, res, next) {
    return res.status(200).json({
      message: "Get detail Success",
      metadata: await userService.getDetail(req.params),
    });
  }

  async create(req, res, next) {
    return res.status(201).json({
      message: "Create success",
      metadata: await userService.create(req.body),
    });
  }

  async update(req, res, next) {
    return res.status(200).json({
      message: "Update success",
      metadata: await userService.update(req.body, req.params),
    });
  }

  async delete(req, res, next) {
    return res.status(200).json({
      message: "Delete success",
      metadata: await userService.delete(req.params),
    });
  }
}

module.exports = new UserController();
