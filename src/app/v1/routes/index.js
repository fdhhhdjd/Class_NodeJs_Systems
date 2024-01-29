"use strict";

//* LIB
const express = require("express");

//* IMPORT
const {
  StatusCodes,
  ReasonPhrases,
} = require("../../../commons/utils/httpStatusCode");
const redisInstance = require("../../../databases/init.redis");
const { User } = require("../../../commons/keys/user");

const router = express.Router();

router.use("/users", require("./users"));
router.use("/todos", require("./todos"));
router.use("/labels", require("./labels"));

router.get("/", async (_, res, __) => {
  const resultProfileUser = await redisInstance.hgetall(User);
  const healthCheck = {
    uptime: process.uptime(),
    message: resultProfileUser || ReasonPhrases.OK,
    timestamp: Date.now(),
  };
  return res.status(StatusCodes.OK).json(healthCheck);
});

module.exports = router;
