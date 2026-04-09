import React from 'react';

// LetterButton - a single key on the keyboard
class LetterButton extends React.Component {
  render() {
    const { letter, isGuessed, isCorrect, onClick, disabled } = this.props;
    let className = 'letter-button';
    if (isGuessed) className += isCorrect ? ' correct' : ' wrong';

    return (
      <button
        className={className}
        onClick={() => onClick(letter)}
        disabled={disabled || isGuessed}
      >
        {letter}
      </button>
    );
  }
}

export default LetterButton;
