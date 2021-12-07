const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
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
app.listen(port, () => {
  console.log(`clever kitties server is running at port ${port}`);
});
