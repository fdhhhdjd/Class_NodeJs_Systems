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
router.patch("/update/:todoId", todoController.update);

// * 5. UPSERT
router.post("/upsert", todoController.upsert);

// * 6. DELETE
router.delete("/delete/label", todoController.deleteTodoAssignLabel);

// * 7. DELETE
router.delete("/delete/:todoId", todoController.delete);

module.exports = router;
