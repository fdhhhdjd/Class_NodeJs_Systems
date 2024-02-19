//* LIB
const _ = require("lodash");

//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const googleApi = require("../../../apis/google.api");
const axiosService = require("../../../libs/method");

class NotificationService {
  async sendDeviceId({ deviceId, notification, meta }) {
    const data = {
      to: deviceId,
      notification,
      data: meta,
    };

    try {
      const response = await axiosService.post(
        googleApi.firebase.message.sendSingleDevice,
        data
      );

      return response;
    } catch (error) {
      throw new BadRequestRequestError();
    }
  }

  async sendMulticast({ deviceIds, notification, meta }) {
    const data = {
      registration_ids: deviceIds,
      notification,
      data: meta,
    };

    try {
      const response = await axiosService.post(
        googleApi.firebase.message.sendSingleDevice,
        data
      );

      return response;
    } catch (error) {
      throw new BadRequestRequestError();
    }
  }

  async sendTopic({ topics = "/topics/class-fullstack", notification, meta }) {
    const data = {
      to: topics,
      notification,
      data: meta,
    };

    try {
      const response = await axiosService.post(
        googleApi.firebase.message.sendSingleDevice,
        data
      );

      return response;
    } catch (error) {
      throw new BadRequestRequestError();
    }
  }

  async sendTopicCondition({ condition, notification, meta }) {
    const data = {
      condition,
      notification,
      data: meta,
    };

    try {
      const response = await axiosService.post(
        googleApi.firebase.message.sendSingleDevice,
        data
      );

      return response;
    } catch (error) {
      throw new BadRequestRequestError();
    }
  }
}

module.exports = new NotificationService();
