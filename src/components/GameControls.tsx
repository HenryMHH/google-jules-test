import React from 'react';

interface GameControlsProps {
  onReset: () => void;
  onStart: () => void;
  isPathfinding?: boolean; // Optional: to disable Start button while pathfinding
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onStart, isPathfinding }) => {
  return (
    <div className="flex space-x-4 my-4">
      <button
        onClick={onReset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Reset Maze
      </button>
      <button
        onClick={onStart}
        disabled={isPathfinding}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
      >
        {isPathfinding ? 'Finding Path...' : 'Start Pathfinding'}
      </button>
    </div>
  );
};

export default GameControls;
