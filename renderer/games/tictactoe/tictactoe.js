const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeModal = document.getElementById('modeModal');
const manualBtn = document.getElementById('manualBtn');
const autoBtn = document.getElementById('autoBtn');

let currentPlayer = 'X';
let cells = Array(9).fill('');
let gameActive = true;
let vsComputer = false;

// Get audio elements for sound effects
const xSound = document.getElementById('x-sound');
const oSound = document.getElementById('o-sound');

manualBtn.onclick = () => {
  vsComputer = false;
  modeModal.style.display = 'none';
  createBoard();
};

autoBtn.onclick = () => {
  vsComputer = true;
  modeModal.style.display = 'none';
  createBoard();
};

window.onload = () => {
  modeModal.style.display = 'flex';
};

resetBtn.onclick = () => {
  createBoard();
};

function goBack() {
  window.location.href = '../../index.html';
}

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill('');
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player X's Turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || cells[index] !== '' || (vsComputer && currentPlayer === 'O')) return;

  makeMove(index, currentPlayer);

  if (checkEnd()) return;

  if (vsComputer) {
    currentPlayer = 'O';
    statusText.textContent = `Computer's Turn`;
    setTimeout(makeComputerMove, 500);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function makeMove(index, player) {
  cells[index] = player;
  document.querySelector(`.cell[data-index="${index}"]`).textContent = player;

  // Play the sound when a move is made
  if (player === 'X') {
    xSound.play(); // Play sound for 'X'
  } else if (player === 'O') {
    oSound.play(); // Play sound for 'O'
  }
}

function makeComputerMove() {
  if (!gameActive) return;

  let move = getSmartMove();
  makeMove(move, 'O');

  if (checkEnd()) return;

  currentPlayer = 'X';
  statusText.textContent = `Player X's Turn`;
}

function checkEnd() {
  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return true;
  }

  if (!cells.includes('')) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function checkWin() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return wins.some(([a,b,c]) => {
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function getSmartMove() {
  const empty = cells.map((val, idx) => val === '' ? idx : null).filter(i => i !== null);

  for (let i of empty) {
    cells[i] = 'O';
    if (checkWin()) {
      cells[i] = '';
      return i;
    }
    cells[i] = '';
  }

  for (let i of empty) {
    cells[i] = 'X';
    if (checkWin()) {
      cells[i] = '';
      return i;
    }
    cells[i] = '';
  }

  if (empty.includes(4)) return 4;

  const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  return empty[Math.floor(Math.random() * empty.length)];
}
