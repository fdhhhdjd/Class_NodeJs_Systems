//* LIB
const express = require("express");

const app = express();

require("dotenv").config();

app.use(express.json());

require("./databases/init.postgresql");

app.use("/api/todos", require("./routes/todos"));
app.use("/api/users", require("./routes/users"));

module.exports = app;
