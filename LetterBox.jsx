import React from 'react';

// LetterBox - a single letter slot in the word display
class LetterBox extends React.Component {
  render() {
    const { letter, isRevealed } = this.props;
    return (
      <div className="letter-box">
        <span className="letter-box-letter">{isRevealed ? letter.toUpperCase() : ''}</span>
        <div className="letter-box-underline" />
      </div>
    );
  }
}

export default LetterBox;
