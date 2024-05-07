//* LIB
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const BOT = new TelegramBot(token, {
  polling: true,
  request: {
    agentOptions: {
      keepAlive: true,
      family: 4,
    },
  },
});
BOT.on("polling_error", (error) => {
  console.error(`Polling error: ${error.message}`);
});

module.exports = { BOT };
