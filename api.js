// api.js - helper functions for talking to the backend API
// Uses fetch and async/await as required

const API_URL = 'http://localhost:3001';

// GET a player by name from the database
// returns { found: true, player: {...} } or { found: false }
export async function getPlayer(playerName) {
  const response = await fetch(API_URL + '/player/' + playerName);
  if (!response.ok) {
    throw new Error('Failed to get player');
  }
  return await response.json();
}

// PUT (create or update) a player's stats
export async function updatePlayer(playerName, wins, losses) {
  const response = await fetch(API_URL + '/player/' + playerName, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, losses }),
  });
  if (!response.ok) {
    throw new Error('Failed to update player');
  }
  return await response.json();
}
