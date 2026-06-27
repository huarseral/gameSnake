import { GRID_WIDTH, GRID_HEIGHT } from './constants.js';

export function generateFood(snake) {
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
