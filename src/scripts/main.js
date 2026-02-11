(function () {
  'use strict';

  const size = 4;

  const game = {
    state: Array.from({ length: size }, () => Array(size).fill(0)),
    score: 0,
    status: 'idle',
  };

  const scoreEl = document.querySelector('.game-score');
  const startBtn = document.querySelector('.button.start');
  const boardEl = document.querySelector('.game-field');

  // ================== Логіка ==================

  function createEmptyBoard() {
    return Array.from({ length: size }, () => Array(size).fill(0));
  }

  function addRandomTile() {
    const empty = [];

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        if (game.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    game.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function moveLeft() {
    move((row) => row);
  }

  function moveRight() {
    move((row) => row.slice().reverse(), true);
  }

  function moveUp() {
    transpose();
    move((row) => row);
    transpose();
  }

  function moveDown() {
    transpose();
    move((row) => row.slice().reverse(), true);
    transpose();
  }

  function move(transformRow, reverseBack = false) {
    if (game.status !== 'playing') {
      return;
    }

    let moved = false;
    const newBoard = [];

    for (let i = 0; i < size; i += 1) {
      const row = transformRow(game.state[i]);
      const merged = mergeRow(row);

      game.score += merged.score;

      if (!rowsEqual(game.state[i], merged.row)) {
        moved = true;
      }
      newBoard.push(reverseBack ? merged.row.reverse() : merged.row);
    }

    if (!moved) {
      return;
    }

    game.state = newBoard;
    addRandomTile();

    if (has2048()) {
      game.status = 'win';
    } else if (!hasMoves()) {
      game.status = 'lose';
    }
  }

  function mergeRow(row) {
    const filtered = row.filter((n) => n !== 0);
    const result = [];
    let score = 0;

    for (let i = 0; i < filtered.length; i += 1) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        result.push(value);
        score += value;
        i += 1;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < size) {
      result.push(0);
    }

    return { row: result, score };
  }

  function rowsEqual(a, b) {
    return a.every((val, idx) => val === b[idx]);
  }

  function transpose() {
    const newBoard = createEmptyBoard();

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        newBoard[i][j] = game.state[j][i];
      }
    }
    game.state = newBoard;
  }

  function has2048() {
    return game.state.some((row) => row.includes(2048));
  }

  function hasMoves() {
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        const val = game.state[i][j];

        if (val === 0) {
          return true;
        }

        if (i < size - 1 && val === game.state[i + 1][j]) {
          return true;
        }

        if (j < size - 1 && val === game.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  // ================== Рендер ==================

  function render() {
    const rows = boardEl.querySelectorAll('.field-row');

    for (let i = 0; i < size; i += 1) {
      const cells = rows[i].querySelectorAll('.field-cell');

      for (let j = 0; j < size; j += 1) {
        const cell = cells[j];
        const val = game.state[i][j];

        cell.textContent = val === 0 ? '' : val;
        cell.className = 'field-cell';

        if (val !== 0) {
          cell.classList.add(`field-cell--${val}`);
        }
      }
    }
    scoreEl.textContent = game.score;
    updateStatus();
  }

  function updateStatus() {
    const winMsg = document.querySelector('.message-win');
    const loseMsg = document.querySelector('.message-lose');

    winMsg.classList.toggle('hidden', game.status !== 'win');
    loseMsg.classList.toggle('hidden', game.status !== 'lose');
  }

  // ================== Події ==================

  startBtn.addEventListener('click', () => {
    if (game.status === 'idle') {
      game.status = 'playing';
      game.state = createEmptyBoard();
      game.score = 0;
      addRandomTile();
      addRandomTile();
      startBtn.textContent = 'Restart';
      startBtn.classList.add('restart'); // <-- додаємо клас для Cypress
    } else {
      game.status = 'idle';
      game.state = createEmptyBoard();
      game.score = 0;
      startBtn.textContent = 'Start';
      startBtn.classList.remove('restart'); // <-- видаляємо клас
    }
    render();
  });

  document.addEventListener('keydown', (evt) => {
    if (game.status !== 'playing') {
      return;
    }

    if (evt.key === 'ArrowLeft') {
      moveLeft();
    }

    if (evt.key === 'ArrowRight') {
      moveRight();
    }

    if (evt.key === 'ArrowUp') {
      moveUp();
    }

    if (evt.key === 'ArrowDown') {
      moveDown();
    }

    render();
  });
})();
