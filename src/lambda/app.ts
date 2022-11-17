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

app.get("/posts", (_req, res) => {
  const params = {
    TableName: "bzreadin-link",
  };
  ddb.scan(params, function (err, data) {
    if (err) {
      res.writeHead(500);
      console.error(`Error fetching from DB: ${err}`);
    } else {
      const payload = [];
      data.Items.forEach(function (elem) {
        payload.push(unmarshall(elem));
      });
      res.send(payload);
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
