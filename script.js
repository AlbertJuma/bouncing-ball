// ===========================================
// BOUNCING BALL GAME - Main JavaScript File
// ===========================================

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get UI elements
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

// ===========================================
// GAME STATE VARIABLES
// ===========================================

let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let level = 1;
let animationId = null;

// ===========================================
// BALL OBJECT
// ===========================================

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 4,
    speedY: -4,
    color: '#00ff88',
    
    // Draw the ball on canvas
    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#00aa55';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    },
    
    // Update ball position
    update: function() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off left and right walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        
        // Bounce off top wall
        if (this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
        
        // Check if ball fell below paddle (Game Over)
        if (this.y - this.radius > canvas.height) {
            endGame();
        }
    },
    
    // Reset ball to center
    reset: function() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = 4;
        this.speedY = -4;
    },
    
    // Increase ball speed (difficulty)
    increaseSpeed: function() {
        this.speedX *= 1.05;
        this.speedY *= 1.05;
    }
};

// ===========================================
// PADDLE OBJECT
// ===========================================

const paddle = {
    width: 100,
    height: 15,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    speed: 8,
    color: '#ff6b6b',
    movingLeft: false,
    movingRight: false,
    
    // Draw the paddle
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add a border for better visibility
        ctx.strokeStyle = '#cc5555';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    },
    
    // Update paddle position based on key presses
    update: function() {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
    },
    
    // Reset paddle to center
    reset: function() {
        this.x = canvas.width / 2 - this.width / 2;
        this.movingLeft = false;
        this.movingRight = false;
    }
};

// ===========================================
// COLLISION DETECTION
// ===========================================

function checkPaddleCollision() {
    // Check if ball is at paddle height
    if (ball.y + ball.radius >= paddle.y && 
        ball.y - ball.radius <= paddle.y + paddle.height) {
        
        // Check if ball is within paddle width
        if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
            
            // Bounce the ball upward
            ball.speedY = -Math.abs(ball.speedY);
            
            // Add some horizontal variation based on where ball hits paddle
            const hitPosition = (ball.x - paddle.x) / paddle.width; // 0 to 1
            ball.speedX = (hitPosition - 0.5) * 10; // -5 to +5
            
            // Increase score
            score += 10;
            updateScore();
            
            // Check for level increase (every 50 points)
            if (score % 50 === 0) {
                levelUp();
            }
        }
    }
}

// ===========================================
// GAME LOGIC FUNCTIONS
// ===========================================

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateLevel() {
    levelDisplay.textContent = level;
}

function levelUp() {
    level++;
    updateLevel();
    ball.increaseSpeed();
    
    // Visual feedback
    paddle.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
}

function startGame() {
    gameState = 'playing';
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    
    // Reset game variables
    score = 0;
    level = 1;
    updateScore();
    updateLevel();
    
    // Reset game objects
    ball.reset();
    paddle.reset();
    
    // Start game loop
    gameLoop();
}

function endGame() {
    gameState = 'gameOver';
    cancelAnimationFrame(animationId);
    
    // Show restart button
    restartBtn.style.display = 'inline-block';
    
    // Display Game Over message on canvas
    displayGameOver();
}

function displayGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`Level Reached: ${level}`, canvas.width / 2, canvas.height / 2 + 55);
}

function displayStartScreen() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Display welcome message
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Bouncing Ball Game', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Click "Start Game" to begin', canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.font = '16px Arial';
    ctx.fillText('Use ← → arrow keys to move paddle', canvas.width / 2, canvas.height / 2 + 50);
}

// ===========================================
// DRAWING FUNCTIONS
// ===========================================

function clearCanvas() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGame() {
    clearCanvas();
    ball.draw();
    paddle.draw();
}

// ===========================================
// MAIN GAME LOOP
// ===========================================

function gameLoop() {
    if (gameState !== 'playing') return;
    
    // Update game objects
    ball.update();
    paddle.update();
    
    // Check collisions
    checkPaddleCollision();
    
    // Draw everything
    drawGame();
    
    // Continue loop
    animationId = requestAnimationFrame(gameLoop);
}

// ===========================================
// EVENT LISTENERS
// ===========================================

// Keyboard controls
document.addEventListener('keydown', function(e) {
    if (gameState !== 'playing') return;
    
    if (e.key === 'ArrowLeft') {
        paddle.movingLeft = true;
    } else if (e.key === 'ArrowRight') {
        paddle.movingRight = true;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') {
        paddle.movingLeft = false;
    } else if (e.key === 'ArrowRight') {
        paddle.movingRight = false;
    }
});

// Button controls
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// ===========================================
// INITIALIZE GAME
// ===========================================

// Display start screen when page loads
displayStartScreen();
