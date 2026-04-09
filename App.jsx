import React from 'react';
import HangmanDrawing from './components/HangmanDrawing.jsx';
import WordDisplay from './components/WordDisplay.jsx';
import Keyboard from './components/Keyboard.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import NewGameButton from './components/NewGameButton.jsx';
import LoginForm from './components/LoginForm.jsx';
import PlayerStats from './components/PlayerStats.jsx';
import { getRandomWord } from './data/words.js';
import { getPlayer, updatePlayer } from './data/api.js';

/*
  HangmanApp v2 - now with player tracking!

  New features:
  - Login screen asks for player name
  - GET to backend checks if player is in DynamoDB
  - If new, creates them. If existing, loads their stats
  - After each game, updates stats locally first, then PUTs to db
  - Shows wins, losses, and win % on the screen

  Component tree:
    HangmanApp (stateful - owns everything)
    ├── LoginForm (shown before login)
    ├── PlayerStats (shown after login)
    ├── NewGameButton
    ├── HangmanDrawing
    ├── WordDisplay
    │   └── LetterBox
    ├── Keyboard
    │   └── LetterButton
    └── GameOverModal

  State:
    - isLoggedIn: whether user has entered their name
    - playerName: the current player's name
    - wins / losses: their stats (updated locally first, then sent to db)
    - word, category, guessedLetters, showModal: same as before
*/

const MAX_WRONG = 5;

class HangmanApp extends React.Component {
  constructor(props) {
    super(props);

    const { word, category } = getRandomWord();

    this.state = {
      isLoggedIn: false,
      playerName: '',
      wins: 0,
      losses: 0,
      word: word,
      category: category,
      guessedLetters: [],
      showModal: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLetterClick = this.handleLetterClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  componentDidMount() {
    this.keyHandler = (event) => {
      if (!this.state.isLoggedIn) return;
      const letter = event.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        this.handleLetterClick(letter);
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  // called from LoginForm when user submits their name
  // checks db - if found, loads stats. if not, creates a new player
  async handleLogin(name) {
    try {
      const result = await getPlayer(name);

      if (result.found) {
        // existing player - load their stats
        this.setState({
          isLoggedIn: true,
          playerName: result.player.playerName,
          wins: result.player.wins || 0,
          losses: result.player.losses || 0,
        });
      } else {
        // new player - create them with 0 wins 0 losses
        await updatePlayer(name, 0, 0);
        this.setState({
          isLoggedIn: true,
          playerName: name,
          wins: 0,
          losses: 0,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Could not connect to the server. Make sure the backend is running.');
    }
  }

  handleLetterClick(letter) {
    if (this.state.guessedLetters.includes(letter)) return;

    const wrongLetters = this.state.guessedLetters.filter(
      (l) => !this.state.word.toUpperCase().includes(l)
    );
    const hasLost = wrongLetters.length >= MAX_WRONG;
    const wordLetters = this.state.word.toUpperCase().split('');
    const hasWon = wordLetters.every((l) => this.state.guessedLetters.includes(l));

    if (hasWon || hasLost) return;

    const newGuessedLetters = [...this.state.guessedLetters, letter];
    const newWrongLetters = newGuessedLetters.filter(
      (l) => !this.state.word.toUpperCase().includes(l)
    );
    const newHasLost = newWrongLetters.length >= MAX_WRONG;
    const newHasWon = wordLetters.every((l) => newGuessedLetters.includes(l));

    // figure out if stats need to update
    let newWins = this.state.wins;
    let newLosses = this.state.losses;
    if (newHasWon) newWins = newWins + 1;
    if (newHasLost) newLosses = newLosses + 1;

    // update local state first (so user sees change right away)
    this.setState({
      guessedLetters: newGuessedLetters,
      showModal: newHasWon || newHasLost,
      wins: newWins,
      losses: newLosses,
    });

    // then send update to the database
    if (newHasWon || newHasLost) {
      this.sendStatsToServer(newWins, newLosses);
    }
  }

  // sends current stats to db with a PUT request
  async sendStatsToServer(wins, losses) {
    try {
      await updatePlayer(this.state.playerName, wins, losses);
    } catch (err) {
      console.error('Failed to update stats:', err);
    }
  }

  handleNewGame() {
    const { word, category } = getRandomWord();
    this.setState({
      word: word,
      category: category,
      guessedLetters: [],
      showModal: false,
    });
  }

  render() {
    // if not logged in, show login screen
    if (!this.state.isLoggedIn) {
      return (
        <div className="hangman-app">
          <header className="app-header">
            <h1 className="app-title">Hangman</h1>
          </header>
          <LoginForm onLogin={this.handleLogin} />
        </div>
      );
    }

    const { word, category, guessedLetters, showModal, playerName, wins, losses } = this.state;

    const wordUpper = word.toUpperCase();
    const correctLetters = guessedLetters.filter((l) => wordUpper.includes(l));
    const wrongLetters = guessedLetters.filter((l) => !wordUpper.includes(l));
    const hasWon = wordUpper.split('').every((l) => guessedLetters.includes(l));
    const hasLost = wrongLetters.length >= MAX_WRONG;
    const isGameOver = hasWon || hasLost;

    return (
      <div className="hangman-app">
        <header className="app-header">
          <h1 className="app-title">Hangman</h1>
          <NewGameButton onNewGame={this.handleNewGame} />
        </header>

        <PlayerStats playerName={playerName} wins={wins} losses={losses} />

        <main className="game-area">
          <div className="game-left">
            <HangmanDrawing wrongGuesses={wrongLetters.length} />
            <div className="lives-counter">
              <span className="lives-label">Lives left</span>
              <span className="lives-hearts">
                {Array.from({ length: MAX_WRONG }, (_, i) => (
                  <span key={'life-' + i} className={'heart ' + (i < (MAX_WRONG - wrongLetters.length) ? 'alive' : 'dead')}>
                    {i < (MAX_WRONG - wrongLetters.length) ? '♥' : '♡'}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div className="game-right">
            <div className="category-hint">
              <span className="category-label">Category:</span>
              <span className="category-value">{category}</span>
            </div>

            <WordDisplay
              word={word}
              guessedLetters={guessedLetters}
              isGameOver={isGameOver}
            />

            <Keyboard
              guessedLetters={guessedLetters}
              correctLetters={correctLetters}
              onLetterClick={this.handleLetterClick}
              disabled={isGameOver}
            />
          </div>
        </main>

        <GameOverModal
          isVisible={showModal}
          isWinner={hasWon}
          word={word}
          onNewGame={this.handleNewGame}
        />
      </div>
    );
  }
}

export default HangmanApp;
