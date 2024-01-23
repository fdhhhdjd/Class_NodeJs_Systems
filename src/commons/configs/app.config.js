//* IMPORT
const { NODE_ENV } = require("../constants");

const dev = {
  app: {
    port: process.env.PORT || 5000,
    morgan: process.env.MORGAN || NODE_ENV.DEV,
    node: process.env.NODE_ENV || NODE_ENV.DEV,
    web_server: process.env.WEB_SERVER,
  },
};
const pro = {
  app: {
    port: process.env.PORT || 5000,
    morgan: process.env.MORGAN || "combined",
    node: process.env.NODE_ENV || NODE_ENV.DEV,
    web_server: process.env.WEB_SERVER,
  },
};
const config = { dev, pro };

const env = process.env.NODE_ENV || NODE_ENV.DEV;

module.exports = config[env];
