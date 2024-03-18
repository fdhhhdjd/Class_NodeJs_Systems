//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const userService = require("../services/user.service");

class UserController {
  async getAll(req, res, ___) {
    const queryPage = req.query.page ? Number(req.query.page) : 0;
    const queryLimit = req.query.limit ? Number(req.query.limit) : 0;
    const querySearch = req.query.search;

    new SuccessResponse({
      metadata: await userService.getAll(
        req,
        queryPage,
        queryLimit,
        querySearch
      ),
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
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const refetchToken = req?.cookies?.refresh_token;
    new SuccessResponse({
      metadata: await userService.renewToken({ refetchToken }, { accessToken }),
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

  async forgetPassword(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.forgetPassword(req, req.body),
    }).send(res);
  }

  async resetPassword(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.resetPassword(req.params, req.body),
    }).send(res);
  }

  async changePassword(req, res, ___) {
    new SuccessResponse({
      metadata: await userService.changePassword(req.userInfo, req.body),
    }).send(res);
  }

  async acceptResetLogin(req, res, ___) {
    const refetchToken = req?.cookies?.refresh_token;
    new SuccessResponse({
      metadata: await userService.acceptResetLogin(res, { refetchToken }),
    }).send(res);
  }
}

module.exports = new UserController();
