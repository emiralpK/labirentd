const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const size = 20;  // Size of each cell in the maze
const rows = 25;
const cols = 25;
canvas.width = size * cols;
canvas.height = size * rows;

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.walls = [true, true, true, true]; // top, right, bottom, left
  }

  draw() {
    const x = this.col * size;
    const y = this.row * size;

    ctx.strokeStyle = 'black';
    if (this.walls[0]) ctx.strokeRect(x, y, size, 0); // Top
    if (this.walls[1]) ctx.strokeRect(x + size, y, 0, size); // Right
    if (this.walls[2]) ctx.strokeRect(x, y + size, size, 0); // Bottom
    if (this.walls[3]) ctx.strokeRect(x, y, 0, size); // Left

    if (this.visited) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(x, y, size, size);
    }
  }
}

const grid = [];
let current;
const stack = [];

function setup() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = new Cell(row, col);
      grid.push(cell);
    }
  }
  current = grid[0];
}

function draw() {
  grid.forEach(cell => cell.draw());
}

function index(row, col) {
  if (row < 0 || col < 0 || row >= rows || col >= cols) {
    return -1;
  }
  return row * cols + col;
}

function removeWalls(a, b) {
  const x = a.col - b.col;
  const y = a.row - b.row;

  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function generateMaze() {
  current.visited = true;
  const next = getRandomNeighbor(current);

  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }

  draw();
}

function getRandomNeighbor(cell) {
  const neighbors = [];

  const top = grid[index(cell.row - 1, cell.col)];
  const right = grid[index(cell.row, cell.col + 1)];
  const bottom = grid[index(cell.row + 1, cell.col)];
  const left = grid[index(cell.row, cell.col - 1)];

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

function solveMaze() {
  // Implement maze solving logic here
  // Example: Depth First Search (DFS) or Breadth First Search (BFS)
}

document.getElementById('generateMazeBtn').addEventListener('click', () => {
  grid.forEach(cell => cell.visited = false);
  stack.length = 0;
  setup();
  const interval = setInterval(() => {
    generateMaze();
    if (stack.length === 0) clearInterval(interval);
  }, 50);
});

document.getElementById('solveMazeBtn').addEventListener('click', solveMaze);

setup();
draw();
