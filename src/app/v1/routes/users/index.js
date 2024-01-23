//* LIB
const express = require("express");

//* IMPORT
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.get("/get/all", asyncHandler(userController.getAll));

router.get("/get/:userId", asyncHandler(userController.getDetail));

router.get("/get/todo/:userId", asyncHandler(userController.getTodoFollowUser));

router.post("/create", asyncHandler(userController.create));

router.patch("/update/:userId", asyncHandler(userController.update));

router.delete("/delete/:userId", asyncHandler(userController.delete));

module.exports = router;
