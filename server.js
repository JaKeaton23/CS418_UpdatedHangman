// server.js - Express server with endpoints to get and update player stats
// Uses DynamoDBDocumentClient (see dynamoClient.js)

const express = require('express');
const cors = require('cors');
const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLE_NAME } = require('./dynamoClient');

const app = express();
app.use(cors());
app.use(express.json());

// health check route
app.get('/', (req, res) => {
  res.json({ message: 'Hangman API is running' });
});

// GET /player/:name - check if a player exists, get their stats
app.get('/player/:name', async (req, res) => {
  const playerName = req.params.name;

  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { playerName: playerName },
    });

    const response = await docClient.send(command);

    if (response.Item) {
      // player found - return their stats
      res.json({ found: true, player: response.Item });
    } else {
      // player not found
      res.json({ found: false });
    }
  } catch (err) {
    console.error('Error getting player:', err);
    res.status(500).json({ error: 'Failed to get player' });
  }
});

// PUT /player/:name - create or update a player's stats
app.put('/player/:name', async (req, res) => {
  const playerName = req.params.name;
  const { wins, losses } = req.body;

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        playerName: playerName,
        wins: wins || 0,
        losses: losses || 0,
      },
    });

    await docClient.send(command);

    res.json({
      success: true,
      player: {
        playerName: playerName,
        wins: wins || 0,
        losses: losses || 0,
      },
    });
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

const PORT = process.env.PORT || 3001;

// only start the server if we're running this directly
// (so tests can import the app without starting the server)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Hangman API running on port ${PORT}`);
  });
}

module.exports = app;
