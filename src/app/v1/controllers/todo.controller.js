//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const todoService = require("../services/todo.service");

class TodoController {
  async getAll(_, res, ___) {
    new SuccessResponse({
      metadata: await todoService.getAll(),
    }).send(res);
  }

  async getDetail(req, res, ____) {
    new SuccessResponse({
      metadata: await todoService.getDetail(req.params),
    }).send(res);
  }

  async create(req, res, ___) {
    new Created({
      metadata: await todoService.create(req.body),
    }).send(res);
  }

  async update(req, res, ___) {
    new SuccessResponse({
      metadata: await todoService.update(req.body, req.params),
    }).send(res);
  }

  async upsert(req, res, ___) {
    new SuccessResponse({
      metadata: await todoService.upsert(req.body),
    }).send(res);
  }

  async deleteTodoAssignLabel(req, res, ___) {
    new SuccessResponse({
      metadata: await todoService.deleteTodoAssignLabel(req.body),
    }).send(res);
  }

  async delete(req, res, ___) {
    new SuccessResponse({
      metadata: await todoService.delete(req.params),
    }).send(res);
  }
}

module.exports = new TodoController();
