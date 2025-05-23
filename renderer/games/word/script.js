const finnishWords = [
  "omena", "kirja", "koulu", "metsä", "järvi",
  "taivas", "sähkö", "leipä", "valo", "ystävä",
  "kello", "juna", "silta", "kevät", "pimeä"
];

const correctSound = new Audio('../../sound/correct.mp3');
const incorrectSound = new Audio('../../sound/incorrect.mp3');
const winSound = new Audio('../../sound/win.mp3');

const gridSize = 15;
let selectedWords = [];
let grid = [];
let isMouseDown = false;
let selectedCells = [];
let direction = null;

function generateGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";
  selectedWords = getRandomWords(5);
  grid = Array(gridSize).fill().map(() => Array(gridSize).fill(""));

  selectedWords.forEach(word => placeWord(grid, word));

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!grid[y][x]) {
        grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[y][x];
      cell.dataset.x = x;
      cell.dataset.y = y;
      gridElement.appendChild(cell);
    }
  }

  const list = document.getElementById("wordList");
  list.innerHTML = selectedWords.map(w => `<li>${w.toUpperCase()}</li>`).join("");

  setupInteraction();
}

function getRandomWords(count) {
  const copy = [...finnishWords];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function placeWord(grid, word) {
  const directions = ["H", "V"];
  const tries = 100;
  for (let i = 0; i < tries; i++) {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let x = Math.floor(Math.random() * gridSize);
    let y = Math.floor(Math.random() * gridSize);

    if (dir === "H" && x + word.length <= gridSize) {
      if (canPlace(grid, word, x, y, 1, 0)) {
        for (let i = 0; i < word.length; i++) grid[y][x + i] = word[i].toUpperCase();
        return;
      }
    } else if (dir === "V" && y + word.length <= gridSize) {
      if (canPlace(grid, word, x, y, 0, 1)) {
        for (let i = 0; i < word.length; i++) grid[y + i][x] = word[i].toUpperCase();
        return;
      }
    }
  }
}

function canPlace(grid, word, x, y, dx, dy) {
  for (let i = 0; i < word.length; i++) {
    const letter = grid[y + i * dy][x + i * dx];
    if (letter && letter !== word[i].toUpperCase()) return false;
  }
  return true;
}

function setupInteraction() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.addEventListener("mousedown", () => {
      isMouseDown = true;
      clearSelection();
      selectCell(cell);
    });

    cell.addEventListener("mouseenter", () => {
      if (isMouseDown) selectCell(cell);
    });
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
    checkSelectedWord();
  });

  document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains("cell")) {
      isMouseDown = true;
      clearSelection();
      selectCell(target);
    }
  });

  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (isMouseDown && target && target.classList.contains("cell")) {
      selectCell(target);
    }
  });

  document.addEventListener("touchend", () => {
    isMouseDown = false;
    checkSelectedWord();
  });
}

function selectCell(cell) {
  if (selectedCells.includes(cell)) return;

  if (cell.classList.contains("found")) {
    cell.classList.add("flash");
    setTimeout(() => cell.classList.remove("flash"), 300);
    return;
  }

  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  if (selectedCells.length === 0) {
    selectedCells.push(cell);
    cell.classList.add("selected");
    return;
  }

  if (selectedCells.length === 1) {
    const first = selectedCells[0];
    const x1 = parseInt(first.dataset.x);
    const y1 = parseInt(first.dataset.y);

    direction = { dx: x - x1, dy: y - y1 };

    if (!isValidDirection(direction.dx, direction.dy)) return;

    selectedCells.push(cell);
    cell.classList.add("selected");
    return;
  }

  const last = selectedCells[selectedCells.length - 1];
  const lastX = parseInt(last.dataset.x);
  const lastY = parseInt(last.dataset.y);

  const dx = x - lastX;
  const dy = y - lastY;

  if (dx !== direction.dx || dy !== direction.dy) return;

  selectedCells.push(cell);
  cell.classList.add("selected");
}

function isValidDirection(dx, dy) {
  const valid = [-1, 0, 1];
  return valid.includes(dx) && valid.includes(dy) && !(dx === 0 && dy === 0);
}

function clearSelection() {
  selectedCells.forEach(c => c.classList.remove("selected"));
  selectedCells = [];
  direction = null;
}

function checkSelectedWord() {
  const word = selectedCells.map(c => c.textContent).join("").toLowerCase();
  if (selectedWords.includes(word)) {
    selectedCells.forEach(c => {
      c.classList.remove("selected");
      c.classList.add("found");
    });

    const listItems = document.querySelectorAll("#wordList li");
    listItems.forEach(li => {
      if (li.textContent.toLowerCase() === word) {
        li.style.textDecoration = "line-through";
        li.style.color = "lime";
      }
    });

    // Play correct sound when the word is found
    correctSound.play();

    // Check if all words are found and play win sound
    if (document.querySelectorAll('.found').length === selectedWords.length) {
      winSound.play();  // Play win sound when all words are found
    }

  } else {
    // Play incorrect sound if word is incorrect
    incorrectSound.play();
    clearSelection();
  }
}

function goBack() {
  window.location.href = '../../index.html';
}

generateGrid();
