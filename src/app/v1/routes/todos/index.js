//* LIB
const express = require("express");

//* IMPORT
const todoController = require("../../controllers/todo.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.get("/get/all", asyncHandler(todoController.getAll));

router.get("/get/:todoId", asyncHandler(todoController.getDetail));

router.post("/create", asyncHandler(todoController.create));

router.patch("/update/:todoId", asyncHandler(todoController.update));

router.post("/upsert", asyncHandler(todoController.upsert));

router.delete(
  "/delete/label",
  asyncHandler(todoController.deleteTodoAssignLabel)
);

router.delete("/delete/:todoId", asyncHandler(todoController.delete));

module.exports = router;
