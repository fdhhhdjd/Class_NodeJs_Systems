//* REQUIRED
const { sendTelegram } = require("../models/repositories/telegram.repo");

class TelegramService {
  async sendMessage({ message }) {
    sendTelegram({ idChat: 5886856229, message });
    return message;
  }
}

module.exports = new TelegramService();
