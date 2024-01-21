//* LIB
const express = require("express");

const app = express();

require("dotenv").config();

app.use(express.json());

require("./databases/init.postgresql");

app.use("/api", require("./routes/todo"));

module.exports = app;
