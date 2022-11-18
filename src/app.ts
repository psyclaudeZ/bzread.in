const express = require("express");
const app = express();
const port = process.env.PORT || 8088;

// AWS JS V2
const AWS = require("aws-sdk");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
AWS.config.update({ region: "us-west-1" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

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

const axios = require("axios");
app.get("/episode", (_req, res) => {
  axios
    .get(process.env.EPISODE_ENDPOINT, {
      headers: {
        "x-api-key": process.env.EPISODE_ENDPOINT_API_KEY,
      },
    })
    .then((response) => {
      res.writeHead(200);
      const all_posts = response.data;
      const idx = Math.floor(Math.random() * all_posts.length);
      const episode = all_posts.slice(idx, idx + 5);
      console.log(episode);
      res.write(JSON.stringify(episode));
      res.end();
    })
    .catch((err) => {
      res.status(500).json({ err: "Failed to fetch today's episode" }).end();
      console.error(`Error: ${err.stack}`);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
