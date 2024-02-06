//* LIB
const express = require("express");

//* IMPORT
const imageController = require("../../controllers/image.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.post("/upload", asyncHandler(imageController.upload));

module.exports = router;
