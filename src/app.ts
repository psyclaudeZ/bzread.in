const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8088;

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("/", (req, res) => {
  try {
    res.writeHead(200);
    res.write("GET / OK");
    res.end();
  } catch (err) {
    res.send("Oopsie: " + err);
  }
});

app.get("/test", (req, res) => {
  res.send("Hitting the test route.");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
