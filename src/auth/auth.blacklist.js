//* IMPORT
const { BlacklistTokens } = require("../commons/keys/blacklist");
const redisInstance = require("../databases/init.redis");

const isTokenBlacklisted = async (refetchToken) => {
  try {
    const start = 0;
    const end = -1;
    const result = await redisInstance.lrange(BlacklistTokens, start, end);

    return result.includes(refetchToken);
  } catch (error) {
    return error?.message;
  }
};

module.exports = {
  isTokenBlacklisted,
};
