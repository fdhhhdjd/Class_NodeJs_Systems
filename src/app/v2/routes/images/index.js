//* LIB
const express = require("express");

//* IMPORT
const imageController = require("../../controllers/image.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const { uploadDisk } = require("../../../../commons/configs/multer.config");
const {
  checkAuthorizationAccessToken,
} = require("../../../../auth/check.auth");

const router = express.Router();

router.use(checkAuthorizationAccessToken);

router.post(
  "/upload",
  uploadDisk.single("file", 1),
  asyncHandler(imageController.upload)
);

router.post(
  "/upload/multi",
  uploadDisk.array("files", 3),
  asyncHandler(imageController.uploadMulti)
);

router.post("/remove", asyncHandler(imageController.removeImage));

module.exports = router;
