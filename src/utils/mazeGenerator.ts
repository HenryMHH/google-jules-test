export interface Cell {
  isWall: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  visited?: boolean; // For DFS generation
  x: number;
  y: number;
}

export type Maze = Cell[][];

export const MAZE_WIDTH = 20;
export const MAZE_HEIGHT = 20;

// Helper function to get unvisited neighbors
const getUnvisitedNeighbors = (cell: Cell, grid: Maze): Cell[] => {
  const neighbors: Cell[] = [];
  const { x, y } = cell;

  // Top
  if (y > 1 && !grid[y - 2][x].visited) {
    neighbors.push(grid[y - 2][x]);
  }
  // Right
  if (x < MAZE_WIDTH - 2 && !grid[y][x + 2].visited) {
    neighbors.push(grid[y][x + 2]);
  }
  // Bottom
  if (y < MAZE_HEIGHT - 2 && !grid[y + 2][x].visited) {
    neighbors.push(grid[y + 2][x]);
  }
  // Left
  if (x > 1 && !grid[y][x - 2].visited) {
    neighbors.push(grid[y][x - 2]);
  }
  return neighbors;
};

export const generateMaze = (width: number, height: number): Maze => {
  // 1. Initialize grid with all walls
  const maze: Maze = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      isWall: true,
      visited: false, // Initially all cells (including walls) are unvisited for carving
    }))
  );

  // 2. Pick a starting cell for DFS path carving (must be a cell that can be a path, e.g., odd coordinates)
  // Let's ensure the start for carving is not a border wall that will become entrance/exit
  const startX = 1;
  const startY = 1;
  let currentCell = maze[startY][startX];
  currentCell.isWall = false;
  currentCell.visited = true;

  const stack: Cell[] = [currentCell];

  // 3. While stack is not empty:
  while (stack.length > 0) {
    currentCell = stack.pop()!; // currentCell is now the cell to explore from

    const neighbors = getUnvisitedNeighbors(currentCell, maze);

    // b. Find unvisited neighbors (that can become paths)
    const unvisitedPathNeighbors: Cell[] = [];
    if (currentCell.y > 1 && maze[currentCell.y - 2][currentCell.x].isWall && !maze[currentCell.y - 2][currentCell.x].visited) {
        unvisitedPathNeighbors.push(maze[currentCell.y - 2][currentCell.x]);
    }
    if (currentCell.x < width - 2 && maze[currentCell.y][currentCell.x + 2].isWall && !maze[currentCell.y][currentCell.x + 2].visited) {
        unvisitedPathNeighbors.push(maze[currentCell.y][currentCell.x + 2]);
    }
    if (currentCell.y < height - 2 && maze[currentCell.y + 2][currentCell.x].isWall && !maze[currentCell.y + 2][currentCell.x].visited) {
        unvisitedPathNeighbors.push(maze[currentCell.y + 2][currentCell.x]);
    }
    if (currentCell.x > 1 && maze[currentCell.y][currentCell.x - 2].isWall && !maze[currentCell.y][currentCell.x - 2].visited) {
        unvisitedPathNeighbors.push(maze[currentCell.y][currentCell.x - 2]);
    }


    // c. If unvisited neighbors exist:
    if (unvisitedPathNeighbors.length > 0) {
      // i. Push current cell to stack
      stack.push(currentCell);

      // ii. Choose one unvisited neighbor randomly
      const chosenNeighbor = unvisitedPathNeighbors[Math.floor(Math.random() * unvisitedPathNeighbors.length)];

      // iii. Remove wall between current cell and chosen neighbor
      // The "wall" is the cell between currentCell and chosenNeighbor
      const wallX = currentCell.x + (chosenNeighbor.x - currentCell.x) / 2;
      const wallY = currentCell.y + (chosenNeighbor.y - currentCell.y) / 2;
      maze[wallY][wallX].isWall = false;
      maze[wallY][wallX].visited = true; // Mark the removed wall cell as visited too

      // iv. Mark chosen neighbor as visited, make it path, push to stack
      chosenNeighbor.isWall = false;
      chosenNeighbor.visited = true;
      stack.push(chosenNeighbor);
    }
  }

  // Reset visited flags for any future pathfinding algorithms
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze[y][x].visited = false;
    }
  }

  // 4. Designate start and end points
  // Ensure entrance is at the top (0,1) and exit is at the bottom (height-1, width-2)
  // These must be paths.
  maze[0][1].isWall = false; // Entrance path
  maze[0][1].isStart = true;
  // Carve path from entrance to the first inner path cell if it's a wall
  if (maze[1][1].isWall) maze[1][1].isWall = false;


  maze[height - 1][width - 2].isWall = false; // Exit path
  maze[height - 1][width - 2].isEnd = true;
  // Carve path from exit to the last inner path cell if it's a wall
  if (maze[height - 2][width - 2].isWall) maze[height - 2][width - 2].isWall = false;


  return maze;
};
