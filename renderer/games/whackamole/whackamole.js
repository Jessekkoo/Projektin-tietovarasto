const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const whackSound = new Audio('../../sound/hit.mp3');

let holes = [];
let activeMole = null;
let score = 0;
let gameInterval;
let moleSpeed = 1000;  
let moleSpeedDecrement = 20; 


function createBoard() {
  board.innerHTML = ''; 
  holes = [];

  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.dataset.index = i;
    hole.addEventListener('click', whack);
    board.appendChild(hole);
    holes.push(hole);
  }
}

function startGame() {
  score = 0;
  updateScore();
  moleSpeed = 1000;
  createBoard();

  clearInterval(gameInterval);  
  gameInterval = setInterval(showMole, moleSpeed);  
}


function showMole() {
  if (activeMole !== null) {
    holes[activeMole].innerHTML = '';  
  }

  const index = Math.floor(Math.random() * holes.length);
  activeMole = index;

  const mole = document.createElement('div');
  mole.className = 'mole';
  mole.textContent = '🐹'; 

  holes[index].appendChild(mole);  

  
  if (score % 3 === 0 && moleSpeed > 500) {
    moleSpeed -= moleSpeedDecrement;  
    clearInterval(gameInterval);
    gameInterval = setInterval(showMole, moleSpeed); 
  }
}

function whack(e) {
  const index = e.currentTarget.dataset.index;

  if (Number(index) === activeMole) {
    score++;
    updateScore();
    holes[activeMole].innerHTML = ''; 
    activeMole = null;
    whackSound.play();
  }
}

function updateScore() {
  scoreEl.textContent = score;
}

function goBack() {
  window.location.href = '../../index.html'; 
}

startBtn.onclick = startGame;
