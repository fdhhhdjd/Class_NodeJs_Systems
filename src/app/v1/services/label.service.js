//* IMPORT
const labelModel = require("../models/label.model");

class LabelService {
  // Todo 1. Get all
  async getAll() {
    const data = {
      id: "id",
      name: "name",
    };
    const result = await labelModel.getAll(data);
    return result;
  }

  // Todo 2. Get detail
  async getDetail({ labelId }) {
    const data = {
      id: "id",
      name: "name",
    };
    const result = await labelModel.getById({ id: labelId }, data);
    return result;
  }

  // Todo 3. Create
  async create({ name }) {
    const result = await labelModel.create({ name });
    return result;
  }

  // Todo 4. Update
  async update({ name }, { labelId }) {
    const result = await labelModel.update({ name }, { id: Number(labelId) });
    return result;
  }

  // Todo 5. Delete id
  async delete({ labelId }) {
    const result = await labelModel.deleteId({ id: Number(labelId) });
    return result;
  }
}

module.exports = new LabelService();
