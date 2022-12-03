// AWS JS V2
const AWS = require("aws-sdk");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

exports.handler = async (event, context, callback) => {
  AWS.config.update({ region: "us-west-1" });
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  const params = {
    FilterExpression: "#link_status = :active",
    ExpressionAttributeValues: {
      ":active": { S: "active" },
    },
    ExpressionAttributeNames: {
      "#link_status": "status",
    },
    TableName: "bzreadin-link",
  };
  let payload = [];
  const awsRequest = await ddb.scan(params);
  const data = await awsRequest.promise();

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
