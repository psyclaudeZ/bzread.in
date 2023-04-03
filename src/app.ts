const express = require("express");
const app = express();
const fs = require("fs");

const port = process.env.PORT || 8088;
const FULL_OUTPUT_PATH = `${__dirname}/../episode/links.json`;

app.use(express.static(`${__dirname}/client/build`));

app.get("/", (_req, res) => {
  try {
    res.writeHead(200);
    res.write("Static content unavailable. It's werid you're ended up here.");
    res.end();
  } catch (err) {
    res.send("Oopsie: " + err);
  }
});

app.get("/api/v1/episode", (_req, res) => {
  try {
    const episode = fs.readFileSync(FULL_OUTPUT_PATH, "utf8");
    console.log(episode);
    res.writeHead(200);
    res.write(episode);
    res.end();
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch today's episode" }).end();
    console.error(`Error: ${err.stack}`);
  }
});

app.get("*", function (_req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
