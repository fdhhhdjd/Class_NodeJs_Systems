//* LIB
const IOREDIS = require("ioredis");

//* IMPORT
const {
  redis: { host, port, user, password },
} = require("../commons/configs/redis.config");
const { RedisError } = require("../cores/error.response");

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connectTimeout;

const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: "Redis đang lỗi",
      enL: "Server connect Error",
    },
  };

const handleTimeoutError = () => {
  connectTimeout = setTimeout(() => {
    throw new RedisError({
      statusCode: REDIS_CONNECT_MESSAGE.code,
      message: REDIS_CONNECT_MESSAGE.message,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("CONNECTED TO REDIS SUCCESS ✅!!");
    clearTimeout(connectTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`CONNECTED TO REDIS ${statusConnectRedis.END} 🔚!!`);
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`CONNECTED TO REDIS ${statusConnectRedis.RECONNECT} 🔁!!`);
    clearTimeout(connectTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (error) => {
    console.error(`ERROR TO REDIS: ${error.message} ⁉️`);
    handleTimeoutError();
  });
};

const initRedis = () => {
  const InstanceRedis = new IOREDIS({
    port,
    host,
    user,
    password,
  });
  client.instanceConnect = InstanceRedis;
  handleEventConnect({ connectionRedis: InstanceRedis });
};

const getRedis = () => client;

const closeRedis = () => {
  if (client.instanceConnect) {
    client.instanceConnect.removeAllListeners();
    clearTimeout(connectTimeout);
    console.log(client.instanceConnect.status);
    if (client.instanceConnect.status !== statusConnectRedis.END) {
      client.instanceConnect.quit((err) => {
        if (err) {
          console.error("Error closing Redis connection:", err);
        } else {
          console.log("Redis connection closed successfully.");
        }
      });
    } else {
      console.warn("Redis connection is already closed.");
    }
  } else {
    console.warn("No active Redis connection to close.");
  }
};

module.exports = { initRedis, closeRedis, getRedis };
