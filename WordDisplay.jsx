import React from 'react';
import LetterBox from './LetterBox.jsx';

// WordDisplay - shows the word as a row of letter boxes
class WordDisplay extends React.Component {
  render() {
    const { word, guessedLetters, isGameOver } = this.props;
    return (
      <div className="word-display">
        {word.toUpperCase().split('').map((letter, index) => (
          <LetterBox
            key={index}
            letter={letter}
            isRevealed={guessedLetters.includes(letter) || isGameOver}
          />
        ))}
      </div>
    );
  }
}

export default WordDisplay;
