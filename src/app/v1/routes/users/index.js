//* LIB
const express = require("express");

//* IMPORT
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.get("/get/all", userController.getAll);

router.get("/get/:userId", userController.getDetail);

router.get("/get/todo/:userId", userController.getTodoFollowUser);

router.post("/create", userController.create);

router.patch("/update/:userId", userController.update);

router.delete("/delete/:userId", userController.delete);

module.exports = router;
