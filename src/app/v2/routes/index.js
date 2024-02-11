"use strict";

//* LIB
const express = require("express");

const router = express.Router();

// router.use("/images", require("./images"));
router.use("/users", require("./users"));

module.exports = router;
