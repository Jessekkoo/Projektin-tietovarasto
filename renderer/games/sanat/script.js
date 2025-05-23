const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const lettersContainer = document.getElementById('lettersContainer');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverPopup = document.getElementById('gameOverPopup');

let score = 0;
let round = 1;
let placedLetters = [];
let currentLetters = [];
let targetWord = '';
let shapePoints = [];

const validWords = new Set([
  'ALU', 'EKA', 'HYI', 'ILO', 'JAA', 'KUU', 'LIS', 'MAA', 'NEN', 'OKA',
  'SAA', 'SYÖ', 'TIE', 'UUS', 'VAI', 'YÖN', 'ÄLÄ', 'ÖIN', 'KÄY', 'NÄE',
  'ALUE', 'EHTO', 'HALU', 'ILMA', 'JOKA', 'KALA', 'LIHA', 'MENO', 'NIMI', 'OHUT',
  'AAMU', 'HYVÄ', 'IÄNÄ', 'JÄRÄ', 'KIRJA', 'KOTI', 'KUIN', 'METSÄ', 'PÄIVÄ', 'TULI',
  'AUKI', 'ELÄÄ', 'HINTA', 'JALKA', 'KÄSI', 'LUODA', 'MIES', 'NOPEA', 'OMAAN', 'SIJA',
  'ALOHA', 'ELAIN', 'HALKE', 'ILMOI', 'KALMA', 'LIHAS', 'MENOT', 'NIMET', 'OHUUS',
  'AIKAA', 'ARVOA', 'ELÄMÄ', 'HAUSKA', 'IHANA', 'JÄRVI', 'KAUPPA', 'KIITOS', 'KULTA', 'LUKUJA',
  'MAKSAA', 'NAINEN', 'OLUTTA', 'PAIKKA', 'PUHEEN', 'RAKAS', 'SUOMI', 'TARKKA', 'UUTTA', 'VÄRIÄ',
  'ALOITE', 'ELAINA', 'HALKEA', 'ILMOJA', 'JALKAA', 'KALMAN', 'LIHAKS', 'MENTYA', 'NIMETA', 'OHUETA',
  'AAMUJA', 'ARVOKAS', 'ELÄMÄÄ', 'HAUSKAA', 'IHANAA', 'JÄRVEN', 'KAUPAN', 'KIITOKS', 'KULTAA', 'LUKUJEN'
]);

function drawStar() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const outerRadius = 150;
  const innerRadius = 75;
  const spikes = 5;

  ctx.beginPath();
  ctx.fillStyle = '#111';
  ctx.strokeStyle = '#0ff';
  ctx.lineWidth = 3;

  shapePoints = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    shapePoints.push({ x, y });
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function isPointInStar(x, y) {
  let inside = false;
  for (let i = 0, j = shapePoints.length - 1; i < shapePoints.length; j = i++) {
    const xi = shapePoints[i].x, yi = shapePoints[i].y;
    const xj = shapePoints[j].x, yj = shapePoints[j].y;
    const intersect = ((yi > y) !== (yj > y)) &&
                     (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function generateLetters() {
  const minWordLength = Math.min(3 + Math.floor(round / 5), 6);
  const validWordsArray = Array.from(validWords).filter(word => word.length >= minWordLength);
  targetWord = validWordsArray[Math.floor(Math.random() * validWordsArray.length)];
  currentLetters = targetWord.split('').sort(() => Math.random() - 0.5);
  console.log('New round:', round, 'Target word:', targetWord, 'Letters:', currentLetters);
  createLetterElements();
}

function createLetterElements() {
  lettersContainer.innerHTML = '';
  currentLetters.forEach((letter, index) => {
    const div = document.createElement('div');
    div.className = 'letter';
    div.textContent = letter;
    div.draggable = true;
    div.dataset.letter = letter;
    div.dataset.index = index;
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ letter, index }));
      div.style.opacity = '0.5';
    });
    div.addEventListener('dragend', () => {
      div.style.opacity = '1';
    });
    lettersContainer.appendChild(div);
  });
}

function checkWord(word) {
  console.log('Checking word:', word, 'against target:', targetWord);
  return word === targetWord;
}

function canFormTargetWord(placed, remaining) {
  const allLetters = [...placed.map(l => l.letter), ...remaining];
  const targetLetters = targetWord.split('');
  return targetLetters.every(char => allLetters.includes(char));
}

function validateWord() {
  const word = placedLetters.map(l => l.letter).join('');
  console.log('Validating word:', word);
  if (word.length >= 3) {
    if (checkWord(word)) {
      score += word.length * 10;
      scoreElement.textContent = score;
      placedLetters = [];
      round++;
      generateLetters();
      drawLetters();
    } else {
      console.log('Invalid word:', word);
      showGameOver();
    }
  } else {
    console.log('Game Over: Incomplete word', word);
    showGameOver();
  }
}

canvas.addEventListener('dragover', (e) => {
  e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const { letter, index } = data;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isPointInStar(x, y)) {
    placedLetters.push({ letter, x, y });
    currentLetters.splice(index, 1);
    console.log('Placed letter:', letter, 'Remaining letters:', currentLetters);
    createLetterElements();
    drawLetters();
    if (currentLetters.length === 0) {
      validateWord(); 
    }
  }
});

function drawLetters() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStar();
  ctx.fillStyle = '#0ff';
  ctx.font = '24px Segoe UI';
  placedLetters.forEach(({ letter, x, y }) => {
    ctx.fillText(letter, x - 10, y + 10);
  });
}

function showGameOver() {
  finalScoreElement.textContent = score;
  gameOverPopup.classList.remove('hidden');
}

function restartGame() {
  score = 0;
  round = 1;
  scoreElement.textContent = '0';
  placedLetters = [];
  currentLetters = [];
  targetWord = '';
  generateLetters();
  drawLetters();
  gameOverPopup.classList.add('hidden');
}

function goBack() {
  window.location.href = '../../index.html';
}

function init() {
  drawStar();
  generateLetters();
  drawLetters();
}

init();