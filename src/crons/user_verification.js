//* LIB
const cron = require("node-cron");

//* IMPORT
const userVerificationModel = require("../app/v1/models/user_verification");

cron.schedule("*/5 * * * *", function () {
  userVerificationModel.deleteExpiredRecords();
});
