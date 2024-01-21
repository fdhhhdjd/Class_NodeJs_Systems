//* IMPORT
const knexInstance = require("../databases/init.knex");

module.exports = {
  upSertTodoWithLabel: async (data) => {
    try {
      const queryResult = await knexInstance("todo_list_label")
        .insert(data)
        .onConflict("label_id")
        .merge()
        .returning(["todo_list_id", "label_id"]);

      return queryResult;
    } catch (error) {
      throw error;
    }
  },
  deleteTodoAssignLabel: async (query) => {
    try {
      const result = knexInstance("todo_list_label")
        .del()
        .where(query)
        .returning(["label_id"]);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
