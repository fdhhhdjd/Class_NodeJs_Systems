//* LIB
const express = require("express");
const morgan = require("morgan");

const {
  StatusCodes,
  ReasonPhrases,
} = require("./commons/utils/httpStatusCode");
const { NODE_ENV } = require("./commons/constants");
const { NotFoundError } = require("./cores/error.response");
const {
  app: { morgan: morganConfig, node },
} = require("./commons/configs/app.config");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(morgan(morganConfig));

require("./databases/init.knex");

//* V1
app.use("/api", require("./app/v1/routes"));

app.use((_, __, next) => {
  next(new NotFoundError());
});

app.use((error, __, res, ____) => {
  const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  const response = {
    message,
    status: statusCode,
  };

  const checkNodeApp = node === NODE_ENV.DEV;

  console.log(node, NODE_ENV.DEV);
  if (checkNodeApp) {
    Object.assign(response, { stack: error.stack });
  }

  return res.status(statusCode).json(response);
});
module.exports = app;
