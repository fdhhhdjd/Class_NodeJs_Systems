//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const telegramService = require("../services/telegram.service");

class TelegramController {
  async sendMessage(req, res, ___) {
    new SuccessResponse({
      metadata: await telegramService.sendMessage(req.body),
    }).send(res);
  }
}

module.exports = new TelegramController();
