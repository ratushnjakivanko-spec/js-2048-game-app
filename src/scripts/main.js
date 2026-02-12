/* global Game */
'use strict';

const game = new Game();

const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreElement.textContent = score;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

// Start game
startBtn.addEventListener('click', () => {
  game.start();

  startMessage.classList.add('hidden');
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  render();
});

// Restart game
restartBtn.addEventListener('click', () => {
  game.restart();

  scoreElement.textContent = 0;
  startMessage.classList.remove('hidden');
  startBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  render();
});

// Arrow key movement
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }
  render();
});
