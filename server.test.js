// server.test.js - Unit tests for the backend API endpoints
// Uses Jest and supertest. Mocks the DynamoDB client so we dont hit a real db

// mock the dynamo client before requiring the app
jest.mock('../dynamoClient', () => ({
  docClient: {
    send: jest.fn(),
  },
  TABLE_NAME: 'HangmanPlayers',
}));

const request = require('supertest');
const app = require('../server');
const { docClient } = require('../dynamoClient');

describe('Hangman API', () => {
  beforeEach(() => {
    // clear mock history before each test
    docClient.send.mockClear();
  });

  describe('GET /', () => {
    test('returns a status message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Hangman API is running');
    });
  });

  describe('GET /player/:name', () => {
    test('returns found=true when player exists', async () => {
      // fake what dynamo would return
      docClient.send.mockResolvedValueOnce({
        Item: { playerName: 'alice', wins: 3, losses: 2 },
      });

      const res = await request(app).get('/player/alice');

      expect(res.statusCode).toBe(200);
      expect(res.body.found).toBe(true);
      expect(res.body.player.playerName).toBe('alice');
      expect(res.body.player.wins).toBe(3);
      expect(res.body.player.losses).toBe(2);
    });

    test('returns found=false when player does not exist', async () => {
      // no item returned
      docClient.send.mockResolvedValueOnce({});

      const res = await request(app).get('/player/bob');

      expect(res.statusCode).toBe(200);
      expect(res.body.found).toBe(false);
    });

    test('returns 500 when db throws error', async () => {
      docClient.send.mockRejectedValueOnce(new Error('db error'));

      const res = await request(app).get('/player/alice');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('PUT /player/:name', () => {
    test('creates/updates a player with stats', async () => {
      docClient.send.mockResolvedValueOnce({});

      const res = await request(app)
        .put('/player/charlie')
        .send({ wins: 5, losses: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.player.playerName).toBe('charlie');
      expect(res.body.player.wins).toBe(5);
      expect(res.body.player.losses).toBe(1);
    });

    test('defaults wins and losses to 0 if not provided', async () => {
      docClient.send.mockResolvedValueOnce({});

      const res = await request(app)
        .put('/player/dave')
        .send({});

      expect(res.statusCode).toBe(200);
      expect(res.body.player.wins).toBe(0);
      expect(res.body.player.losses).toBe(0);
    });

    test('returns 500 when db throws error', async () => {
      docClient.send.mockRejectedValueOnce(new Error('db error'));

      const res = await request(app)
        .put('/player/alice')
        .send({ wins: 1, losses: 0 });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });
});
