const correctSound = new Audio('../../sound/correct.wav');
const gameOverSound = new Audio('../../sound/gameover.wav');
let score = 0;
let correctAnswer = 0;
let timer;
let countdownTimer;
let countdownValue;
let timeLimit = 6; 

function startGame() {
  score = 0;
  document.getElementById('score').textContent = score;
  document.getElementById('gameOverPopup').classList.add('hidden');
  nextQuestion();
}

function nextQuestion() {
  clearTimeout(timer);
  clearInterval(countdownTimer);

  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
  let questionText = `${num1} ${operator} ${num2}`;
  
  if (operator === '+') correctAnswer = num1 + num2;
  else if (operator === '-') correctAnswer = num1 - num2;
  else if (operator === '*') correctAnswer = num1 * num2;

  document.getElementById('question').textContent = questionText;

  let answers = [correctAnswer];
  while (answers.length < 4) {
    let fakeAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
    if (!answers.includes(fakeAnswer)) {
      answers.push(fakeAnswer);
    }
  }

  answers.sort(() => Math.random() - 0.5);

  const buttons = document.querySelectorAll('.options button');
  buttons.forEach((button, index) => {
    button.textContent = answers[index];
  });

  timer = setTimeout(gameOver, timeLimit * 1000);

  countdownValue = timeLimit;
  document.getElementById('countdown').textContent = countdownValue;
  countdownTimer = setInterval(() => {
    countdownValue--;
    document.getElementById('countdown').textContent = countdownValue;
    if (countdownValue <= 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
}

function checkAnswer(index) {
  const selectedAnswer = parseInt(document.querySelectorAll('.options button')[index].textContent);
  if (selectedAnswer === correctAnswer) {
    correctSound.currentTime = 0;
    correctSound.play();
    score++;
    document.getElementById('score').textContent = score;
    nextQuestion();
  } else {
    gameOver();
  }
}

function gameOver() {
  clearTimeout(timer);
  clearInterval(countdownTimer);
  gameOverSound.currentTime = 0;
  gameOverSound.play();
  document.getElementById('finalScore').textContent = score;
  document.getElementById('gameOverPopup').classList.remove('hidden');
}

function restartGame() {
  startGame();
}

function goBack() {
  window.history.back();
}

startGame();
