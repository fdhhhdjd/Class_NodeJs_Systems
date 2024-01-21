//* LIB
const express = require("express");

//* IMPORT
const todoController = require("../../controllers/todo.controller");

const router = express.Router();

// * 1. GET ALL
router.get("/get/all", todoController.getAll);

// * 2. GET DETAIL
router.get("/get/:todoId", todoController.getDetail);

// * 3. CREATE
router.post("/create", todoController.create);

// * 4. UPDATE
router.put("/update", todoController.create);

// * 5. DELETE
router.delete("/delete/:todoId", todoController.create);

module.exports = router;
