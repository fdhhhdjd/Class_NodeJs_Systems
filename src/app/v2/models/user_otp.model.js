//* IMPORT
const knexInstance = require("../../../databases/init.knex");

module.exports = {
  createUserOtp: (data) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("user_otp")
          .insert(data)
          .onConflict("id")
          .merge()
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  deleteExpiredRecords: () =>
    new Promise((resolve, reject) => {
      try {
        const currentTime = new Date();

        const result = knexInstance("user_otp")
          .del()
          .where("expires_at", "<=", currentTime)
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),

  deleteId: async (query) => {
    const result = knexInstance("user_otp")
      .del()
      .where(query)
      .returning(["id"]);
    return result;
  },

  getUserOTPById: async (query, data) => {
    const result = await knexInstance("user_otp")
      .select(data)
      .where(query)
      .first();
    return result;
  },
};
