//* IMPORT
const { TIME } = require("../commons/constants");
const { BlacklistTokens } = require("../commons/keys/blacklist");
const { BadRequestRequestError } = require("../cores/error.response");
const { getRedis } = require("../databases/init.redis");
const { instanceConnect } = getRedis();

const isTokenBlacklisted = async (refetchToken) => {
  try {
    const start = 0;
    const end = -1;
    const result = await instanceConnect.lrange(BlacklistTokens, start, end);

    return result.includes(refetchToken);
  } catch (error) {
    return error?.message;
  }
};

const checkUserSpam = async ({
  key,
  blockDuration = TIME._3_MINUTE,
  delDuration = TIME._1_MINUTE,
  maxRequest = 3,
}) => {
  try {
    const BLOCK_DURATION_SECONDS = blockDuration;
    const DELETE_DURATION_SECONDS = delDuration;
    const MAX_REQUESTS = maxRequest;
    const numRequests = await instanceConnect.incr(key);
    let _ttl;

    if (numRequests === MAX_REQUESTS + 1) {
      await instanceConnect.expire(key, BLOCK_DURATION_SECONDS);
      _ttl = BLOCK_DURATION_SECONDS;
    } else {
      _ttl = await instanceConnect.ttl(key);
    }

    if (numRequests > MAX_REQUESTS) {
      return `You are blocked for ${_ttl}s. Thank you.`;
    } else {
      instanceConnect.expire(key, DELETE_DURATION_SECONDS);
    }
  } catch (error) {
    return error?.message;
  }
};

module.exports = {
  isTokenBlacklisted,
  checkUserSpam,
};
