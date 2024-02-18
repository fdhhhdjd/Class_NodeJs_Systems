//* LIB
const express = require("express");

//* IMPORT
const notificationController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const {
  checkAuthorizationAccessToken,
} = require("../../../../auth/check.auth");

const router = express.Router();

router.post(
  "/single/device",
  asyncHandler(notificationController.sendDeviceId)
);

router.use(checkAuthorizationAccessToken);

module.exports = router;
