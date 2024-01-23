//* LIB
const KNEX = require("knex");
const { NODE_ENV } = require("../commons/constants");

const knexInstance = KNEX({
  client: "cockroachdb",
  connection: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?${process.env.SECURITY}`,
  pool: {
    min: 10, // Số kết nối tối thiểu được giữ trong pool.
    max: 20, // Số kết nối tối đa mà pool có thể giữ.
    acquireTimeoutMillis: 30000, // Thời gian tối đa  mà một kết nối mới có thể chờ đợi để được tạo và thêm vào pool.
    createTimeoutMillis: 30000, // Thời gian tối đa mà một kết nối mới có thể mất để được tạo.
    idleTimeoutMillis: 30000, // Thời gian tối đa mà một kết nối có thể ở trong pool mà không được sử dụng trước khi bị giải phóng.
    reapIntervalMillis: 1000, //  Thời gian giữa các chu kỳ để giải phóng các kết nối không sử dụng.
  },
  debug: process.env.NODE_ENV === NODE_ENV.DEV,
});

knexInstance
  .raw("SELECT 1")
  .then((_) => {
    console.info("CONNECTED TO POSTGRESQL SUCCESS !!");
    // const poolConfig = KNEX.client.pool;

    // console.info("Pool configuration:", poolConfig);
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL database", err);
  });

module.exports = knexInstance;
