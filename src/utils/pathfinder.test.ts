import { describe, it, expect } from 'vitest';
import { findShortestPath, Position } from './pathfinder';
import { Maze, Cell } from './mazeGenerator'; // Assuming Cell might be needed for maze construction

// Helper to create a simple maze from a string representation
const createMazeFromString = (rows: string[]): { maze: Maze, startPos: Position | null, endPos: Position | null } => {
  let startPos: Position | null = null;
  let endPos: Position | null = null;
  const height = rows.length;
  const width = rows[0].length;

  const maze: Maze = rows.map((rowStr, y) => 
    Array.from(rowStr).map((char, x) => {
      const cell: Cell = { x, y, isWall: false, isStart: false, isEnd: false };
      if (char === 'W') cell.isWall = true;
      if (char === 'S') {
        cell.isStart = true;
        startPos = { x, y };
      }
      if (char === 'E') {
        cell.isEnd = true;
        endPos = { x, y };
      }
      return cell;
    })
  );
  return { maze, startPos, endPos };
};


describe('findShortestPath', () => {
  it('should find the correct path in a simple maze', () => {
    const { maze, startPos, endPos } = createMazeFromString([
      "SPW",
      "WPW",
      "WPE"
    ]);
    // Expected path: (0,0) -> (1,0) [Blocked] -> No, path should be:
    // S P W  (0,0) (1,0) (2,0)
    // W P W  (0,1) (1,1) (2,1)
    // W P E  (0,2) (1,2) (2,2)
    // Path: S(0,0) -> P(1,0) is a wall in the example.
    // Let's correct the simple maze structure for a clear path.
    // S P W
    // S P W  ->  This should be S P W
    // S S E         W P W
    //               W P E
    // This is confusing. Let's make a very explicit simple maze:
    // S P P
    // W W P
    // E P P
    // Path: S(0,0) -> P(1,0) -> P(2,0) -> P(2,1) -> P(2,2) -> E(0,2)  NO, this is not right.
    // Let's use the pathfinder example:
    // S P W   (0,0) (1,0) (2,0)
    // W P W   (0,1) (1,1) (2,1)
    // W P E   (0,2) (1,2) (2,2)
    // Correct Path: S(0,0) is wall. Let's try:
    // P S P
    // P W P
    // P E P
    // start (1,0), end (1,2)
    // Path: (1,0) -> (0,0) -> (0,1) -> (0,2) -> (1,2)
    // Path: (1,0) -> (2,0) -> (2,1) -> (2,2) -> (1,2)
    // Path: (1,0) -> (1,1) is a wall.
    // Let's use the provided example from the prompt, assuming S is path, P is path, E is path, W is wall.
    // S P W  (S at 0,0)
    // W P W
    // W P E  (E at 2,2)
    // Expected path: S(0,0) -> P(1,0) [No, P(1,0) is path] -> P(1,1) -> P(1,2) -> E(2,2)
    // This implies start (0,0), end (2,2)
    // Path: (0,0) -> (1,0) -> (1,1) -> (1,2) -> (2,2)

    const { maze: simpleMaze, startPos: sPos, endPos: ePos } = createMazeFromString([
      "SPW", // S(0,0) P(1,0) W(2,0)
      "WPW", // W(0,1) P(1,1) W(2,1)
      "WPE"  // W(0,2) P(1,2) E(2,2)
    ]);

    if (!sPos || !ePos) throw new Error("Start/End not found in simple maze");

    const path = findShortestPath(simpleMaze, sPos, ePos);
    expect(path).toEqual([
      { x: 0, y: 0 }, // S
      { x: 1, y: 0 }, // P
      { x: 1, y: 1 }, // P
      { x: 1, y: 2 }, // P
      { x: 2, y: 2 }  // E
    ]);
  });

  it('should return null if no path exists', () => {
    const { maze, startPos, endPos } = createMazeFromString([
      "S W E",
      "W W W",
      "P P P"
    ]);
    if (!startPos || !endPos) throw new Error("Start/End not found");
    const path = findShortestPath(maze, startPos, endPos);
    expect(path).toBeNull();
  });

  it('should return null if start position is a wall', () => {
    const { maze, endPos } = createMazeFromString([
      "W P P", // Start would be W(0,0)
      "P P E",
      "P P P"
    ]);
    if (!endPos) throw new Error("End not found");
    const path = findShortestPath(maze, { x: 0, y: 0 }, endPos);
    expect(path).toBeNull();
  });

  it('should return null if end position is a wall', () => {
    const { maze, startPos } = createMazeFromString([
      "S P P",
      "P P W", // End would be W(2,1)
      "P P P"
    ]);
    if (!startPos) throw new Error("Start not found");
    const path = findShortestPath(maze, startPos, { x: 2, y: 1 });
    expect(path).toBeNull();
  });

  it('should return a path with one cell if start and end are the same and not a wall', () => {
    const { maze, startPos } = createMazeFromString([
      "S P P",
      "P P P",
      "P P P"
    ]);
    if (!startPos) throw new Error("Start not found");
    const path = findShortestPath(maze, startPos, startPos);
    expect(path).toEqual([startPos]);
  });

  it('should return null if start position is out of bounds', () => {
    const { maze, endPos } = createMazeFromString(["SPE", "WWW"]);
    if (!endPos) throw new Error("End not found");
    const path = findShortestPath(maze, { x: -1, y: 0 }, endPos);
    expect(path).toBeNull();
  });

  it('should return null if end position is out of bounds', () => {
    const { maze, startPos } = createMazeFromString(["SPE", "WWW"]);
    if (!startPos) throw new Error("Start not found");
    const path = findShortestPath(maze, startPos, { x: 10, y: 10 });
    expect(path).toBeNull();
  });

  it('should handle an empty maze gracefully', () => {
    const path = findShortestPath([], { x: 0, y: 0 }, { x: 0, y: 0 });
    expect(path).toBeNull();
  });
  
  it('should handle a maze with empty rows gracefully', () => {
    const mazeWithEmptyRow: Maze = [[]];
    const path = findShortestPath(mazeWithEmptyRow, { x: 0, y: 0 }, { x: 0, y: 0 });
    expect(path).toBeNull();
  });

  it('should find a path in a slightly more complex maze', () => {
    const { maze, startPos, endPos } = createMazeFromString([
      "S P W P",
      "P P P W",
      "W W P P",
      "P P W E"
    ]);
    if (!startPos || !endPos) throw new Error("Start/End not found");
    const path = findShortestPath(maze, startPos, endPos);
    // Path: S(0,0) -> P(1,0) -> P(1,1) -> P(2,1) -> P(2,2) -> P(3,2) -> E(3,3)
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 }
    ]);
  });
});
