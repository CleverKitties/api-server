require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// db operation
const mongoose = require("mongoose");
// enable models
require("./models/account");

const port = 5001;

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.options("*", cors()); // include before other routes
app.use(cors());
app.use(require("./api/submitanswer"));

const connect = () => {
  const uri = process.env.DB_URL;

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("server connected to the local db");
    app.listen(port, () => {
      console.log(`clever kitties server is running at port ${port}`);
    });
  });
};

connect();
