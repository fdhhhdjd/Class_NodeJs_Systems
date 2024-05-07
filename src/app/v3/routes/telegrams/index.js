//* LIB
const express = require("express");

//* IMPORT
const telegramController = require("../../controllers/telegram.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.post("/send-message", asyncHandler(telegramController.sendMessage));

module.exports = router;
