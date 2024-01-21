//* IMPORT
const KNEX = require("../databases/init.postgresql");

module.exports = {
  createUser: (data) =>
    new Promise((resolve, reject) => {
      try {
        const result = KNEX("user")
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
        const result = KNEX("user").update(data).where(query).returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  deleteId: async (query) => {
    const result = KNEX("user").del().where(query).returning(["id"]);
    return result;
  },

  getUserById: async (query, data) => {
    const result = await KNEX("user").select(data).where(query);
    return result;
  },

  getAllUser: async (data) => {
    const result = await KNEX("user")
      .select(data)
      .orderBy("created_at", "desc");
    return result;
  },
};
