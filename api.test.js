// api.test.js
// Tests for the api helper functions

import { getPlayer, updatePlayer } from '../data/api';

describe('api helpers', () => {
  beforeEach(() => {
    // reset fetch mock before each test
    global.fetch = jest.fn();
  });

  describe('getPlayer', () => {
    test('returns found=true when player exists', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          found: true,
          player: { playerName: 'Alice', wins: 3, losses: 2 },
        }),
      });

      const result = await getPlayer('Alice');
      expect(result.found).toBe(true);
      expect(result.player.playerName).toBe('Alice');
    });

    test('returns found=false when player does not exist', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ found: false }),
      });

      const result = await getPlayer('Bob');
      expect(result.found).toBe(false);
    });

    test('throws error when fetch fails', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });

      await expect(getPlayer('Alice')).rejects.toThrow('Failed to get player');
    });
  });

  describe('updatePlayer', () => {
    test('sends PUT request with stats', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          player: { playerName: 'Alice', wins: 5, losses: 2 },
        }),
      });

      const result = await updatePlayer('Alice', 5, 2);
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/player/Alice',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    test('throws error when fetch fails', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });

      await expect(updatePlayer('Alice', 1, 0)).rejects.toThrow('Failed to update player');
    });
  });
});
