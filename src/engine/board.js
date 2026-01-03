export default class Board {
  constructor(size, iscloned) {
    this.iscloned = iscloned ?? false;
    this.size = size ?? 4;
    this.grid = this.#createNewGrid();
    if (!this.iscloned) {
      this.#spawnNewTile();
      this.#spawnNewTile();
    }
  }

  #createNewGrid() {
    let grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => 0));
    return grid;
  }

  transpose() {
    let nBoard = this.clone();
    for (let y = 0; y < this.size; y++) {
      for (let x = y + 1; x < this.size; x++) {
        [nBoard.grid[y][x], nBoard.grid[x][y]] = [nBoard.grid[x][y], nBoard.grid[y][x]];
      }
    }
    return nBoard;
  }

  reverse() {
    let nBoard = this.clone();
    for (let y = 0; y < this.size; y++) {
      nBoard.grid[y].reverse();
    }
    return nBoard;
  }

  #spawnNewTile() {
    let emptyCells = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.grid[y][x] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.setCell(x, y, Math.random() < 0.9 ? 2 : 4);
    }
  }

  clone() {
    const newBoard = new Board(this.size, true);
    newBoard.grid = this.grid.map((row) => row.slice());
    return newBoard;
  }

  getCell(x, y) {
    return this.grid[y][x];
  }

  setCell(x, y, value) {
    this.grid[y][x] = value;
  }

  move(direction) {
    if (this.over) return;

    this.moved = false;

    let nBoard = this.clone();

    if (direction === 'up') {
      nBoard = nBoard.transpose().mergeRows().transpose();
    } else if (direction === 'down') {
      nBoard = nBoard.transpose().reverse().mergeRows().reverse().transpose();
    } else if (direction === 'right') {
      nBoard = nBoard.reverse().mergeRows().reverse();
    } else if (direction === 'left') {
      nBoard = nBoard.mergeRows();
    }

    this.grid = nBoard.grid;
  }

  mergeRows() {
    let nBoard = this.clone();

    for (let y = 0; y < this.size; y++) {
      let row = nBoard.grid[y].filter((val) => val !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          row[i + 1] = 0;
        }
      }
      row = row.filter((val) => val !== 0);
      while (row.length < this.size) {
        row.push(0);
      }

      nBoard.grid[y] = row;
    }

    return nBoard;
  }
}
