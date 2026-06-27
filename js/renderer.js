import { CELL_SIZE, GRID_WIDTH, GRID_HEIGHT } from './constants.js';

export function initRenderer(canvasElement) {
    const ctx = canvasElement.getContext('2d');
    return { canvas: canvasElement, ctx };
}

export function draw(renderer, snake, food) {
    const { canvas, ctx } = renderer;

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
            ctx.fillStyle = '#4ade80';
        } else {
            ctx.fillStyle = '#22c55e';
        }

        const padding = 1;
        ctx.fillRect(
            segment.x * CELL_SIZE + padding,
            segment.y * CELL_SIZE + padding,
            CELL_SIZE - 2 * padding,
            CELL_SIZE - 2 * padding
        );

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
