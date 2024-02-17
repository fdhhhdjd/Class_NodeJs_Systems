//* LIB
const _ = require("lodash");
const fs = require("fs");

//* IMPORT
const cloudinary = require("../../../databases/init.cloudinary");
const { BadRequestRequestError } = require("../../../cores/error.response");

class NotificationService {
  async sendDeviceId() {}

  async sendMulticast() {}

  async sendTopic() {}

  async sendTopicCondition() {}
}

module.exports = new NotificationService();
