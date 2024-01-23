//* LIB
const express = require("express");

//* IMPORT
const labelController = require("../../controllers/label.controller");

const router = express.Router();

// * 1. GET ALL
router.get("/get/all", labelController.getAll);

// * 2. GET DETAIL
router.get("/get/:labelId", labelController.getDetail);

// * 3. CREATE
router.post("/create", labelController.create);

// * 4. UPDATE
router.patch("/update/:labelId", labelController.update);

// * 5. DELETE
router.delete("/delete/:labelId", labelController.delete);

module.exports = router;
