//* LIB
const express = require("express");

//* IMPORT
const labelController = require("../../controllers/label.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.get("/get/all", asyncHandler(labelController.getAll));

router.get("/get/:labelId", asyncHandler(labelController.getDetail));

router.post("/create", asyncHandler(labelController.create));

router.patch("/update/:labelId", asyncHandler(labelController.update));

router.delete("/delete/:labelId", asyncHandler(labelController.delete));

module.exports = router;
