//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const notificationService = require("../services/notification.service");

class NotificationV2Controller {
  async sendDeviceId(req, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendDeviceId(req.body),
    }).send(res);
  }

  async sendMulticast(req, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendMulticast(req.body),
    }).send(res);
  }

  async sendTopic(req, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendTopic(req.body),
    }).send(res);
  }

  async sendTopicCondition(req, res, ___) {
    new SuccessResponse({
      metadata: await notificationService.sendTopicCondition(req.body),
    }).send(res);
  }
}

module.exports = new NotificationV2Controller();
