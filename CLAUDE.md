# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A classic Snake game built with vanilla HTML, CSS (Tailwind), and JavaScript. The game runs entirely in the browser with no build step required. Uses a modular architecture with ES6 modules for better maintainability and scalability.

## Running the Game

**To play the game:** Open `snake.html` in any web browser. The game is fully playable immediately—no installation or build step needed.

Quick launch options:
- Open `snake.html` directly in your browser
- Use `/run` in Claude Code (recommended)
- Use a local HTTP server: `python -m http.server 8000`

## Architecture & Code Organization

The project uses a **modular ES6 module architecture** for better separation of concerns and maintainability.

### Module Structure (`js/` folder)

- **`index.js`**: Main orchestration module. Initializes all modules, sets up the game loop, and manages the overall application flow.
- de necesitar @gameLogic.js: Core game logic. Contains state management, game loop execution, collision detection, and game state transitions (start, pause, end, reset).

- **`renderer.js`**: Canvas rendering. Handles drawing the game board, snake, food, and all visual elements using the Canvas API.
- **`input.js`**: Input handling. Manages keyboard (arrow keys, WASD, spacebar) and touch gesture controls.
- **`ui.js`**: UI management. Controls overlays (start, pause, game over), buttons (restart, fullscreen), and updates display elements (score, high score).
- **`food.js`**: Food logic. Generates random food positions ensuring they don't spawn on the snake's body.
- **`constants.js`**: Game constants. Centralized definitions for CELL_SIZE, GRID dimensions, speeds, etc.

### Key Components

- **Game Loop**: Interval-based loop that updates snake position, checks collisions, and triggers rendering at variable speed
- **Rendering**: Canvas API with circular snake segments (head lighter, body darker) and glowing food effect
- **Input Handling**: Supports arrow keys, WASD, spacebar, and touch swipe gestures
- **Game States**: Tracks `gameRunning`, `gamePaused`, and `gameOver` flags to manage overlays and controls
- **Persistence**: High score stored in `localStorage` and persists across sessions
- **Fullscreen**: Button to toggle fullscreen mode using the Fullscreen API

### Game Mechanics

- Snake grows when eating food; body shrinks only when not consuming food
- Collision with walls or self ends the game
- Game speed increases every 50 points (5 eaten pieces) up to `MIN_SPEED` limit
- Food generation prevents spawning on snake's body
- Fullscreen button allows immersive gameplay experience

## Controls

- **Arrow keys or WASD**: Change direction
- **Space**: Start game / Toggle pause / Restart after game over
- **Touch drag**: Mobile swipe controls
- **Fullscreen button**: Toggle fullscreen mode (🖥️ / ✕)

## Styling Notes

- Uses Tailwind CSS with custom canvas styling for crisp pixel rendering
- Snake rendered as circles with opacity differences (head #4ade80, body #22c55e)
- Food rendered as red circles with glow effect
- Subtle grid background (low opacity) to avoid visual clutter
- Responsive design works on desktop and mobile devices

## Key Constants (in `js/constants.js`)

```javascript
CELL_SIZE = 40;      // Pixel size of each grid cell
GRID_WIDTH = 20;     // Game board width in cells
GRID_HEIGHT = 20;    // Game board height in cells
INITIAL_SPEED = 150; // Game loop interval in ms
MIN_SPEED = 60;      // Fastest game can get
```

## Development Notes

- Each module can be modified independently without affecting others
- Add new features by creating new modules and importing them in `index.js`
- Game state is centralized and passed through callbacks for predictable data flow
- Uses ES6 modules (`import`/`export`) for clean dependency management

