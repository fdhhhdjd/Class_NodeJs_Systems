//* IMPORT
const knexInstance = require("../../../databases/init.knex");

module.exports = {
  create: (data) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("label")
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
        const result = knexInstance("label")
          .update(data)
          .where(query)
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  deleteId: async (query) => {
    const result = knexInstance("label").del().where(query).returning(["id"]);
    return result;
  },

  getById: async (query, data) => {
    const result = await knexInstance("label").select(data).where(query);
    return result;
  },

  getAll: async (data) => {
    const result = await knexInstance("label")
      .select(data)
      .orderBy("created_at", "desc");
    return result;
  },
};
