const express = require("express");
const app = express();
const port = process.env.PORT || 8088;
const EPISODE_SIZE = 5;
const EPISODE_INTERVAL = 3; // days

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
const seedrandom = require("seedrandom");
app.get("/api/v1/episode", (_req, res) => {
  axios
    .get(process.env.EPISODE_ENDPOINT, {
      headers: {
        "x-api-key": process.env.EPISODE_ENDPOINT_API_KEY,
      },
    })
    .then((response) => {
      const episode = composeEpisode(response.data, EPISODE_SIZE);
      console.log(episode);
      res.writeHead(200);
      res.write(JSON.stringify(episode));
      res.end();
    })
    .catch((err) => {
      res.status(500).json({ err: "Failed to fetch today's episode" }).end();
      console.error(`Error: ${err.stack}`);
    });
});

/**
 * Durstenfeld's shuffle. See
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm.
 *
 * The algorithm is seeded with the date number (based on day) / EPISODE_INTERVAL to
 * ensure a new set of elements are picked every EPISODE_INTERVAL days.
 */
function composeEpisode(arr, size) {
  const rng = seedrandom(
    Math.floor(new Date().getTime() / 86400000 / EPISODE_INTERVAL)
  );
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, size);
}

app.get("*", function (_req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
