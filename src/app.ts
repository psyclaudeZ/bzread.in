const express = require("express");
const app = express();
const port = process.env.PORT || 8088;

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

app.get("*", function (_req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
