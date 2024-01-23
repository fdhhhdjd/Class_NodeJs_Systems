//* IMPORT
const userModel = require("../models/user.model");

class UserService {
  async getAll() {
    const data = {
      id: "id",
      username: "username",
      email: "email",
    };
    const result = await userModel.getAllUser(data);
    return result;
  }

  async getDetail({ userId }) {
    const data = {
      id: "id",
      username: "username",
      email: "email",
    };
    const result = await userModel.getUserById({ id: userId }, data);
    return result;
  }

  async getTodoFollowUser({ userId }) {
    const data = {
      id: "todo_list.id",
      title: "todo_list.title",
      username: "user.username",
      email: "user.email",
    };

    const result = await userModel.getTodoFollowUser(
      { "user.id": userId },
      data
    );
    return result;
  }

  async create({ username, email, password }) {
    const result = await userModel.createUser({ username, email, password });
    return result;
  }

  async update({ username, email, password }, { userId }) {
    const result = await userModel.updateUser(
      { username, email, password },
      { id: Number(userId) }
    );
    return result;
  }

  async delete({ userId }) {
    const result = await userModel.deleteId({ id: Number(userId) });
    return result;
  }
}

module.exports = new UserService();
