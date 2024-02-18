//* LIB
const _ = require("lodash");
const { default: axios } = require("axios");

//* IMPORT
const cloudinary = require("../../../databases/init.cloudinary");
const { BadRequestRequestError } = require("../../../cores/error.response");
const {
  app: { firebaseMessage },
} = require("../../../commons/configs/app.config");
const googleApi = require("../../../apis/google.api");

class NotificationService {
  async sendDeviceId({ deviceId, notification, meta }) {
    const data = {
      to: deviceId,
      notification,
      data: meta,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `key=${firebaseMessage}`,
    };

    try {
      const response = await axios.post(
        googleApi.firebase.message.sendSingleDevice,
        data,
        { headers }
      );

      return response.data;
    } catch (error) {
      return BadRequestRequestError();
    }
  }

  async sendMulticast() {}

  async sendTopic() {}

  async sendTopicCondition() {}
}

module.exports = new NotificationService();
