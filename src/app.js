//* LIB
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { default: helmet } = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");

//* IMPORT
const { NODE_ENV, LIMIT_BODY } = require("./commons/constants");
const { NotFoundError } = require("./cores/error.response");
const {
  app: { morgan: morganConfig, node },
} = require("./commons/configs/app.config");
const { errorHandler } = require("./commons/helpers/errorHandle");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan(morganConfig));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.json({
    limit: LIMIT_BODY._5_MB,
  })
);

//* Database & Cache
require("./databases/init.knex");
require("./databases/init.redis");
require("./databases/init.cloudinary");
require("./databases/init.firebase");

//* CRON
require("./crons/user_verification");

//* V1
app.use("/api/v1", require("./app/v1/routes"));
//* V2
app.use("/api/v2", require("./app/v2/routes"));

app.use((_, __, next) => {
  next(new NotFoundError());
});

app.use((error, __, res, ____) => {
  const checkNodeApp = node === NODE_ENV.DEV;

  const resultError = errorHandler(error, checkNodeApp);

  return res.status(resultError?.response.status).json(resultError?.response);
});

module.exports = app;
