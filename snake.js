document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const CELL_SIZE = 40;
    const GRID_WIDTH = 20;
    const GRID_HEIGHT = 20;
    const INITIAL_SPEED = 150;
    const MIN_SPEED = 60;

    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game state
    let snake = [{x: 10, y: 10}];
    let direction = {x: 1, y: 0};
    let nextDirection = {x: 1, y: 0};
    let food = generateFood();
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameRunning = false;
    let gamePaused = false;
    let gameOver = false;
    let gameSpeed = INITIAL_SPEED;
    let gameLoopInterval = null;

    // UI Elements
    const scoreDisplay = document.getElementById('scoreDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const startOverlay = document.getElementById('startOverlay');
    const pauseOverlay = document.getElementById('pauseOverlay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartBtn = document.getElementById('restartBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const fullscreenText = document.getElementById('fullscreenText');

    // Initialize high score display
    updateHighScoreDisplay();

    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);

    canvas.addEventListener('touchend', (e) => {
        if (!gameRunning || gamePaused) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && direction.x === 0) {
                nextDirection = {x: 1, y: 0};
            } else if (diffX < 0 && direction.x === 0) {
                nextDirection = {x: -1, y: 0};
            }
        } else {
            if (diffY > 0 && direction.y === 0) {
                nextDirection = {x: 0, y: 1};
            } else if (diffY < 0 && direction.y === 0) {
                nextDirection = {x: 0, y: -1};
            }
        }
    }, false);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            if (!gameRunning) {
                startGame();
            } else if (gameOver) {
                resetGame();
            } else {
                togglePause();
            }
            return;
        }

        if (!gameRunning || gamePaused) return;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            if (direction.y === 0) nextDirection = {x: 0, y: -1};
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            if (direction.y === 0) nextDirection = {x: 0, y: 1};
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            if (direction.x === 0) nextDirection = {x: -1, y: 0};
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            if (direction.x === 0) nextDirection = {x: 1, y: 0};
        }
    });

    // Event listeners
    restartBtn.addEventListener('click', resetGame);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    function startGame() {
        gameRunning = true;
        gameOver = false;
        gamePaused = false;
        startOverlay.classList.add('hidden');
        pauseOverlay.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');

        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameLoop, gameSpeed);
    }

    function togglePause() {
        gamePaused = !gamePaused;
        if (gamePaused) {
            pauseOverlay.classList.remove('hidden');
            if (gameLoopInterval) clearInterval(gameLoopInterval);
        } else {
            pauseOverlay.classList.add('hidden');
            gameLoopInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    function resetGame() {
        snake = [{x: 10, y: 10}];
        direction = {x: 1, y: 0};
        nextDirection = {x: 1, y: 0};
        food = generateFood();
        score = 0;
        gameSpeed = INITIAL_SPEED;
        gameRunning = false;
        gamePaused = false;
        gameOver = false;

        scoreDisplay.textContent = '0';
        startOverlay.classList.remove('hidden');
        gameOverOverlay.classList.add('hidden');

        if (gameLoopInterval) clearInterval(gameLoopInterval);
        draw();
    }

    function gameLoop() {
        direction = nextDirection;

        // Calculate new head position
        const head = snake[0];
        const newHead = {
            x: head.x + direction.x,
            y: head.y + direction.y
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
            endGame();
            return;
        }

        // Check self collision
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            endGame();
            return;
        }

        snake.unshift(newHead);

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;

            // Increase speed every 5 points
            if (score % 50 === 0) {
                gameSpeed = Math.max(gameSpeed - 5, MIN_SPEED);
                if (gameLoopInterval) {
                    clearInterval(gameLoopInterval);
                    gameLoopInterval = setInterval(gameLoop, gameSpeed);
                }
            }

            food = generateFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function endGame() {
        gameRunning = false;
        gameOver = true;
        if (gameLoopInterval) clearInterval(gameLoopInterval);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            updateHighScoreDisplay();
        }

        finalScoreDisplay.textContent = score;
        gameOverOverlay.classList.remove('hidden');
        draw();
    }

    function generateFood() {
        let newFood;
        let foodOnSnake = true;

        while (foodOnSnake) {
            newFood = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
            foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }

        return newFood;
    }

    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = highScore;
    }

    function toggleFullscreen() {
        const container = document.querySelector('.snake-container');

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(() => {
                alert('No se pudo activar pantalla completa');
            });
            fullscreenIcon.textContent = '✕';
            fullscreenText.textContent = 'Salir Fullscreen';
        } else {
            document.exitFullscreen();
            fullscreenIcon.textContent = '🖥️';
            fullscreenText.textContent = 'Fullscreen';
        }
    }

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenIcon.textContent = '🖥️';
            fullscreenText.textContent = 'Fullscreen';
        }
    });

    function draw() {
        // Clear canvas
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw subtle grid
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_WIDTH; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= GRID_HEIGHT; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(canvas.width, i * CELL_SIZE);
            ctx.stroke();
        }

        // Draw snake
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - brighter green
                ctx.fillStyle = '#4ade80';
            } else {
                // Body - darker green
                ctx.fillStyle = '#22c55e';
            }

            const padding = 1;
            ctx.fillRect(
                segment.x * CELL_SIZE + padding,
                segment.y * CELL_SIZE + padding,
                CELL_SIZE - 2 * padding,
                CELL_SIZE - 2 * padding
            );

            // Add rounded corners effect with small circles
            ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e';
            ctx.beginPath();
            ctx.arc(
                segment.x * CELL_SIZE + CELL_SIZE / 2,
                segment.y * CELL_SIZE + CELL_SIZE / 2,
                CELL_SIZE / 2 - padding,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Glow effect on food
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    // Initial draw
    draw();
});
