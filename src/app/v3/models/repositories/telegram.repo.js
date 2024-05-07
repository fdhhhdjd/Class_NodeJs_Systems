//* REQUIRED
const { BOT } = require("../../../../databases/init.telegram");

const sendTelegram = ({ idChat, message }) => BOT.sendMessage(idChat, message);

module.exports = {
  sendTelegram,
};
