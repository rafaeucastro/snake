// Tamanho do jogo
const BOARD_SIZE = 20;
const TILE_SIZE = 20;

// Elementos do jogo
let gameBoard;
let gameLoop;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;
let level = 1;
var speed = 100;

let obstacles = [];
let numberOfObstacles = 1;
let maxObstacleHeight = 0;
let maxObstacleWidth = 0;

// Funções
function startGame() {
  gameBoard = document.getElementById("game-board");
  document.addEventListener("keydown", changeDirection);
  gameLoop = setInterval(updateGame, speed);
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
    verifyLevel();
  }
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    const obstacleElement = createPartElement(obstacle.x, obstacle.y, "obstacle");
    obstacleElement.style.width = obstacle.width * TILE_SIZE + "px";
    obstacleElement.style.height = obstacle.height * TILE_SIZE + "px";
    gameBoard.appendChild(obstacleElement);
  });
}

function generateObstacles(){
  obstacles = [];

  for(let i = 0; i < numberOfObstacles; i++) {
    const obstacle = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
      width: Math.floor(Math.random() * maxObstacleWidth) + 1,
      height: Math.floor(Math.random() * maxObstacleHeight) + 1,
    };
  
    if(snake.some((part) => part.x === obstacle.x && part.y === obstacle.y || food.x === obstacle.x && food.y === obstacle.y) ||
    food.x === obstacle.x && food.y === obstacle.y || obstacles.some((existingObstacle) => obstacle.x === existingObstacle.x && obstacle.y === existingObstacle.y)) {
      //se a posição do obstáculo coincidir com a posição da cobra ou comida, gera nova posição aleatória do obstáculo
      i--;
    } else {
      obstacles.push(obstacle);
    }
  }
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  let foodWasEaten = head.x === food.x && head.y === food.y;

  if (foodWasEaten) {
    generateFood();
    incrementScore();
    incrementSpeed();
    
    if(level >= 2){
      generateObstacles();
    }
  } else {
    snake.pop();
  }
}

function drawScore() {
  var placar = document.getElementById("score");
  placar.innerHTML = "Score: " + score.toString();
}

function drawLevel() {
  var placar = document.getElementById("level");
  placar.innerHTML = "Level: " + level.toString();
}

function updateLevel() {
  level++;
  drawLevel();
}

function verifyLevel(){
  if(level >= 2){
    drawObstacles();
  }

  switch(level) {
    case 2:
      //
      break;
    case 3:
      numberOfObstacles = 3;
      break;
    case 4:
      numberOfObstacles = 5;
      break;
    case 5:
      numberOfObstacles = 7;
    default:
      break; 
  }
}

function drawSpeed() {
  var speedElement = document.getElementById("speed");
  speedElement.innerHTML = "FPS: " + speed.toString();
}

function incrementSpeed(){
  clearInterval(gameLoop);
  speed -= 2;
  gameLoop = setInterval(updateGame, speed);

  drawSpeed();
}

function normalSpeed() {
  clearInterval(gameLoop);
  speed = 100;
  drawSpeed();
  gameLoop = setInterval(updateGame, speed);
}

function incrementScore() {
  score++;
  drawScore();

  switch(score) {
    case 2:
      updateLevel();
      break;
    case 6:
      updateLevel();
      break;
    case 10:
      updateLevel();
      break;
    default:
      break;
  } 
}

function clearScore() {
  score = 0;
  drawScore();
}

function checkCollision() {
  const head = snake[0];

  if (
    //verificar colisão da cabeça da cobra com os limites do tabuleiro
    head.x < 0 ||
    head.x >= BOARD_SIZE ||
    head.y < 0 ||
    head.y >= BOARD_SIZE ||
    //verificar colisão entre a cabeça e o corpo da própria cobra
    snake.slice(1).some((part) => part.x === head.x && part.y === head.y) ||
    //verificar colisão da cabeça da cobra com um obstáculo
    obstacles.some((obstacle) => obstacle.x === head.x && obstacle.y === head.y)
  ) {
    return true;
  }
  return false;
}

function endGame() {
  alert("Game over!");
  snake = [{ x: 10, y: 10 }];
  obstacles = [];
  dx = 0;
  dy = 0;
  score = 0;
  level = 1;
  numberOfObstacles = 1;

  drawLevel();
  normalSpeed();
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