//* LIB
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const { NODE_ENV } = require("./commons/constants");
const { NotFoundError } = require("./cores/error.response");
const {
  app: { morgan: morganConfig, node },
} = require("./commons/configs/app.config");
const { errorHandler } = require("./commons/helpers/errorHandle");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(morgan(morganConfig));
app.use(helmet());

require("./databases/init.knex");

//* V1
app.use("/api", require("./app/v1/routes"));

app.use((_, __, next) => {
  next(new NotFoundError());
});

app.use((error, __, res, ____) => {
  const checkNodeApp = node === NODE_ENV.DEV;

  const resultError = errorHandler(error, checkNodeApp);

  return res.status(resultError?.response.status).json(resultError?.response);
});
module.exports = app;
