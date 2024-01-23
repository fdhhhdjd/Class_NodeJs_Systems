//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const todoModel = require("../models/todo.model");
const todoListLabelModel = require("../models/todo_list_label");

class TodoService {
  // Todo 1. Get all
  async getAll() {
    const data = {
      id: "todo_list.id",
      title: "todo_list.title",
      username: "user.username",
      email: "user.email",
    };
    const result = await todoModel.getAll(data);
    return result;
  }

  // Todo 2. Get detail
  async getDetail({ todoId }) {
    if (!todoId) throw new BadRequestRequestError();

    const data = {
      id: "todo_list.id",
      title: "todo_list.title",
      username: "user.username",
      email: "user.email",
    };
    const result = await todoModel.getById({ "todo_list.id": todoId }, data);
    return result;
  }

  // Todo 3. Create
  async create({ title, user_id }) {
    const result = await todoModel.create({ title, user_id });
    return result;
  }

  // Todo 4. Update
  async update({ title, user_id }, { todoId }) {
    const result = await todoModel.update(
      { title, user_id },
      { id: Number(todoId) }
    );
    return result;
  }

  // Todo 5. Upsert
  async upsert({ todo_list_id, label_id }) {
    const result = await todoListLabelModel.upSertTodoWithLabel({
      todo_list_id,
      label_id,
    });
    return result;
  }

  // Todo 6. Delete todo label
  async deleteTodoAssignLabel({ todo_list_id, label_id }) {
    const result = await todoListLabelModel.deleteTodoAssignLabel({
      todo_list_id: Number(todo_list_id),
      label_id: Number(label_id),
    });
    return result;
  }

  // Todo 6. Delete id
  async delete({ todoId }) {
    console.log(todoId);
    const result = await todoModel.deleteId({ id: Number(todoId) });
    return result;
  }
}

module.exports = new TodoService();
