//* LIB
const KNEX = require("knex");
const { NODE_ENV } = require("../commons/constants");

const knexInstance = KNEX({
  client: "cockroachdb",
  connection: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?${process.env.SECURITY}`,
  pool: {
    min: 10,
    max: 20,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
  },
  debug: process.env.NODE_ENV === NODE_ENV.DEV,
});

knexInstance
  .raw("SELECT 1")
  .then((_) => {
    console.info("CONNECTED TO POSTGRESQL SUCCESS 🐘 !!");
    // const poolConfig = KNEX.client.pool;

    // console.info("Pool configuration:", poolConfig);
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL database", err);
  });

module.exports = knexInstance;
