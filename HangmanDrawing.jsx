import React from 'react';

// HangmanDrawing - shows the hangman figure based on wrong guess count
class HangmanDrawing extends React.Component {
  render() {
    const { wrongGuesses } = this.props;
    return (
      <div className="hangman-drawing">
        <svg width="200" height="220" viewBox="0 0 200 220">
          {/* Gallows */}
          <line x1="20" y1="210" x2="180" y2="210" stroke="#eee" strokeWidth="4" />
          <line x1="60" y1="210" x2="60" y2="20" stroke="#eee" strokeWidth="4" />
          <line x1="60" y1="20" x2="130" y2="20" stroke="#eee" strokeWidth="4" />
          <line x1="130" y1="20" x2="130" y2="50" stroke="#eee" strokeWidth="4" />
          {/* Head */}
          {wrongGuesses >= 1 && <circle cx="130" cy="65" r="15" stroke="#eee" strokeWidth="3" fill="none" />}
          {/* Body */}
          {wrongGuesses >= 2 && <line x1="130" y1="80" x2="130" y2="140" stroke="#eee" strokeWidth="3" />}
          {/* Left arm */}
          {wrongGuesses >= 3 && <line x1="130" y1="95" x2="105" y2="120" stroke="#eee" strokeWidth="3" />}
          {/* Right arm */}
          {wrongGuesses >= 4 && <line x1="130" y1="95" x2="155" y2="120" stroke="#eee" strokeWidth="3" />}
          {/* Left leg */}
          {wrongGuesses >= 5 && <line x1="130" y1="140" x2="105" y2="170" stroke="#eee" strokeWidth="3" />}
          {/* Right leg */}
          {wrongGuesses >= 6 && <line x1="130" y1="140" x2="155" y2="170" stroke="#eee" strokeWidth="3" />}
        </svg>
      </div>
    );
  }
}

export default HangmanDrawing;
