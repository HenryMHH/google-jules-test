import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Or remove if not used, assuming it might contain global styles or Tailwind setup imports
import { generateMaze, Maze as MazeData, MAZE_WIDTH, MAZE_HEIGHT } from './utils/mazeGenerator';
import { findShortestPath, Position } from './utils/pathfinder';
import MazeComponent from './components/Maze'; // Renamed to avoid conflict with MazeData type
import GameControls from './components/GameControls';

function App() {
  const [maze, setMaze] = useState<MazeData | null>(null);
  const [startCellPos, setStartCellPos] = useState<Position | null>(null);
  const [endCellPos, setEndCellPos] = useState<Position | null>(null);
  const [solutionPath, setSolutionPath] = useState<Position[] | null>(null);
  const [isPathfinding, setIsPathfinding] = useState(false);

  const initializeMaze = useCallback(() => {
    console.log("Initializing maze...");
    const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    setMaze(newMaze);
    setSolutionPath(null); // Clear previous solution
    setIsPathfinding(false); // Reset pathfinding state

    // Find start and end positions from the maze data
    let startPos: Position | null = null;
    let endPos: Position | null = null;
    for (let y = 0; y < newMaze.length; y++) {
      for (let x = 0; x < newMaze[y].length; x++) {
        if (newMaze[y][x].isStart) startPos = { x, y };
        if (newMaze[y][x].isEnd) endPos = { x, y };
      }
    }
    setStartCellPos(startPos);
    setEndCellPos(endPos);
    console.log("Maze initialized. Start:", startPos, "End:", endPos);
  }, []);

  useEffect(() => {
    initializeMaze();
  }, [initializeMaze]);

  const handleReset = () => {
    console.log("Resetting maze...");
    initializeMaze();
  };

  const handleStartPathfinding = () => {
    if (!maze || !startCellPos || !endCellPos) {
      console.error("Cannot start pathfinding: maze or start/end positions not set.");
      return;
    }
    if (isPathfinding) return; // Prevent multiple clicks

    console.log("Starting pathfinding...");
    setIsPathfinding(true);
    setSolutionPath(null); // Clear previous solution before finding new one


    // Using setTimeout to allow UI to update to "Finding Path..."
    // and to simulate a potentially longer process if needed.
    setTimeout(() => {
      const path = findShortestPath(maze, startCellPos, endCellPos);
      setSolutionPath(path);
      setIsPathfinding(false);
      if (path) {
        console.log("Path found:", path);
      } else {
        console.log("No path found.");
      }
    }, 50); // A small delay like 50ms is often enough for UI to re-render.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Maze Runner
        </h1>
      </header>
      
      <GameControls 
        onReset={handleReset} 
        onStart={handleStartPathfinding} 
        isPathfinding={isPathfinding} 
      />
      
      <main className="mt-4">
        {maze ? (
          <MazeComponent maze={maze} solutionPath={solutionPath} />
        ) : (
          <p className="text-xl">Loading Maze...</p>
        )}
      </main>

      <footer className="mt-8 text-sm text-gray-500">
        <p>Maze Dimensions: {MAZE_WIDTH}x{MAZE_HEIGHT}</p>
        {startCellPos && <p>Start: ({startCellPos.x}, {startCellPos.y})</p>}
        {endCellPos && <p>End: ({endCellPos.x}, {endCellPos.y})</p>}
      </footer>
    </div>
  );
}

export default App;
