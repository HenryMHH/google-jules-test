import { Maze, Cell } from './mazeGenerator';

export interface Position {
  x: number;
  y: number;
}

export interface PathNode {
  position: Position;
  parent: PathNode | null;
}

export const findShortestPath = (
  maze: Maze,
  startPos: Position,
  endPos: Position
): Position[] | null => {
  if (!maze || maze.length === 0 || maze[0].length === 0) {
    return null; // Invalid maze
  }

  const rows = maze.length;
  const cols = maze[0].length;

  // Validate start and end positions
  if (
    startPos.x < 0 || startPos.x >= cols || startPos.y < 0 || startPos.y >= rows ||
    endPos.x < 0 || endPos.x >= cols || endPos.y < 0 || endPos.y >= rows
  ) {
    console.error("Start or end position is out of bounds.");
    return null;
  }

  if (maze[startPos.y][startPos.x].isWall) {
    console.error("Start position is a wall.");
    return null;
  }
  if (maze[endPos.y][endPos.x].isWall) {
    console.error("End position is a wall.");
    return null;
  }

  const queue: PathNode[] = [];
  const visited: boolean[][] = maze.map(row => row.map(() => false));

  // 1. Enqueue the starting node. Mark as visited.
  const startNode: PathNode = { position: startPos, parent: null };
  queue.push(startNode);
  visited[startPos.y][startPos.x] = true;

  // Directions for neighbors (Up, Down, Left, Right)
  const dr = [-1, 1, 0, 0]; // Change in row
  const dc = [0, 0, -1, 1]; // Change in column

  // 2. While queue is not empty:
  while (queue.length > 0) {
    // a. Dequeue a node (current).
    const currentNode = queue.shift()!; // Non-null assertion as queue.length > 0

    // b. If current is the end position, reconstruct and return the path.
    if (currentNode.position.x === endPos.x && currentNode.position.y === endPos.y) {
      const path: Position[] = [];
      let temp: PathNode | null = currentNode;
      while (temp !== null) {
        path.unshift(temp.position); // Add to the beginning to reverse the path
        temp = temp.parent;
      }
      return path;
    }

    // c. For each neighbor of current (up, down, left, right):
    for (let i = 0; i < 4; i++) {
      const nextRow = currentNode.position.y + dr[i];
      const nextCol = currentNode.position.x + dc[i];

      // i. Check if neighbor is valid (within bounds, not a wall, not visited).
      if (
        nextRow >= 0 && nextRow < rows &&
        nextCol >= 0 && nextCol < cols &&
        !maze[nextRow][nextCol].isWall &&
        !visited[nextRow][nextCol]
      ) {
        // ii. If valid, mark as visited, create a new node with current as parent, and enqueue it.
        visited[nextRow][nextCol] = true;
        const nextNode: PathNode = {
          position: { x: nextCol, y: nextRow },
          parent: currentNode,
        };
        queue.push(nextNode);
      }
    }
  }

  // 3. If queue becomes empty and end not reached, no path exists. Return null.
  console.log("No path found.");
  return null;
};
