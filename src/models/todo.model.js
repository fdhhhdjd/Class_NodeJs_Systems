//* IMPORT
const knexInstance = require("../databases/init.knex");

module.exports = {
  create: (data) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("todo_list")
          .insert(data)
          .onConflict("id")
          .merge()
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  update: async (data, query) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("todo_list")
          .update(data)
          .where(query)
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  deleteId: async (query) => {
    const result = knexInstance("todo_list")
      .del()
      .where(query)
      .returning(["id"]);
    return result;
  },

  getById: async (query, data) => {
    const result = await knexInstance("todo_list")
      .join("user", "todo_list.user_id", "=", "user.id")
      .select(data)
      .where(query);
    return result;
  },

  getCount: async () => {
    const result = await knexInstance("todo_list").count().first();

    return result.count;
  },

  getAll: async (data) => {
    const result = await knexInstance("todo_list_label")
      .fullOuterJoin(
        "todo_list",
        "todo_list.id",
        "=",
        "todo_list_label.todo_list_id"
      )
      .join("user", "todo_list.user_id", "=", "user.id")
      .leftJoin("label", "label.id", "=", "todo_list_label.label_id")
      .select(
        {
          nameLabel: "label.name",
        },
        data
      )
      .orderBy("todo_list.created_at", "desc");

    const resultCount = await module.exports.getCount();

    return { count: resultCount, result };
  },
};
