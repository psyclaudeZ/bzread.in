#!/usr/bin/env node

const axios = require("axios");
const seedrandom = require("seedrandom");
const https = require("https");
const fs = require("fs");

const EPISODE_SIZE = 5;
const EPISODE_INTERVAL = 3; // days
const FULL_OUTPUT_PATH = `${__dirname}/../../episode/links.json`;

console.log(Date());

// FIXME: to bypass the error of "hostname/IP does not match certificate's
// altnames". It's theoritically okay since all the traffic is within AWS
// but still.
const agent = https.Agent({
  rejectUnauthorized: false,
});
axios
  .get(process.env.EPISODE_ENDPOINT, {
    headers: {
      "x-api-key": process.env.EPISODE_ENDPOINT_API_KEY,
      Accept: "application/json",
    },
    httpsAgent: agent,
  })
  .then((response) => {
    console.log(process.env.EPISODE_ENDPIONT);
    console.log(response);
    return composeEpisode(response.data, EPISODE_SIZE);
  })
  .then((episode) => {
    console.log(episode);
    fs.writeFileSync(FULL_OUTPUT_PATH, JSON.stringify(episode));
  })
  .catch((err) => {
    console.error(`Error: ${err.stack}`);
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
