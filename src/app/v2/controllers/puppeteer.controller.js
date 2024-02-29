//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const puppeteerService = require("../services/puppeteer.service");

class PuppeteerServiceController {
  async start(req, res, ___) {
    new SuccessResponse({
      metadata: await puppeteerService.start(req.body),
    }).send(res);
  }
}

module.exports = new PuppeteerServiceController();
