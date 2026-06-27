export function setupInputHandlers(gameState, callbacks) {
    let touchStartX = 0;
    let touchStartY = 0;

    // Touch controls
    document.getElementById('gameCanvas').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);

    document.getElementById('gameCanvas').addEventListener('touchend', (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && gameState.direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 };
            } else if (diffX < 0 && gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
            }
        } else {
            if (diffY > 0 && gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
            } else if (diffY < 0 && gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
            }
        }
    }, false);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            if (!gameState.gameRunning) {
                callbacks.startGame();
            } else if (gameState.gameOver) {
                callbacks.resetGame();
            } else {
                callbacks.togglePause();
            }
            return;
        }

        if (!gameState.gameRunning || gameState.gamePaused) return;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            if (gameState.direction.y === 0) gameState.nextDirection = { x: 0, y: -1 };
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            if (gameState.direction.y === 0) gameState.nextDirection = { x: 0, y: 1 };
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            if (gameState.direction.x === 0) gameState.nextDirection = { x: -1, y: 0 };
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            if (gameState.direction.x === 0) gameState.nextDirection = { x: 1, y: 0 };
        }
    });
}
