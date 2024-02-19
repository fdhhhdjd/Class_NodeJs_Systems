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

router.post(
  "/multicast/device",
  asyncHandler(notificationController.sendMulticast)
);

router.post("/topic/device", asyncHandler(notificationController.sendTopic));

router.post(
  "/condition/device",
  asyncHandler(notificationController.sendTopicCondition)
);

router.use(checkAuthorizationAccessToken);

module.exports = router;
