const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const paddleSpeed = 5;
const ballSpeed = 4;
const aiDelay = 0.1; // Fator de atraso para a IA

const playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dy: 0
};

const aiPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    targetY: canvas.height / 2 - paddleHeight / 2 // Posição alvo da IA
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speedX: ballSpeed,
    speedY: ballSpeed,
    color: '#fff'
};

// Scores
let playerScore = 0;
let aiScore = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = playerPaddle.color;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

    ctx.fillStyle = aiPaddle.color;
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Draw score
    const scoreElement = document.getElementById('scoreboard');
    scoreElement.textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom walls
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    if (
        ball.x - ball.size < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.speedX *= -1;
    }

    if (
        ball.x + ball.size > aiPaddle.x &&
        ball.y > aiPaddle.y &&
        ball.y < aiPaddle.y + aiPaddle.height
    ) {
        ball.speedX *= -1;
    }

    // Ball out of bounds
    if (ball.x - ball.size < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement with delay
    aiPaddle.targetY = ball.y - aiPaddle.height / 2;
    aiPaddle.y += (aiPaddle.targetY - aiPaddle.y) * aiDelay;
    
    // Ensure AI paddle stays within canvas
    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));

    // Player paddle movement
    playerPaddle.y += playerPaddle.dy;
    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y));
}

function keyDownHandler(e) {
    if (e.key === 'ArrowUp') {
        playerPaddle.dy = -paddleSpeed;
    } else if (e.key === 'ArrowDown') {
        playerPaddle.dy = paddleSpeed;
    }
}

function keyUpHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playerPaddle.dy = 0;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
