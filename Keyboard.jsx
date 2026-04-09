import React from 'react';
import LetterButton from './LetterButton.jsx';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Keyboard - 26-letter clickable keyboard
class Keyboard extends React.Component {
  render() {
    const { guessedLetters, correctLetters, onLetterClick, disabled } = this.props;
    return (
      <div className="keyboard">
        {LETTERS.map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            isGuessed={guessedLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
            onClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }
}

export default Keyboard;
