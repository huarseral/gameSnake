export function initUI() {
    return {
        scoreDisplay: document.getElementById('scoreDisplay'),
        highScoreDisplay: document.getElementById('highScoreDisplay'),
        startOverlay: document.getElementById('startOverlay'),
        pauseOverlay: document.getElementById('pauseOverlay'),
        gameOverOverlay: document.getElementById('gameOverOverlay'),
        finalScoreDisplay: document.getElementById('finalScore'),
        restartBtn: document.getElementById('restartBtn'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        fullscreenIcon: document.getElementById('fullscreenIcon'),
        fullscreenText: document.getElementById('fullscreenText')
    };
}

export function setupUIHandlers(ui, callbacks) {
    ui.restartBtn.addEventListener('click', callbacks.resetGame);
    ui.fullscreenBtn.addEventListener('click', callbacks.toggleFullscreen);
}

export function updateScore(ui, score) {
    ui.scoreDisplay.textContent = score;
}

export function updateHighScore(ui, highScore) {
    ui.highScoreDisplay.textContent = highScore;
}

export function showStartOverlay(ui) {
    ui.startOverlay.classList.remove('hidden');
    ui.pauseOverlay.classList.add('hidden');
    ui.gameOverOverlay.classList.add('hidden');
}

export function showPauseOverlay(ui) {
    ui.pauseOverlay.classList.remove('hidden');
}

export function hidePauseOverlay(ui) {
    ui.pauseOverlay.classList.add('hidden');
}

export function showGameOverOverlay(ui, finalScore) {
    ui.finalScoreDisplay.textContent = finalScore;
    ui.gameOverOverlay.classList.remove('hidden');
}

export function hideGameOverOverlay(ui) {
    ui.gameOverOverlay.classList.add('hidden');
}

export function hideStartOverlay(ui) {
    ui.startOverlay.classList.add('hidden');
}

export function updateFullscreenButton(ui, isFullscreen) {
    if (isFullscreen) {
        ui.fullscreenIcon.textContent = '✕';
        ui.fullscreenText.textContent = 'Salir Fullscreen';
    } else {
        ui.fullscreenIcon.textContent = '🖥️';
        ui.fullscreenText.textContent = 'Fullscreen';
    }
}

export function toggleFullscreen() {
    const container = document.querySelector('.snake-container');

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {
            alert('No se pudo activar pantalla completa');
        });
    } else {
        document.exitFullscreen();
    }
}

export function setupFullscreenChangeListener(callback) {
    document.addEventListener('fullscreenchange', callback);
}
