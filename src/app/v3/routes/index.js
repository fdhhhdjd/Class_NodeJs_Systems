"use strict";

//* LIB
const express = require("express");
const { BOT } = require("../../../databases/init.telegram");

const router = express.Router();

router.use("/telegrams", require("./telegrams"));

BOT.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  if (messageText === "/start") {
    BOT.sendMessage(chatId, "Welcome to the bot!");
  }
});

module.exports = router;
