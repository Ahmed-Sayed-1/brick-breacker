import { initializeContainers } from "./script.js";
import { Block } from "./Block.js";
import { Ball } from "./Ball.js";
import { Paddle } from "./Paddle.js";
const canvas = document.querySelector('.game-canvas');
export const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;  
canvas.height = canvas.offsetHeight;
const gameWidth = canvas.width;
console.log(gameWidth);
export const blockWidth = 100; 
export const blockHeight = 50;
let blocks = initializeContainers(gameWidth, blockWidth, blockHeight);
document.addEventListener("mousemove", moveMouse);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

export const gameHeight = canvas.height;
console.log(gameHeight)
const ball = new Ball(gameWidth / 2, gameHeight - 30, 7.5)

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const block = new Block();

console.log(blocks);
const gameBorder = {
  left: 0,
  bottom: 0,
  top: gameHeight,
  right: gameWidth,
};

const paddle = new Paddle(
  20,
  gameBorder.right * 0.15,
  (gameBorder.right - gameBorder.right * 0.15) / 2
);
let xDirection = 1;
let yDirection = -1;
let rightPressed = false;
let leftPressed = false;

function moveMouse(e) {
  if (
    e.clientX >= gameBorder.left &&
    e.clientX <= gameWidth - paddle.width &&
    e.clientY >= gameBorder.bottom &&
    e.clientY <= gameHeight
  ) {
    paddle.position = e.clientX;
  } else if (e.clientX > gameWidth - paddle.width) {
    paddle.position = gameWidth - paddle.width;
  }
}

function handleDirection() {
  if (
    ball.x + xDirection > gameWidth - ball.ballRadius ||
    ball.x + xDirection < ball.ballRadius
  ) {
    xDirection = -xDirection;
  }

  if (ball.y + yDirection < ball.ballRadius) {
    yDirection = -yDirection;
  }

  if (
    ball.y > gameHeight - ball.ballRadius - paddle.height &&
    ball.y < gameHeight - paddle.height &&
    ball.x > paddle.position &&
    ball.x < paddle.position + paddle.width
  ) {
    ball.y = gameHeight - ball.ballRadius - paddle.height;
    let newX = ball.x - (paddle.position + paddle.width / 2);
    let Intersect = newX / (paddle.width / 2);
    let Angle = Intersect * (Math.PI / 3);

    xDirection = Math.sin(Angle);
    yDirection = -Math.cos(Angle);
  }

  blockCollisions();

  let speed = 2;
  ball.x += xDirection * speed;
  ball.y += yDirection * speed;
}

function blockCollisions() {
  blocks.forEach((block) => {
    if (
      block.visible &&
      ball.x + ball.ballRadius > block.x &&
      ball.x - ball.ballRadius < block.x + Block.blockWidth &&
      ball.y + ball.ballRadius > block.y &&
      ball.y - ball.ballRadius < block.y + Block.blockHeight
    ) {
      let hitFromLeft = ball.x - ball.ballRadius < block.x;
      let hitFromRight = ball.x + ball.ballRadius > block.x + Block.blockWidth;
      let hitFromTop = ball.y - ball.ballRadius < block.y;
      let hitFromBottom =
        ball.y + ball.ballRadius > block.y + Block.blockHeight;

      if (hitFromLeft || hitFromRight) {
        xDirection = -xDirection;
      }
      if (hitFromTop || hitFromBottom) {
        yDirection = -yDirection;
      }
      if (!block.cracked)
      {
        block.cracked=true;
      }
        block.visible--;
      
      removeBlock();
    }
  });
}
function removeBlock() {
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].visible == 0) {
      blocks.splice(i, 1);
    }
  }
}



function draw() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  ball.drawBall(ctx);
  paddle.drawPaddle(ctx);
  block.drawBlocks(blocks, ctx);
  handleDirection();
  if (rightPressed && paddle.position < gameWidth - paddle.width) {
    paddle.position += 7;
  } else if (leftPressed && paddle.position > 0) {
    paddle.position -= 7;
  }
}

function startGame() {
  function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function keyDownHandler(e) {
  if (e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

document.getElementById("runButton").addEventListener("click", function () {
  startGame();
  this.disabled = true;
});
