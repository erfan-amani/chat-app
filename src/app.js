const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

require("./db/mongo");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
