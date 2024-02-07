//* LIB
const express = require("express");

//* IMPORT
const userController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const {
  checkAuthorizationAccessToken,
} = require("../../../../auth/check.auth");

const router = express.Router();

router.post("/login/phone", asyncHandler(userController.loginPhone));

router.use(checkAuthorizationAccessToken);

module.exports = router;
