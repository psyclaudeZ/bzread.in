#!/usr/bin/env node

const axios = require("axios");
const seedrandom = require("seedrandom");
const fs = require("fs");

const EPISODE_SIZE = 5;
const EPISODE_INTERVAL = 3; // days
const FULL_OUTPUT_PATH = `${__dirname}/../client/src/pages/links.js`

console.log(Date())

axios
  .get(process.env.EPISODE_ENDPOINT, {
    headers: {
      "x-api-key": process.env.EPISODE_ENDPOINT_API_KEY,
    },
  })
  .then((response) => {
    return composeEpisode(response.data, EPISODE_SIZE);
  })
  .then((episode) => {
    console.log(episode);
    fs.writeFileSync(FULL_OUTPUT_PATH, `export default {"links": ${JSON.stringify(episode)}}`);
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
