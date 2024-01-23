// IMPORT
const pool = require("../databases/init.pg");

module.exports = {
  getUserById: async ({ id }, data) => {
    try {
      // Lấy tên các cột từ data
      const columns = Object.values(data).join(", ");

      const result = await pool.query({
        text: `SELECT ${columns} FROM public.user WHERE id = $1`,
        values: [id],
      });

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getAllUser: async (data) => {
    try {
      const columns = Object.values(data).join(", ");

      const result = await pool.query({
        text: `SELECT ${columns} FROM public.user ORDER BY created_at DESC`,
      });

      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};
