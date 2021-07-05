const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("morgan");

app.route("/", (res) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log("Backend Server is up & running.");
});
