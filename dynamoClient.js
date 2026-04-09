// dynamoClient.js - sets up the DynamoDB document client
// Uses the DynamoDBDocumentClient from the AWS SDK v3 tutorial so we can
// work with regular JS objects instead of DynamoDB attribute types

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// point at local DynamoDB if set, otherwise use AWS
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeKey',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecret',
  },
});

// wrap the client so we can send regular JS objects
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'HangmanPlayers';

module.exports = { docClient, TABLE_NAME };
