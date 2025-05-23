let gridSize = 5; 
let score = 0;
let pixels = [];
let selectedPixel = null;
const successSound = new Audio('../../sound/pop.mp3');
let gridContainer = document.getElementById('grid');
let scoreElement = document.getElementById('score');

function getRandomColor() {
  const colors = ['#ff33cc', '#33ccff', '#ffcc00', '#33ff33', '#ff0033', '#6600ff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createGrid() {
  gridContainer.innerHTML = '';
  pixels = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.backgroundColor = getRandomColor();
    pixel.addEventListener('click', () => selectPixel(i));
    gridContainer.appendChild(pixel);
    pixels.push(pixel);
  }
}

function selectPixel(index) {
  if (selectedPixel === null) {
    selectedPixel = index;
    pixels[index].style.transform = 'scale(1.2)';
  } else {
    if (isAdjacent(selectedPixel, index)) {
      swapPixels(selectedPixel, index);
      checkMatches();
    }
    resetSelection(); 
  }
}
function goBack() {
  window.location.href = '../../index.html';
}
function isAdjacent(index1, index2) {
  const row1 = Math.floor(index1 / gridSize);
  const col1 = index1 % gridSize;
  const row2 = Math.floor(index2 / gridSize);
  const col2 = index2 % gridSize;
  return (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);
}

function swapPixels(index1, index2) {
  let tempColor = pixels[index1].style.backgroundColor;
  pixels[index1].style.backgroundColor = pixels[index2].style.backgroundColor;
  pixels[index2].style.backgroundColor = tempColor;
}

function resetSelection() {
  if (selectedPixel !== null) {
    pixels[selectedPixel].style.transform = 'scale(1)'; 
  }
  selectedPixel = null;
}

function checkMatches() {
  let matchedIndices = [];
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - 2; col++) {
      let index = row * gridSize + col;
      let color = pixels[index].style.backgroundColor;
      if (pixels[index + 1].style.backgroundColor === color && pixels[index + 2].style.backgroundColor === color) {
        matchedIndices.push(index, index + 1, index + 2);
      }
    }
  }
  
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize - 2; row++) {
      let index = row * gridSize + col;
      let color = pixels[index].style.backgroundColor;
      if (pixels[index + gridSize].style.backgroundColor === color && pixels[index + 2 * gridSize].style.backgroundColor === color) {
        matchedIndices.push(index, index + gridSize, index + 2 * gridSize);
      }
    }
  }
  
  if (matchedIndices.length > 0) {
    matchedIndices.forEach(index => {
      pixels[index].style.backgroundColor = getRandomColor();  // Reset to new color
    });
    successSound.play();
    score += matchedIndices.length / 3;
    scoreElement.textContent = `Score: ${score}`;
    
    dropNewPixels();
  }
}

function dropNewPixels() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    if (pixels[i].style.backgroundColor === '') {
      pixels[i].style.backgroundColor = getRandomColor();
    }
  }
}

function resetGame() {
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  createGrid();
}

createGrid();
