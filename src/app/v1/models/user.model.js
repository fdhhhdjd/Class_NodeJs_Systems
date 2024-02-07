//* IMPORT
const knexInstance = require("../../../databases/init.knex");

module.exports = {
  createUser: (data) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("user")
          .insert(data)
          .onConflict("id")
          .merge()
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  updateUser: async (data, query) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("user")
          .update(data)
          .where(query)
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  deleteId: async (query) => {
    const result = knexInstance("user").del().where(query).returning(["id"]);
    return result;
  },

  getUserById: async (query, data) => {
    const result = await knexInstance("user").select(data).where(query).first();
    return result;
  },

  checkExists: async (query) => {
    const result = await knexInstance("user")
      .where(query)
      .select(knexInstance.raw("1"))
      .first();
    return !!result;
  },

  checkExitUserNameAndEmail: async ({ username, email, phone, userId }) => {
    let query = knexInstance("user");

    if (username) {
      query = query.where({ username });
    }

    if (email) {
      query = query.orWhere({ email });
    }

    if (phone) {
      query = query.orWhere({ phone });
    }

    if (userId) {
      query = query.whereNot({ id: userId });
    }

    const result = await query.select(knexInstance.raw("1")).first();
    return !!result;
  },

  getAllUser: async (data) => {
    const result = await knexInstance("user")
      .select(data)
      .orderBy("created_at", "desc");
    return result;
  },

  getTodoFollowUser: async (query, data) => {
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
      .where(query);

    return result;
  },
};
