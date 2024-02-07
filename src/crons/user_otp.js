//* LIB
const cron = require("node-cron");

//* IMPORT
const userOtpModel = require("../app/v2/models/user_otp.model");

cron.schedule("*/7 * * * *", function () {
  userOtpModel.deleteExpiredRecords();
});
