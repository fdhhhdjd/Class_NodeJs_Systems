//* LIB
const express = require("express");

//* IMPORT
const userController = require("../../controllers/user.controller");

const router = express.Router();

// * 1. GET ALL
router.get("/get/all", userController.getAll);

// * 2. GET DETAIL
router.get("/get/:userId", userController.getDetail);

// * 3. CREATE
router.post("/create", userController.create);

// * 4. UPDATE
router.patch("/update/:userId", userController.update);

// * 5. DELETE
router.delete("/delete/:userId", userController.delete);

module.exports = router;
