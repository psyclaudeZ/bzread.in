#!/usr/bin/env npx ts-node
import { promises as fsPromises } from "fs";

import chalk = require("chalk");
import clear = require("clear");
import figlet = require("figlet");
import program = require("commander");

import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const XML_PATH = "posts.xml";
const ATTRIBUTE_PREFIX = "@_";

//clear();
console.log(
  chalk.white(figlet.textSync("Pinboard Dumper", { horizontalLayout: "full" }))
);

program
  .version("1.0")
  .description("A CLI that dumps Pinboard output to DynamoDB.")
  .option("-r, --for-realz", "NOT a dry run, actually commit the changes.")
  .parse(process.argv);

fsPromises
  .readFile(XML_PATH)
  .then((value) => {
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: ATTRIBUTE_PREFIX,
    };
    const parser = new XMLParser(options);
    const json = parser.parse(value);
    const posts = [];

    json.posts.post.forEach((post) => {
      posts.push({
        uri: post[ATTRIBUTE_PREFIX + "href"],
        title: post[ATTRIBUTE_PREFIX + "description"], // weird field name
        source: "pinboard",
        owner: 1, // me :)
        score: 1.0,
      });
    });
    return posts;
  })
  .then((posts) => {
    console.log(`Parsed ${posts.length} posts.`);
    console.log(posts[0]);
    if (program.opts().forRealz) {
      console.log("FOR REAL!");
    }
  })
  .catch((error) => {
    console.error(`Failed to dump data. Error ${error}`);
  });
