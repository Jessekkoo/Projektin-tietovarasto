const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('finalScore');
const popup = document.getElementById('gameOverPopup');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, score, gameOver, gamePaused;

document.addEventListener('keydown', handleKeyPress);

function init() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: 5, y: 5 };
  score = 0;
  gameOver = false;
  gamePaused = false;
  scoreDisplay.textContent = score;
  popup.classList.add('hidden');
  gameLoop();
}

function handleKeyPress(e) {
  if (gamePaused) return;

  if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
  else if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
  else if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
  else if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
}

function gameLoop() {
  if (gameOver || gamePaused) return;

  update();
  draw();

  setTimeout(gameLoop, 110); 
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#222';
    for (let i = 0; i < tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }
  
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#00cccc';
        
      ctx.shadowBlur = 10;
      ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }
  
    ctx.shadowBlur = 0;
  
    ctx.fillStyle = '#ff0033';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function endGame() {
  gameOver = true;
  gamePaused = true;
  finalScore.textContent = score;
  popup.classList.remove('hidden');
}

function restartGame() {
  init();
}

function goBack() {
  window.location.href = '../../index.html';
}

init();
