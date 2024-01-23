//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const userService = require("../services/user.service");

class UserController {
  async getAll(_, res, ___) {
    new SuccessResponse({
      metadata: await userService.getAll(),
    }).send(res);
  }

  async getDetail(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.getDetail(req.params),
    }).send(res);
  }

  async getTodoFollowUser(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.getTodoFollowUser(req.params),
    }).send(res);
  }

  async create(req, res, ___) {
    new Created({
      metadata: await userService.create(req.body),
    }).send(res);
  }

  async update(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.update(req.body, req.params),
    }).send(res);
  }

  async delete(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.delete(req.params),
    }).send(res);
  }
}

module.exports = new UserController();
