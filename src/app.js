//* LIB
const express = require("express");

const app = express();

require("dotenv").config();

app.use(express.json());

require("./databases/init.knex");

app.use("/api/users", require("./routes/users"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/labels", require("./routes/labels"));

module.exports = app;
