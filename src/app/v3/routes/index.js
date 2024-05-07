"use strict";

//* LIB
const express = require("express");
const { BOT } = require("../../../databases/init.telegram");

const router = express.Router();

router.use("/telegrams", require("./telegrams"));

BOT.on("message", (msg) => {
  console.log(msg);
});

module.exports = router;
