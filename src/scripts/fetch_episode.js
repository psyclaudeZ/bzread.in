#!/usr/bin/env node

const axios = require('axios');
const crypto = require('crypto');
const seedrandom = require('seedrandom');
const https = require('https');
const fs = require('fs');
const RSS = require('rss');
const {XMLParser} = require('fast-xml-parser');

const EPISODE_SIZE = 5;
const EPISODE_INTERVAL = 3; // days
const FULL_OUTPUT_PATH = `${__dirname}/../../episode/links.json`;
const FULL_RSS_PATH = `${__dirname}/../../src/client/build/rss.xml`;

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
      'x-api-key': process.env.EPISODE_ENDPOINT_API_KEY,
      Accept: 'application/json',
    },
    httpsAgent: agent,
  })
  .then((response) => {
    return composeEpisode(response.data, EPISODE_SIZE);
  })
  .then((episode) => {
    console.log({episode});
    fs.writeFileSync(FULL_OUTPUT_PATH, JSON.stringify(episode));
    updateRss(episode);
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
  const rng = seedrandom(Math.floor(new Date().getTime() / 86400000 / EPISODE_INTERVAL));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, size);
}

function updateRss(arr) {
  // 1. Compose new episode
  const feedContentHtml = `<ul>${arr
    .map((obj) => `<li><a href="${obj.uri}">${obj.title}</a></li>`)
    .join('')}</ul>`;
  const newPostId = crypto.createHash('sha256').update(feedContentHtml).digest('hex');
  const newPost = {
    title: `Episode of ${getEpisodeDate()}`,
    description: `${feedContentHtml}`,
    url: 'https://bzread.in',
    guid: newPostId,
    date: new Date(),
  };

  let feed = null;
  if (!fs.existsSync(FULL_RSS_PATH)) {
    feed = new RSS({
      title: 'bzread.in',
      description: 'bzread.in',
      // TODO - replace the actual endpoint
      feed_url: 'https://bzread.in/rss_test.xml',
      site_url: 'https://bzread.in',
    });
    feed.item(newPost);
  } else {
    const existingFeedRaw = fs.readFileSync(FULL_RSS_PATH, 'utf-8');
    const existingFeed = new XMLParser().parse(existingFeedRaw, {arrayMode: false});
    feed = new RSS(existingFeed.rss.channel);
    // For when there's only one item
    if (!Array.isArray(existingFeed.rss.channel.item)) {
      existingFeed.rss.channel.item = [existingFeed.rss.channel.item];
    }
    // Don't append the post if it already exists
    if (existingFeed.rss.channel.item.some((item) => item.guid === newPostId)) {
      return;
    }
    existingFeed.rss.channel.item.push(newPost);
    existingFeed.rss.channel.item.forEach((item) => {
      feed.item(item);
    });
  }
  const rssXml = feed.xml({indent: true});
  fs.writeFileSync(FULL_RSS_PATH, rssXml, (err) => {
    if (err) {
      console.error('Error saving the RSS XML file:', err);
    } else {
      console.log('RSS XML file saved successfully');
    }
  });
}

/**
 * TODO: copypasta from episode.js...
 */
function getEpisodeDate() {
  const episodeNumber = Math.floor(new Date().getTime() / MILLISECONDS_IN_A_DAY / EPISODE_INTERVAL);
  const date = new Date(episodeNumber * EPISODE_INTERVAL * MILLISECONDS_IN_A_DAY);
  return date.toISOString().slice(0, 10);
}
