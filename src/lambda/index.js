const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

exports.handler = async (event, context, callback) => {
  const client = new DynamoDBClient({ region: "us-west-1" });
  const data = await client.send(
    new ScanCommand({
      FilterExpression: "#link_status = :active",
      ExpressionAttributeValues: {
        ":active": { S: "active" },
      },
      ExpressionAttributeNames: {
        "#link_status": "status",
      },
      TableName: "bzreadin-link",
    })
  );
  let payload = [];

  console.log(`data: ${JSON.stringify(data)}`);
  data.Items.forEach(function (elem) {
    payload.push(unmarshall(elem));
  });
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      //'Access-Control-Allow-Credentials': true,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
};
