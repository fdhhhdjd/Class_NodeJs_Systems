//* IMPORT
const knexInstance = require("../../../databases/init.knex");

module.exports = {
  createUserVerification: (data) =>
    new Promise((resolve, reject) => {
      try {
        const result = knexInstance("user_verification")
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

        const result = knexInstance("user_verification")
          .del()
          .where("expires_at", "<=", currentTime)
          .returning(["id"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }),
};
