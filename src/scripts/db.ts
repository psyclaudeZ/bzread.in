const {BatchWriteItemCommand, DynamoDBClient, ScanCommand} = require('@aws-sdk/client-dynamodb');

const BATCH_SIZE = 5;

class DBUtils {
  client;

  constructor() {
    this.client = new DynamoDBClient({region: 'us-west-1'});
  }

  async batchWrite(posts) {
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch = posts.slice(i, i + BATCH_SIZE);
      const params = {
        RequestItems: {
          'bzreadin-link': batch,
        },
      };
      try {
        await this.client.send(new BatchWriteItemCommand(params));
      } catch (e) {
        console.error(`Encountered an error when committing batch ${i / BATCH_SIZE}. Error: ${e}`);
      }
    }
  }

  async queryAll() {
    const data = await this.client.send(
      new ScanCommand({
        TableName: 'bzreadin-link',
      }),
    );
    return data.Items;
  }
}
module.exports = DBUtils;
