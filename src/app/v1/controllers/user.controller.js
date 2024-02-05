//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const userService = require("../services/user.service");

class UserController {
  async getAll(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.getAll(req),
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

  async register(req, res, ___) {
    new Created({
      metadata: await userService.register(req.body),
    }).send(res);
  }

  async login(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.login(res, req.body),
    }).send(res);
  }

  async renewToken(req, res, ___) {
    const refetchToken = req?.cookies?.refresh_token;
    new SuccessResponse({
      metadata: await userService.renewToken({ refetchToken }, req.body),
    }).send(res);
  }

  async logout(req, res, ___) {
    const refetchToken = req?.cookies?.refresh_token;
    new SuccessResponse({
      metadata: await userService.logout(res, { refetchToken }),
    }).send(res);
  }

  async blockRefetchToken(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.blockRefetchToken(req.body),
    }).send(res);
  }
}

module.exports = new UserController();
