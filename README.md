https://jianofreo.github.io/SANTA-RUSH/

# Santa Rush 

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

## Credits

Created as a hybrid game combining mechanics from:
- **Flappy Bird** - Tap-to-flap physics
- **Zombie Tsunami** - Endless runner with collecting
