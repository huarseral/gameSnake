import { GRID_WIDTH, GRID_HEIGHT, INITIAL_SPEED, MIN_SPEED } from './constants.js';

export function createGameState() {
    return {
        snake: [{ x: 10, y: 10 }],
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        food: null,
        score: 0,
        highScore: localStorage.getItem('snakeHighScore') || 0,
        gameRunning: false,
        gamePaused: false,
        gameOver: false,
        gameSpeed: INITIAL_SPEED,
        gameLoopInterval: null
    };
}

export function gameLoop(gameState, callbacks) {
    gameState.direction = gameState.nextDirection;

    // Calculate new head position
    const head = gameState.snake[0];
    const newHead = {
        x: head.x + gameState.direction.x,
        y: head.y + gameState.direction.y
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
        callbacks.endGame();
        return;
    }

    // Check self collision
    if (gameState.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        callbacks.endGame();
        return;
    }

    gameState.snake.unshift(newHead);

    // Check food collision
    if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
        gameState.score += 10;
        callbacks.updateScore(gameState.score);

        // Increase speed every 5 points
        if (gameState.score % 50 === 0) {
            gameState.gameSpeed = Math.max(gameState.gameSpeed - 5, MIN_SPEED);
            if (gameState.gameLoopInterval) {
                clearInterval(gameState.gameLoopInterval);
                gameState.gameLoopInterval = setInterval(() => callbacks.gameLoop(), gameState.gameSpeed);
            }
        }

        gameState.food = callbacks.generateFood(gameState.snake);
    } else {
        gameState.snake.pop();
    }

    callbacks.draw();
}

export function startGame(gameState, callbacks) {
    gameState.gameRunning = true;
    gameState.gameOver = false;
    gameState.gamePaused = false;
    callbacks.hideStartOverlay();
    callbacks.hidePauseOverlay();
    callbacks.hideGameOverOverlay();

    if (gameState.gameLoopInterval) clearInterval(gameState.gameLoopInterval);
    gameState.gameLoopInterval = setInterval(() => callbacks.gameLoop(), gameState.gameSpeed);
}

export function togglePause(gameState, callbacks) {
    gameState.gamePaused = !gameState.gamePaused;
    if (gameState.gamePaused) {
        callbacks.showPauseOverlay();
        if (gameState.gameLoopInterval) clearInterval(gameState.gameLoopInterval);
    } else {
        callbacks.hidePauseOverlay();
        gameState.gameLoopInterval = setInterval(() => callbacks.gameLoop(), gameState.gameSpeed);
    }
}

export function resetGame(gameState, callbacks) {
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.food = callbacks.generateFood(gameState.snake);
    gameState.score = 0;
    gameState.gameSpeed = INITIAL_SPEED;
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    gameState.gameOver = false;

    callbacks.updateScore(0);
    callbacks.showStartOverlay();
    callbacks.hideGameOverOverlay();

    if (gameState.gameLoopInterval) clearInterval(gameState.gameLoopInterval);
    callbacks.draw();
}

export function endGame(gameState, callbacks) {
    gameState.gameRunning = false;
    gameState.gameOver = true;
    if (gameState.gameLoopInterval) clearInterval(gameState.gameLoopInterval);

    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
        callbacks.updateHighScore(gameState.highScore);
    }

    callbacks.showGameOverOverlay(gameState.score);
    callbacks.draw();
}
