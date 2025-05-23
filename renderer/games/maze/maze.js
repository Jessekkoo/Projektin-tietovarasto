const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('win-popup');
const stepsSound = new Audio('../../sound/steps.wav'); 
const winSound = new Audio('../../sound/win.mp3');

const tileSize = 40;
const rows = 15;
const cols = 15;

let player = { x: 1, y: 1 };
let goal = { x: cols - 2, y: rows - 2 };
let maze = [];

function initMaze() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  function carve(x, y) {
    const directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0]
    ].sort(() => Math.random() - 0.5); 

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (ny > 0 && ny < rows - 1 && nx > 0 && nx < cols - 1 && maze[ny][nx] === 1) {
        maze[ny - dy / 2][nx - dx / 2] = 0;
        maze[ny][nx] = 0;
        carve(nx, ny);
      }
    }
  }

  maze[player.y][player.x] = 0;
  carve(player.x, player.y);
  maze[goal.y][goal.x] = 0;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = maze[y][x] === 1 ? '#222' : '#333';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.fillStyle = '#0f0';
  ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);

  ctx.fillStyle = '#0ff';
  ctx.beginPath();
  ctx.arc(
    player.x * tileSize + tileSize / 2,
    player.y * tileSize + tileSize / 2,
    tileSize / 2.5,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function move(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (maze[newY] && maze[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    checkWin();
    stepsSound.play();
  }
}

function checkWin() {
  if (player.x === goal.x && player.y === goal.y) {
    setTimeout(() => {
      overlay.style.display = 'flex';
    }, 100);
    winSound.play();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') move(0, -1);
  if (e.key === 'ArrowDown' || e.key === 's') move(0, 1);
  if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0);
  if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0);
});

document.getElementById('restart').onclick = () => {
  player = { x: 1, y: 1 };
  goal = { x: cols - 2, y: rows - 2 };
  initMaze();
  overlay.style.display = 'none';
  drawMaze();
};

document.getElementById('back').onclick = () => {
  window.location.href = '../../index.html';
};
function restartGame() {
  player = { x: 1, y: 1 };
  goal = { x: cols - 2, y: rows - 2 };
  initMaze();
  document.getElementById('win-popup').style.display = 'none';
  drawMaze();
}

function goBack() {
  window.location.href = '../../index.html';
}

// If you're using popup buttons too:
document.getElementById('restart').onclick = restartGame;
document.getElementById('back').onclick = goBack;

initMaze();
drawMaze();
