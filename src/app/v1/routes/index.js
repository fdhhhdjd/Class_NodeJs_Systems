"use strict";

//* LIB
const express = require("express");

//* IMPORT
const {
  StatusCodes,
  ReasonPhrases,
} = require("../../../commons/utils/httpStatusCode");

const router = express.Router();

router.use("/v1/users", require("./users"));
router.use("/v1/todos", require("./todos"));
router.use("/v1/labels", require("./labels"));

router.get("/v1", async (_, res, __) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: ReasonPhrases.OK,
    timestamp: Date.now(),
  };
  return res.status(StatusCodes.OK).json(healthCheck);
});

module.exports = router;
