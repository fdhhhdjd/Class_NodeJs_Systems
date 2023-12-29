const todoService = require("../services/todo.service");

class TodoController {
  // Todo 1. Get all
  async getAll(req, res, next) {
    return res.status(200).json({
      message: "Get all Success",
      metadata: await todoService.getAll(),
    });
  }

  // Todo 2. Get detail
  async getDetail(req, res, next) {
    return res.status(200).json({
      message: "Get detail Success",
      metadata: await todoService.getDetail(req.params),
    });
  }

  // Todo 3. Create detail
  async create(req, res, next) {}

  // Todo 4. Update detail
  async update(req, res, next) {}

  // Todo 5. Delete id
  async delete(req, res, next) {}
}

module.exports = new TodoController();
