import { createGameState, gameLoop, startGame, togglePause, resetGame, endGame } from './gameLogic.js';
import { generateFood } from './food.js';
import { initRenderer, draw } from './renderer.js';
import { setupInputHandlers } from './input.js';
import {
    initUI,
    setupUIHandlers,
    updateScore,
    updateHighScore,
    showStartOverlay,
    showPauseOverlay,
    hidePauseOverlay,
    showGameOverOverlay,
    hideGameOverOverlay,
    hideStartOverlay,
    updateFullscreenButton,
    toggleFullscreen,
    setupFullscreenChangeListener
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Show loader
    const loaderOverlay = document.getElementById('loaderOverlay');

    // Initialize game state
    const gameState = createGameState();

    // Initialize UI
    const ui = initUI();

    // Initialize renderer
    const canvas = document.getElementById('gameCanvas');
    const renderer = initRenderer(canvas);

    // Initialize food
    gameState.food = generateFood(gameState.snake);

    // Update high score display
    updateHighScore(ui, gameState.highScore);

    // Create callbacks object for game logic
    const callbacks = {
        gameLoop: () => gameLoop(gameState, callbacks),
        startGame: () => startGame(gameState, callbacks),
        togglePause: () => togglePause(gameState, callbacks),
        resetGame: () => resetGame(gameState, callbacks),
        endGame: () => endGame(gameState, callbacks),
        generateFood: (snake) => generateFood(snake),
        updateScore: (score) => updateScore(ui, score),
        updateHighScore: (highScore) => updateHighScore(ui, highScore),
        showStartOverlay: () => showStartOverlay(ui),
        showPauseOverlay: () => showPauseOverlay(ui),
        hidePauseOverlay: () => hidePauseOverlay(ui),
        showGameOverOverlay: (score) => showGameOverOverlay(ui, score),
        hideGameOverOverlay: () => hideGameOverOverlay(ui),
        hideStartOverlay: () => hideStartOverlay(ui),
        draw: () => draw(renderer, gameState.snake, gameState.food),
        toggleFullscreen: () => toggleFullscreen(),
        updateFullscreenButton: (isFullscreen) => updateFullscreenButton(ui, isFullscreen)
    };

    // Setup input handlers
    setupInputHandlers(gameState, {
        startGame: callbacks.startGame,
        togglePause: callbacks.togglePause,
        resetGame: callbacks.resetGame
    });

    // Setup UI handlers
    setupUIHandlers(ui, {
        resetGame: callbacks.resetGame,
        toggleFullscreen: callbacks.toggleFullscreen
    });

    // Setup fullscreen change listener
    setupFullscreenChangeListener(() => {
        callbacks.updateFullscreenButton(!!document.fullscreenElement);
    });

    // Initial draw
    callbacks.draw();

    // Hide loader after 2 seconds
    setTimeout(() => {
        if (loaderOverlay) {
            loaderOverlay.style.display = 'none';
        }
        showStartOverlay(ui);
    }, 2000);
});
