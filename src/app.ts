const express = require("express");
const app = express();
const fs = require("fs");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  try {
    const html = fs.readFileSync("src/public/index.html");
    res.writeHead(200);
    res.write(html);
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
