'use strict';

class Game {
  constructor() {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.state = this.createEmptyBoard();
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < this.size; i += 1) {
      const row = Array(this.size).fill(0);

      board.push(row);
    }

    return board;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => row.slice());
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.state = this.createEmptyBoard();
  }

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => row.slice().reverse(), true);
  }

  moveUp() {
    this.transpose();
    this.move((row) => row);
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.move((row) => row.slice().reverse(), true);
    this.transpose();
  }

  move(transformRow, reverseBack = false) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const newBoard = [];

    for (let i = 0; i < this.size; i += 1) {
      const originalRow = this.state[i];
      const workingRow = transformRow(originalRow);
      const merged = this.mergeRow(workingRow);

      this.score += merged.score;

      if (!this.rowsEqual(originalRow, merged.row)) {
        moved = true;
      }

      newBoard.push(reverseBack ? merged.row.reverse() : merged.row);
    }

    if (!moved) {
      return;
    }

    this.state = newBoard;
    this.addRandomTile();

    if (this.has2048()) {
      this.status = 'win';
    } else if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  mergeRow(row) {
    const filtered = row.filter((n) => n !== 0);
    const result = [];
    let gained = 0;

    for (let i = 0; i < filtered.length; i += 1) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        result.push(value);
        gained += value;
        i += 1;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return { row: result, score: gained };
  }

  rowsEqual(a, b) {
    return a.every((val, idx) => val === b[idx]);
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        newBoard[i][j] = this.state[j][i];
      }
    }
    this.state = newBoard;
  }

  has2048() {
    return this.state.some((row) => row.includes(2048));
  }

  hasMoves() {
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        const value = this.state[i][j];

        if (value === 0) {
          return true;
        }

        if (i < this.size - 1 && value === this.state[i + 1][j]) {
          return true;
        }

        if (j < this.size - 1 && value === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

// робимо Game глобально доступним
window.Game = Game;
