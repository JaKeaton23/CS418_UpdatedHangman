// PlayerStats.test.jsx
// Tests for the PlayerStats component

import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerStats from '../components/PlayerStats';

describe('PlayerStats', () => {
  test('shows the player name', () => {
    render(<PlayerStats playerName="Alice" wins={5} losses={3} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('shows wins and losses', () => {
    render(<PlayerStats playerName="Alice" wins={5} losses={3} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('calculates win percentage correctly', () => {
    render(<PlayerStats playerName="Alice" wins={3} losses={1} />);
    // 3 wins out of 4 games = 75%
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('shows 0% when player has no games', () => {
    render(<PlayerStats playerName="Bob" wins={0} losses={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('shows 100% when player has only wins', () => {
    render(<PlayerStats playerName="Charlie" wins={5} losses={0} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
