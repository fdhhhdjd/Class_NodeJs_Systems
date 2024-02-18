//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const notificationService = require("../services/notification.service");

class NotificationV2Controller {
  async sendDeviceId(req, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendDeviceId(req.body),
    }).send(res);
  }

  async sendMulticast(_, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendMulticast(),
    }).send(res);
  }

  async sendTopic(_, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendTopic(),
    }).send(res);
  }

  async sendTopicCondition(_, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendTopicCondition(),
    }).send(res);
  }
}

module.exports = new NotificationV2Controller();
