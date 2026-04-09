import React from 'react';

// PlayerStats - shows the current player's name, wins, losses, and winning percentage
class PlayerStats extends React.Component {
  render() {
    const { playerName, wins, losses } = this.props;

    // calculate win % (handle zero games case)
    const totalGames = wins + losses;
    const winPercentage = totalGames === 0
      ? 0
      : Math.round((wins / totalGames) * 100);

    return (
      <div className="player-stats">
        <div className="player-name-row">
          <span className="player-label">Player:</span>
          <span className="player-name">{playerName}</span>
        </div>
        <div className="player-stats-row">
          <div className="stat">
            <span className="stat-label">Wins</span>
            <span className="stat-value wins">{wins}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Losses</span>
            <span className="stat-value losses">{losses}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Win %</span>
            <span className="stat-value">{winPercentage}%</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PlayerStats;
