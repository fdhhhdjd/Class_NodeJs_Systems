const todoService = require("../services/todo.service");

class TodoController {
  async getAll(_, res, __) {
    return res.status(200).json({
      message: "Get all Success",
      metadata: await todoService.getAll(),
    });
  }

  async getDetail(req, res, _) {
    return res.status(200).json({
      message: "Get detail Success",
      metadata: await todoService.getDetail(req.params),
    });
  }

  async create(req, res, _) {
    return res.status(201).json({
      message: "Create success",
      metadata: await todoService.create(req.body),
    });
  }

  async update(req, res, _) {
    return res.status(200).json({
      message: "Update success",
      metadata: await todoService.update(req.body, req.params),
    });
  }

  async upsert(req, res, _) {
    return res.status(200).json({
      message: "Upsert success",
      metadata: await todoService.upsert(req.body),
    });
  }

  async deleteTodoAssignLabel(req, res, _) {
    return res.status(200).json({
      message: "Upsert success",
      metadata: await todoService.deleteTodoAssignLabel(req.body),
    });
  }

  async delete(req, res, _) {
    return res.status(200).json({
      message: "Delete success",
      metadata: await todoService.delete(req.params),
    });
  }
}

module.exports = new TodoController();
