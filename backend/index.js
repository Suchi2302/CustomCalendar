const express = require("express");
const app = express();
const mysql2 = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");

// Connect to MySQL database

global.connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "calendardata",
});
connection.connect();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api", router);
app.listen(5000);
