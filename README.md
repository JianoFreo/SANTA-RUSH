# Santa Rush 🎅

A fun endless runner game combining Flappy Bird mechanics with Zombie Tsunami-style collecting! Navigate through obstacles, collect followers, and build your horde while trying to achieve the highest score.

## Game Features

- **Flappy Physics**: Click or press SPACE to make your character jump
- **Endless Runner**: Obstacles continuously spawn with increasing difficulty
- **Collector Mechanic**: Gather followers that trail behind you
- **Score System**: Earn points by passing obstacles
- **Leaderboard**: Compete with other players
- **Progressive Difficulty**: Game gets harder as your score increases

## Tech Stack

### Frontend
- **HTML5 Canvas** for game rendering
- **JavaScript (ES6+)** for game logic
- **Tailwind CSS** for styling
- **Vanilla JS** (no frameworks needed)

### Backend
- **Golang** API server
- **Gorilla Mux** for routing
- **In-memory storage** (can be upgraded to database)
- **RESTful API** for score management

## Project Structure

```
SANTA-RUSH/
├── index.html              # Main game page
├── styles.css              # Custom styles
├── js/
│   ├── game.js            # Main game loop & logic
│   ├── player.js          # Player and follower classes
│   ├── physics.js         # Physics engine (gravity, collision)
│   ├── obstacles.js       # Obstacle generation & management
│   ├── collectibles.js    # Collectible items (followers)
│   └── api.js             # Backend communication
└── backend/
    ├── main.go            # Go server entry point
    ├── go.mod             # Go module file
    ├── go.sum             # Go dependencies
    ├── models/
    │   └── score.go       # Data models
    └── handlers/
        └── score.go       # API handlers
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Go 1.21+ (for backend)
- Local web server or just open index.html directly

### Running the Frontend

1. **Option 1: Direct File Open**
   ```
   Simply open index.html in your browser
   ```

2. **Option 2: Local Server** (recommended for development)
   ```powershell
   # Using Python 3
   python -m http.server 3000
   
   # Using Node.js http-server
   npx http-server -p 3000
   
   # Using PHP
   php -S localhost:3000
   ```

3. Open `http://localhost:3000` in your browser

### Running the Backend (Optional)

The game works without the backend using local storage, but for full leaderboard functionality:

1. Navigate to backend directory:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   go mod download
   ```

3. Run the server:
   ```powershell
   go run main.go
   ```

4. Server will start at `http://localhost:8080`

## API Endpoints

### GET /api/health
Health check endpoint
```json
{
  "status": "ok",
  "message": "Santa Rush API is running"
}
```

### POST /api/scores
Submit a new score
```json
{
  "playerName": "Player1",
  "score": 42,
  "followers": 5
}
```

### GET /api/leaderboard?limit=10
Get top scores
```json
{
  "scores": [...],
  "total": 100
}
```

## How to Play

1. **Start**: Click the "START GAME" button
2. **Jump**: Click anywhere on the canvas or press SPACE
3. **Avoid**: Navigate through gaps in obstacles
4. **Collect**: Grab golden collectibles to add followers
5. **Score**: Pass through obstacles to earn points
6. **Survive**: Don't hit obstacles or boundaries!

## Game Mechanics

- **Gravity System**: Player constantly falls, must jump to stay airborne
- **Flappy Controls**: Tap to flap upward, similar to Flappy Bird
- **Obstacle Patterns**: Randomly generated gaps requiring timing
- **Follower Chain**: Collected characters follow in a smooth trail
- **Difficulty Scaling**: Gap size decreases and speed increases with score

## Future Enhancements

- [ ] Add custom UI graphics
- [ ] Power-ups and special abilities
- [ ] Multiple character skins
- [ ] Sound effects and background music
- [ ] Mobile touch controls
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Multiplayer mode
- [ ] Achievements system

## Development

### Adding Custom Graphics

Replace the placeholder drawings in:
- `player.js` - Player and follower rendering
- `obstacles.js` - Obstacle appearance
- `collectibles.js` - Collectible items

### Customizing Difficulty

Edit values in:
- `physics.js` - Gravity, jump strength
- `obstacles.js` - Gap size, spawn rate
- `game.js` - Speed progression

## Credits

Created as a hybrid game combining mechanics from:
- **Flappy Bird** - Tap-to-flap physics
- **Zombie Tsunami** - Endless runner with collecting

## License

This project is open source and available for educational purposes.

---

Enjoy playing Santa Rush! 🎮🎅