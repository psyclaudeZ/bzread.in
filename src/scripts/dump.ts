#!/usr/bin/env npx ts-node
import { promises as fsPromises } from "fs";

const chalk = require("chalk");
const figlet = require("figlet");
const program = require("commander");

import { XMLParser } from "fast-xml-parser";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DBUtils } from "./db";
import { opts } from "commander";

const XML_PATH = "posts.xml";
const ATTRIBUTE_PREFIX = "@_";
const PINBOARD_SOURCE = "pinboard";
const SEPARATOR = ":";

console.log(
  chalk.white(figlet.textSync("Pinboard Dumper", { horizontalLayout: "full" }))
);
console.log(chalk.yellow("Don't forget to curl pinboard first!"));

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
    const formatted_posts = [];

    json.posts.post.forEach((post) => {
      formatted_posts.push({
        id: PINBOARD_SOURCE + SEPARATOR + post[ATTRIBUTE_PREFIX + "hash"],
        uri: post[ATTRIBUTE_PREFIX + "href"],
        title: post[ATTRIBUTE_PREFIX + "description"], // weird field name
        source: PINBOARD_SOURCE,
        owner: 1, // me :)
        score: 1.0,
        status: "active",
      });
    });
    return formatted_posts;
  })
  .then(async (posts) => {
    const newLinksSet = new Set<string>(posts.map((post) => post.id));
    const db = new DBUtils();
    const oldLinks = await db.queryAll();
    // Mark the status for owner-removed links
    oldLinks.forEach((oldLink) => {
      const link = unmarshall(oldLink);
      if (!newLinksSet.has(link.id)) {
        posts.push({
          ...link,
          status: "owner_removed",
        });
        console.log(
          `Will mark post ${link.id} with ${link.title} as owner_removed.`
        );
      }
    });
    if (!program.opts().forRealz) {
      console.log(chalk.yellow("Specify -r to actually commit to DynamoDB."));
      return;
    }
    // Prepare posts to commit by marshalling and formatting
    const postsToCommit = posts.map((post) => {
      return {
        PutRequest: {
          Item: marshall(post),
        },
      };
    });
    await db.batchWrite(postsToCommit);
  })
  .catch((error) => {
    console.error(`Failed to dump data. Error ${error}`);
  });
