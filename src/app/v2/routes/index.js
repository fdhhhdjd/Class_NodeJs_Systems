"use strict";

//* LIB
const express = require("express");

const router = express.Router();

router.use("/images", require("./images"));

module.exports = router;
