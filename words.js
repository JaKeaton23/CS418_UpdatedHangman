// words.js - word bank for the hangman game
const words = [
  { word: 'javascript', category: 'Programming' },
  { word: 'react', category: 'Programming' },
  { word: 'database', category: 'Technology' },
  { word: 'docker', category: 'Technology' },
  { word: 'elephant', category: 'Animals' },
  { word: 'guitar', category: 'Music' },
  { word: 'mountain', category: 'Nature' },
  { word: 'lighthouse', category: 'Places' },
  { word: 'blanket', category: 'Objects' },
  { word: 'umbrella', category: 'Objects' },
];

export function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}
