class Maze {
  constructor(rows, cols, cellSize) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.grid = [];
    this.stack = [];
    this.current = null;
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(new Cell(r, c, this.cellSize));
      }
      this.grid.push(row);
    }
    this.current = this.grid[0][0];
  }

  draw(ctx) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c].draw(ctx);
      }
    }
  }

  generate(ctx) {
    this.current.visited = true;
    let next = this.current.checkNeighbors(this.grid);

    if (next) {
      next.visited = true;
      this.stack.push(this.current);
      this.removeWalls(this.current, next);
      this.current = next;
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
    }
    
    this.draw(ctx);

    if (this.stack.length > 0) {
      requestAnimationFrame(() => this.generate(ctx));
    }
  }

  removeWalls(a, b) {
    let x = a.col - b.col;
    if (x === 1) {
      a.walls.left = false;
      b.walls.right = false;
    } else if (x === -1) {
      a.walls.right = false;
      b.walls.left = false;
    }

    let y = a.row - b.row;
    if (y === 1) {
      a.walls.top = false;
      b.walls.bottom = false;
    } else if (y === -1) {
      a.walls.bottom = false;
      b.walls.top = false;
    }
  }
}

class Cell {
  constructor(row, col, size) {
    this.row = row;
    this.col = col;
    this.size = size;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    this.visited = false;
  }

  draw(ctx) {
    let x = this.col * this.size;
    let y = this.row * this.size;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    if (this.walls.top) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + this.size, y);
      ctx.stroke();
    }
    if (this.walls.right) {
      ctx.beginPath();
      ctx.moveTo(x + this.size, y);
      ctx.lineTo(x + this.size, y + this.size);
      ctx.stroke();
    }
    if (this.walls.bottom) {
      ctx.beginPath();
      ctx.moveTo(x + this.size, y + this.size);
      ctx.lineTo(x, y + this.size);
      ctx.stroke();
    }
    if (this.walls.left) {
      ctx.beginPath();
      ctx.moveTo(x, y + this.size);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (this.visited) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(x, y, this.size, this.size);
    }
  }

  checkNeighbors(grid) {
    let neighbors = [];
    let top = grid[this.row - 1] && grid[this.row - 1][this.col];
    let right = grid[this.row] && grid[this.row][this.col + 1];
    let bottom = grid[this.row + 1] && grid[this.row + 1][this.col];
    let left = grid[this.row] && grid[this.row][this.col - 1];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    } else {
      return undefined;
    }
  }
}

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 100;  // Size of each cell in the maze
const rows = 100;
const cols = 100;
canvas.width = cellSize * cols;
canvas.height = cellSize * rows;

const maze = new Maze(rows, cols, cellSize);

document.getElementById('generateMazeBtn').addEventListener('click', () => {
  maze.setup();
  maze.generate(ctx);
});

document.getElementById('solveMazeBtn').addEventListener('click', () => {
  // Maze solving logic goes here
});

maze.setup();
maze.draw(ctx);
