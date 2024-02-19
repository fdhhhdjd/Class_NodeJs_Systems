//* LIB
const express = require("express");

//* IMPORT
const userController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.post("/login/phone", asyncHandler(userController.loginPhone));
router.post("/verify/phone", asyncHandler(userController.verifyOTP));
router.post(
  "/login/google/popup",
  asyncHandler(userController.loginGooglePopup)
);

module.exports = router;
