//* IMPORT
const userModel = require("../models/user.model");

class UserService {
  // Todo 1. Get all
  async getAll() {
    const data = {
      id: "id",
      username: "username",
      email: "email",
    };
    const result = await userModel.getAllUser(data);
    return result;
  }

  // Todo 2. Get detail
  async getDetail({ userId }) {
    const data = {
      id: "id",
      username: "username",
      email: "email",
    };
    const result = await userModel.getUserById({ id: userId }, data);
    return result;
  }

  // Todo 3. Create detail
  async create({ username, email, password }) {
    const result = await userModel.createUser({ username, email, password });
    return result;
  }

  // Todo 4. Update detail
  async update({ username, email, password }, { userId }) {
    const result = await userModel.updateUser(
      { username, email, password },
      { id: Number(userId) }
    );
    return result;
  }

  // Todo 5. Delete id
  async delete({ userId }) {
    const result = await userModel.deleteId({ id: Number(userId) });
    return result;
  }
}

module.exports = new UserService();
