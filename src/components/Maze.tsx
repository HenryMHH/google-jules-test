import React from 'react';
import { Maze as MazeData, Cell } from '../utils/mazeGenerator';
import { Position } from '../utils/pathfinder'; // Import Position

interface MazeProps {
  maze: MazeData;
  solutionPath: Position[] | null; // New prop
}

const Maze: React.FC<MazeProps> = ({ maze, solutionPath }) => {
  if (!maze || maze.length === 0 || maze[0].length === 0) {
    return <div className="text-white">Loading maze...</div>; // Keep this for initial load
  }

  // Determine cell size based on maze dimensions to fit a reasonable area
  // For a 20x20 maze, a 1rem (16px) cell size might be appropriate.
  // Max width/height for the maze container can be set if needed.
  const cellSize = 'w-4 h-4'; // 1rem = 16px. For 20x20 maze => 20rem x 20rem (320px x 320px)

  return (
    <div 
      className="grid border border-gray-700 bg-gray-900" 
      style={{ 
        gridTemplateColumns: `repeat(${maze[0].length}, minmax(0, 1fr))`,
        // Optionally set a max width for the grid if cells are very small or maze very large
        // maxWidth: `${maze[0].length * 1}rem`, // Example if cell size is 1rem
      }}
    >
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          let cellClasses = `${cellSize} border-r border-b border-gray-600`; // Changed border color
          
          if (rowIndex === 0) cellClasses += ' border-t border-gray-600'; // Changed border color
          if (colIndex === 0) cellClasses += ' border-l border-gray-600'; // Changed border color

          const isSolutionCell = solutionPath?.some(p => p.x === colIndex && p.y === rowIndex);

          if (cell.isStart) {
            cellClasses += ' bg-green-500'; // Entrance
          } else if (cell.isEnd) {
            cellClasses += ' bg-red-500'; // Exit
          } else if (isSolutionCell) {
            // Path cell that is part of the solution
            cellClasses += ' bg-yellow-400'; // Solution path color
          } else if (cell.isWall) {
            cellClasses += ' bg-slate-700'; // Wall
          } else {
            cellClasses += ' bg-slate-100'; // Path (not part of solution)
          }
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClasses}
              title={`Cell (${cell.x}, ${cell.y})${cell.isWall ? ' - Wall' : ''}${cell.isStart ? ' - Start' : ''}${cell.isEnd ? ' - End' : ''}${isSolutionCell ? ' - Path' : ''}`}
            >
              {/* Optional: Render S/E markers or path dots */}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Maze;
