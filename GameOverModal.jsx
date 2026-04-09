import React from 'react';

// GameOverModal - shown when the game ends (win or loss)
class GameOverModal extends React.Component {
  render() {
    const { isVisible, isWinner, word, onNewGame } = this.props;
    if (!isVisible) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2>{isWinner ? 'You Win!' : 'Game Over'}</h2>
          {!isWinner && <p>The word was: <strong>{word.toUpperCase()}</strong></p>}
          <button className="login-button" onClick={onNewGame}>Play Again</button>
        </div>
      </div>
    );
  }
}

export default GameOverModal;
