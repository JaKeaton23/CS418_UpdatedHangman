// createTable.js - creates the HangmanPlayers table in DynamoDB
// Run this once when setting up the project: node createTable.js

const { CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeKey',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecret',
  },
});

async function createTable() {
  try {
    // check if table already exists
    try {
      await client.send(new DescribeTableCommand({ TableName: 'HangmanPlayers' }));
      console.log('Table HangmanPlayers already exists');
      return;
    } catch (err) {
      // table doesnt exist, we'll create it
    }

    const command = new CreateTableCommand({
      TableName: 'HangmanPlayers',
      KeySchema: [
        { AttributeName: 'playerName', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'playerName', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    const response = await client.send(command);
    console.log('Table created successfully:', response.TableDescription.TableName);
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

createTable();
