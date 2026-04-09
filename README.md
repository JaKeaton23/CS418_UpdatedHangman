# Hangman Game v2

A hangman word-guessing game with **player tracking** using React, Node.js, Express, and DynamoDB. Built for my fullstack development class as an extension of the original Chapter 2 hangman app.

## What's New in v2

- **Player login screen** — enter your name before playing
- **DynamoDB integration** — player stats are saved in a database
- **Win/loss tracking** — your record follows you between sessions
- **Win percentage** displayed on the game screen
- **Backend API** with GET and PUT endpoints
- **Unit tests** for both backend API and frontend UI
- **Docker Compose** — runs DynamoDB + backend + frontend all together

## How It Works

1. User enters their name on the login screen
2. Frontend sends a **GET** request to `/player/:name`
   - If the player exists in DynamoDB, their stats load
   - If they don't exist, a new record is created with 0 wins and 0 losses
3. Player plays the game
4. When a game ends (win or loss), stats are **updated locally first** in React state
5. Then a **PUT** request sends the updated stats to the backend to save in DynamoDB

## How to Run

### Option 1: Docker Compose (recommended)

This runs everything at once — DynamoDB, backend, and frontend:

```bash
docker-compose up --build
```

Then open:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3001
- **DynamoDB Local:** http://localhost:8000

To stop everything:

```bash
docker-compose down
```

### Option 2: Run Manually (for development)

You'll need 3 terminals.

**Terminal 1 — Start DynamoDB Local:**

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

**Terminal 2 — Start the backend:**

```bash
cd backend
npm install
node createTable.js   # only needed the first time
npm start
```

**Terminal 3 — Start the frontend:**

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## API Endpoints

### `GET /player/:name`

Checks if a player exists in the database.

**Response if found:**
```json
{
  "found": true,
  "player": {
    "playerName": "jayden",
    "wins": 5,
    "losses": 2
  }
}
```

**Response if not found:**
```json
{
  "found": false
}
```

### `PUT /player/:name`

Creates or updates a player's stats.

**Request body:**
```json
{
  "wins": 5,
  "losses": 2
}
```

**Response:**
```json
{
  "success": true,
  "player": {
    "playerName": "jayden",
    "wins": 5,
    "losses": 2
  }
}
```

## Testing the API with Postman

1. Download **Postman** from https://www.postman.com/downloads/
2. Import the file `hangman-api.postman_collection.json` from this repo
3. The collection has 4 pre-made requests:
   - Health Check
   - Get Player (existing)
   - Get Player (not found)
   - Create/Update Player
4. Make sure the backend is running first (either via Docker Compose or manually)

## Running the Tests

### Backend tests (7 tests)

```bash
cd backend
npm test
```

Tests cover:
- Health check endpoint
- GET player when found
- GET player when not found
- GET player when database errors
- PUT player with stats
- PUT player with default values
- PUT player when database errors

The tests **mock** the DynamoDB client so they don't need a real database to run.

### Frontend tests (14 tests)

```bash
cd frontend
npm test
```

Tests cover:
- **PlayerStats component** — renders name, wins, losses, win percentage correctly (including 0% and 100% edge cases)
- **LoginForm component** — input rendering, submission, whitespace trimming, empty name validation
- **API helpers** — `getPlayer` and `updatePlayer` functions with mocked fetch

## Project Structure

```
hangman-v2/
├── backend/
│   ├── tests/
│   │   └── server.test.js       # Backend Jest tests
│   ├── createTable.js            # Script to create the DynamoDB table
│   ├── dynamoClient.js           # DynamoDBDocumentClient setup
│   ├── server.js                 # Express API with GET/PUT endpoints
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── LoginForm.test.jsx
│   │   │   ├── PlayerStats.test.jsx
│   │   │   └── api.test.js
│   │   ├── assets/               # Hangman images
│   │   ├── components/
│   │   │   ├── GameOverModal.jsx
│   │   │   ├── HangmanDrawing.jsx
│   │   │   ├── Keyboard.jsx
│   │   │   ├── LetterBox.jsx
│   │   │   ├── LetterButton.jsx
│   │   │   ├── LoginForm.jsx     # NEW - login screen
│   │   │   ├── NewGameButton.jsx
│   │   │   ├── PlayerStats.jsx   # NEW - player stats display
│   │   │   └── WordDisplay.jsx
│   │   ├── data/
│   │   │   ├── api.js            # NEW - fetch helpers for backend
│   │   │   └── words.js
│   │   ├── App.jsx               # UPDATED - handles login and stats
│   │   ├── index.css
│   │   └── main.jsx
│   ├── babel.config.cjs           # For Jest
│   ├── jest.setup.js              # For Jest
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml             # Runs DynamoDB + backend + frontend
├── hangman-api.postman_collection.json
└── README.md
```

## Tech Stack

- **React 18** — class components
- **Vite** — frontend build tool
- **Express** — backend API
- **AWS SDK v3** — DynamoDBDocumentClient for easier db operations
- **DynamoDB Local** — runs in Docker so no AWS account needed
- **Jest** — unit testing (backend and frontend)
- **React Testing Library** — component tests
- **Supertest** — API endpoint tests
- **Docker + Docker Compose** — deployment

## React Concepts Used

All the Chapter 2 concepts from v1 are still here, plus:

- **Async/await with fetch** — for API calls in api.js
- **State updates that depend on async results** — waiting for GET response before updating login state
- **Optimistic UI updates** — updating state locally first, then syncing with server
- **Conditional rendering at the app level** — showing LoginForm OR the game based on state
- **Mocking in Jest** — mocking `fetch` on the frontend, mocking the DynamoDB client on the backend

## Things I Learned

- How to set up **DynamoDB Local** so you can develop without an AWS account
- The difference between the **low-level DynamoDB client** and the **DynamoDBDocumentClient** — the Document client is way easier because you pass regular JS objects instead of typed attributes like `{S: "value"}`
- How to **mock the database** in tests so they run fast and don't need a real db
- Why you update state **locally first** and then sync with the server — it feels instant to the user
- How to **wire up multiple services** with Docker Compose
- How to use **Postman** to test an API without building the UI first

## Challenges / Hiccups

- Spent a while debugging the wrong Jest config option name (`setupFilesAfterEach` instead of `setupFilesAfterEnv`). It's an easy typo to miss.
- Had to figure out how to make the Jest setup file load jest-dom matchers so `toBeInTheDocument` would work
- Initially had the backend try to create the table every time the server started, which caused errors after the first run. Moved it to a separate `createTable.js` script.
- Had to make sure the backend's `server.js` only calls `app.listen()` when run directly (not when imported by tests) so Jest wouldn't hang with an open server
- The Docker Compose file needed a `sleep` command so the backend would wait for DynamoDB Local to be ready before trying to create the table
