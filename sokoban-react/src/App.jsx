import React, { useState, useEffect } from 'react';
import { Tiles, Entities, tileMap01 } from './sokobanbase';

export default function App() {
  // 1. Initialize State
  const [mapGrid, setMapGrid] = useState(() => {
    return tileMap01.mapGrid.map(row => row.map(cell => cell[0]));
  });

  const [playerPos, setPlayerPos] = useState(() => {
    for (let y = 0; y < tileMap01.mapGrid.length; y++) {
      for (let x = 0; x < tileMap01.mapGrid[y].length; x++) {
        if (tileMap01.mapGrid[y][x][0] === 'P') {
          return { x, y };
        }
      }
    }
    return { x: 11, y: 11 };
  });

  const [gameWon, setGameWon] = useState(false);

  // 2. Keyboard Input Listeners Hook
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameWon) return;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':    dy = -1; break;
        case 'ArrowDown':  dy = 1;  break;
        case 'ArrowLeft':  dx = -1; break;
        case 'ArrowRight': dx = 1;  break;
        default: return;
      }

      e.preventDefault();
      processMovement(dx, dy);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, mapGrid, gameWon]);

  // 3. Movement & Pushing Physics Engine
  const processMovement = (dx, dy) => {
    const nextPlayerX = playerPos.x + dx;
    const nextPlayerY = playerPos.y + dy;

    if (!mapGrid[nextPlayerY] || mapGrid[nextPlayerY][nextPlayerX] === undefined) return;

    const targetTile = mapGrid[nextPlayerY][nextPlayerX];

    if (targetTile === 'W') return;

    if (targetTile === 'B') {
      const boxNextX = nextPlayerX + dx;
      const boxNextY = nextPlayerY + dy;
      const blockTargetTile = mapGrid[boxNextY]?.[boxNextX];

      if (blockTargetTile === ' ' || blockTargetTile === 'G') {
        const newGrid = mapGrid.map(row => [...row]);
        newGrid[nextPlayerY][nextPlayerX] = ' '; 
        newGrid[boxNextY][boxNextX] = 'B';

        setMapGrid(newGrid);
        setPlayerPos({ x: nextPlayerX, y: nextPlayerY });
        checkWinCondition(newGrid);
      }
      return; 
    }

    setPlayerPos({ x: nextPlayerX, y: nextPlayerY });
  };

  // 4. Evaluate Victory State Matrix
  const checkWinCondition = (currentGrid) => {
    for (let y = 0; y < tileMap01.mapGrid.length; y++) {
      for (let x = 0; x < tileMap01.mapGrid[y].length; x++) {
        if (tileMap01.mapGrid[y][x][0] === 'G') {
          if (currentGrid[y][x] !== 'B') return;
        }
      }
    }
    setGameWon(true);
  };

  // 5. Reset Game Workspace Layout
  const handleReset = () => {
    setMapGrid(tileMap01.mapGrid.map(row => row.map(cell => cell[0])));
    for (let y = 0; y < tileMap01.mapGrid.length; y++) {
      for (let x = 0; x < tileMap01.mapGrid[y].length; x++) {
        if (tileMap01.mapGrid[y][x][0] === 'P') {
          setPlayerPos({ x, y });
        }
      }
    }
    setGameWon(false);
  };

  // 6. Dynamic Visual Style Selector (Fixed bracket compilation errors)
  const getTileStyles = (x, y) => {
    // Layer 1: Player Positioning Shell
    if (playerPos.x === x && playerPos.y === y) {
      return { 
        borderRadius: '50%',
        display: 'flex',         
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px', 
        fontWeight: 'bold',
        backgroundColor: '#aaaaaa' 
      }; 
    }

    // Layer 2: Default Static Tile Structures
    const currentToken = mapGrid[y][x];
    const originalToken = tileMap01.mapGrid[y][x][0];

    if (currentToken === 'W') return { backgroundColor: '#555555' };
    if (currentToken === 'B') {
      return originalToken === 'G' 
        ? { backgroundColor: '#4caf50', border: '2px solid #2e7d32' } 
        : { backgroundColor: '#b5651d' }; 
    }
    if (originalToken === 'G') return { backgroundColor: '#dda0dd', border: '1px dashed #9c27b0' }; 
    
    return { backgroundColor: '#aaaaaa' }; 
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      display: 'flex',            // Centering rule setup
      flexDirection: 'column',     // Vertical stack structure
      alignItems: 'center',        // Horizontal centering axis
      justifyContent: 'center'     // Vertical centering axis
    }}>
      <h1 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>🧙‍♂️ React Sokoban Puzzle Engine</h1>
      <p style={{ margin: '0 0 20px 0', color: '#666', textAlign: 'center' }}>
        Use your keyboard <b>Arrow Keys</b> to push blocks onto the target goals.
      </p>

      {gameWon && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px', width: 'max-content', fontWeight: 'bold' }}>
          🎉 Congratulations! You solved the puzzle!
        </div>
      )}

      {/* Grid Canvas Wrapper */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${tileMap01.width}, 32px)`,
        gap: '1px',
        backgroundColor: '#333',
        padding: '10px',
        width: 'max-content',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {mapGrid.map((row, y) => 
          row.map((cell, x) => (
            <div 
              key={`${y}-${x}`}
              style={{
                width: '32px',
                height: '32px',
                transition: 'all 0.1s ease-in-out',
                ...getTileStyles(x, y)
              }}
            >
              {playerPos.x === x && playerPos.y === y ? '🧙‍♂️' : ''}
            </div>
          ))
        )}
      </div>

      <button 
        onClick={handleReset}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Reset Map
      </button>
    </div>
  );
}