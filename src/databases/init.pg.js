const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?${process.env.SECURITY}&application_name=class_fullstack`;

// Tạo một đối tượng pool kết nối
const pool = new Pool({
  connectionString: connectionString,
  min: 10, // Số kết nối tối thiểu được giữ trong pool.
  max: 20, // Số kết nối tối đa mà pool có thể giữ.
  acquireTimeoutMillis: 30000, // Thời gian tối đa  mà một kết nối mới có thể chờ đợi để được tạo và thêm vào pool.
  createTimeoutMillis: 30000, // Thời gian tối đa mà một kết nối mới có thể mất để được tạo.
  idleTimeoutMillis: 30000, // Thời gian tối đa mà một kết nối có thể ở trong pool mà không được sử dụng trước khi bị giải phóng.
  reapIntervalMillis: 1000, //  Thời gian giữa các chu kỳ để giải phóng các kết nối không sử dụng.
  log: (...messages) => {
    const logMessage = messages.join(" ");

    if (logMessage.includes("Executing (default):")) {
      console.log(
        "Executed SQL:",
        logMessage.split("Executing (default):")[1].trim()
      );
    }

    console.log(logMessage);
  },
});

pool
  .connect()
  .then((client) => {
    console.info("CONNECTED TO POSTGRESQL SUCCESS !!");
    client.release();
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL database", err);
  });

// Export pool để sử dụng nó ở các module khác
module.exports = pool;
