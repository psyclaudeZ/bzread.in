#!/usr/bin/env npx ts-node
import { promises as fsPromises } from "fs";

import chalk = require("chalk");
import clear = require("clear");
import figlet = require("figlet");
import program = require("commander");

import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DynamoDBClient,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const XML_PATH = "posts.xml";
const ATTRIBUTE_PREFIX = "@_";
const PINBOARD_SOURCE = "pinboard";
const SEPARATOR = ":";
const BATCH_SIZE = 25;

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
    const formatted_posts = [];

    json.posts.post.forEach((post) => {
      formatted_posts.push({
        PutRequest: {
          Item: marshall({
            id: PINBOARD_SOURCE + SEPARATOR + post[ATTRIBUTE_PREFIX + "hash"],
            uri: post[ATTRIBUTE_PREFIX + "href"],
            title: post[ATTRIBUTE_PREFIX + "description"], // weird field name
            source: PINBOARD_SOURCE,
            owner: 1, // me :)
            score: 1.0,
          }),
        },
      });
    });
    return formatted_posts;
  })
  .then(async (posts) => {
    if (!program.opts().forRealz) {
      console.log("Specify -r to actually commit to DynamoDB.");
      return;
    }
    const client = new DynamoDBClient({ region: "us-west-1" });
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch: WriteRequest[] = posts.slice(i, i + BATCH_SIZE);
      const params: BatchWriteItemCommandInput = {
        RequestItems: {
          "bzreadin-link": batch,
        },
      };
      try {
        await client.send(new BatchWriteItemCommand(params));
      } catch (e) {
        console.error(
          `Encountered an error when committing batch ${
            i % BATCH_SIZE
          }. Error: ${e}`
        );
      }
    }
    /*
    posts.forEach(async (post) => {
      const params: PutItemCommandInput = {
        TableName: "bzreadin-link",
        Item: marshall({
          id: post.id,
          uri: post.uri,
          title: post.title,
          source: post.source,
          owner: post.owner,
          score: post.score,
        }),
      };
      const results = await client.send(new PutItemCommand(params));
      console.log(results);
    });
    */
  })
  .catch((error) => {
    console.error(`Failed to dump data. Error ${error}`);
  });
