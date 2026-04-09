import React from 'react';

// NewGameButton - button to start a new game
class NewGameButton extends React.Component {
  render() {
    return (
      <button className="new-game-button" onClick={this.props.onNewGame}>
        New Game
      </button>
    );
  }
}

export default NewGameButton;
