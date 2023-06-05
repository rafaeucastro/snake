// Tamanho do jogo
const BOARD_SIZE = 20;
const TILE_SIZE = 20;

// Elementos do jogo
let gameBoard;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;

// Funções
function startGame() {
  gameBoard = document.getElementById("game-board");
  document.addEventListener("keydown", changeDirection);
  setInterval(updateGame, 100);
}

function updateGame() {
  moveSnake();

  if (checkCollision()) {
    clearScore();
    endGame();
  } else {
    clearBoard();
    drawSnake();
    drawFood();
  }
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    generateFood();
    incrementScore();
  } else {
    snake.pop();
  }
}

function updateScore() {
  var placar = document.getElementById("score");
  placar.innerHTML = "Score: " + score.toString();
}

function incrementScore() {
  score = score + 1;
  updateScore();
}

function clearScore() {
  score = 0;
  updateScore();
}

function checkCollision() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= BOARD_SIZE ||
    head.y < 0 ||
    head.y >= BOARD_SIZE ||
    snake.slice(1).some((part) => part.x === head.x && part.y === head.y)
  ) {
    return true;
  }
  return false;
}

function endGame() {
  alert("Game over!");
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
}

function clearBoard() {
  while (gameBoard.firstChild) {
    gameBoard.firstChild.remove();
  }
}

function drawSnake() {
  snake.forEach((part) => {
    const snakePart = createPartElement(part.x, part.y, "snake-part");
    gameBoard.appendChild(snakePart);
  });
}

function drawFood() {
  const foodElement = createPartElement(food.x, food.y, "food");
  gameBoard.appendChild(foodElement);
}

function generateFood() {
  food.x = Math.floor(Math.random() * BOARD_SIZE);
  food.y = Math.floor(Math.random() * BOARD_SIZE);

  if (snake.some((part) => part.x === food.x && part.y === food.y)) {
    generateFood();
  }
}

function createPartElement(x, y, className) {
  const part = document.createElement("div");
  part.className = className;
  part.style.left = x * TILE_SIZE + "px";
  part.style.top = y * TILE_SIZE + "px";
  return part;
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;

  const isMovingUp = dy === -1;
  const isMovingDown = dy === 1;
  const isMovingLeft = dx === -1;
  const isMovingRight = dx === 1;
  
  if (keyPressed === LEFT_KEY && !isMovingRight) {
    dx = -1;
    dy = 0;
  } else if (keyPressed === UP_KEY && !isMovingDown) {
    dx = 0;
    dy = -1;
  } else if (keyPressed === RIGHT_KEY && !isMovingLeft) {
    dx = 1;
    dy = 0;
  } else if (keyPressed === DOWN_KEY && !isMovingUp) {
    dx = 0;
    dy = 1;
  }
}
startGame();