import { useState } from 'react';
import styles from './game-2048.module.scss';
import { initializeBoard } from './services/game-2048-service';

export function Game2048() {
  const [board, setBoard] = useState(initializeBoard());

  return (
    <div className={styles.gameContainer}>
      <h1>2048 Game</h1>
      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.tile} ${styles[`tile-${cell}`]}`}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Game2048;
