//* LIB
const express = require("express");

//* IMPORT
const puppeteerController = require("../../controllers/puppeteer.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.post("/start", asyncHandler(puppeteerController.start));

module.exports = router;
