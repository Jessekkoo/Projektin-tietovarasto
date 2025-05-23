const cardsArray = [
    '💎', '💎', '👑', '👑', '✨', '✨', '❣️', '❣️',
    '⭐', '⭐', '🏰', '🏰', '🍀', '🍀', '🏆', '🏆'
];
const clickSound = new Audio('../../sound/click.mp3');
const correctSound = new Audio('../../sound/correct.mp3');
const incorrectSound = new Audio('../../sound/incorrect.mp3');
const winSound = new Audio('../../sound/win.mp3');
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let startTime = 0;
let endTime = 0;

const gameBoard = document.querySelector('.memory-game');
const gameOverPopup = document.getElementById('game-over-popup');
const timeTakenDisplay = document.getElementById('time-taken');
const popupMessage = document.getElementById('popup-message');

function shuffleCards() {
    for (let i = cardsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    
    cardsArray.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-card', card);
        cardElement.setAttribute('data-index', index);
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function startGame() {
    moves = 0;
    matchedCards = [];
    flippedCards = [];
    shuffleCards();
    createBoard();
    startTime = Date.now(); 
    gameOverPopup.style.display = 'none'; 
}

function flipCard(event) {
    const card = event.target;
    clickSound.play();
    
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    card.textContent = card.getAttribute('data-card');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute('data-card') === card2.getAttribute('data-card')) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        flippedCards = [];
        correctSound.play();

        if (matchedCards.length === cardsArray.length) {
            endTime = Date.now(); 
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);  
            setTimeout(() => showGameOverPopup(timeTaken), 500);
            winSound.play();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            incorrectSound.play();
        }, 500);  
    }
}

function showGameOverPopup(timeTaken) {
    timeTakenDisplay.textContent = timeTaken; 
    gameOverPopup.style.display = 'flex'; 
}

document.getElementById('new-game-btn').addEventListener('click', startGame);
document.getElementById('back').onclick = () => {
    window.location.href = '../../index.html';
  };
document.getElementById('new-game-popup-btn').addEventListener('click', startGame);
document.getElementById('exit-btn').addEventListener('click', () => window.location.href = '');

startGame();
