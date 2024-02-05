//* LIB
const express = require("express");

//* IMPORT
const userController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const {
  checkAuthorizationAccessToken,
  checkRoleAdmin,
} = require("../../../../auth/check.auth");

const router = express.Router();

router.post("/login", asyncHandler(userController.login));

router.post("/register", asyncHandler(userController.register));

router.post("/renewToken", asyncHandler(userController.renewToken));

router.post("/forget", asyncHandler(userController.forgetPassword));

router.use(checkAuthorizationAccessToken);

router.get("/logout", asyncHandler(userController.logout));

router.get("/get/all", asyncHandler(userController.getAll));

router.get("/get/:userId", asyncHandler(userController.getDetail));

router.get("/get/todo/:userId", asyncHandler(userController.getTodoFollowUser));

router.post("/create", asyncHandler(userController.create));

router.patch("/update/:userId", asyncHandler(userController.update));

router.delete("/delete/:userId", asyncHandler(userController.delete));

router.use(checkRoleAdmin);

router.post("/block", asyncHandler(userController.blockRefetchToken));

module.exports = router;
