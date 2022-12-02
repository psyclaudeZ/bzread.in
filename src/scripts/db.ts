import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DynamoDBClient,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const BATCH_SIZE = 25;

class DBUtils {
  client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({ region: "us-west-1" });
  }

  async batchWrite(posts: any[]) {
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch: WriteRequest[] = posts.slice(i, i + BATCH_SIZE);
      const params: BatchWriteItemCommandInput = {
        RequestItems: {
          "bzreadin-link": batch,
        },
      };
      try {
        await this.client.send(new BatchWriteItemCommand(params));
      } catch (e) {
        console.error(
          `Encountered an error when committing batch ${
            i % BATCH_SIZE
          }. Error: ${e}`
        );
      }
    }
  }
}
export { DBUtils };
