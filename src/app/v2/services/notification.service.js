//* LIB
const _ = require("lodash");

//* IMPORT
const { BadRequestRequestError } = require("../../../cores/error.response");
const googleApi = require("../../../apis/google.api");
const axiosService = require("../../../libs/method");

class NotificationService {
  async sendDeviceId({
    deviceId,
    notification,
    meta = {
      url: "https://i.pinimg.com/originals/ca/05/d1/ca05d1cf1a034f9b2eafc644c102c551.gif",
      dl: "https://www.profile-forme.com",
    },
  }) {
    if (_.isEmpty(deviceId) || _.isEmpty(notification)) {
      throw new BadRequestRequestError();
    }

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
    if (_.isEmpty(deviceIds) || _.isEmpty(notification)) {
      throw new BadRequestRequestError();
    }
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
    if (_.isEmpty(notification)) {
      throw new BadRequestRequestError();
    }

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
    if (_.isEmpty(notification) || _.isEmpty(notification)) {
      throw new BadRequestRequestError();
    }

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
