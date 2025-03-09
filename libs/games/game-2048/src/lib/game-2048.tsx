import { useEffect, useState } from 'react';
import styles from './game-2048.module.scss';
import {
  initializeBoard,
  isGameOver,
  move,
} from './services/game-2048-service';
import { Title, Text, Button, Flex, Overlay } from '@mantine/core';

export function Game2048() {
  const [board, setBoard] = useState(initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const onArrowKey = (e: KeyboardEvent) => {
      const directionMap: { [key: string]: 'left' | 'right' | 'up' | 'down' } =
        {
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'up',
          ArrowDown: 'down',
        };

      if (directionMap[e.key]) {
        const newBoard = move(board, directionMap[e.key], setScore);
        setBoard(newBoard);
        setGameOver(isGameOver(newBoard));
      }
    };

    window.addEventListener('keydown', onArrowKey);
    return () => window.removeEventListener('keydown', onArrowKey);
  }, [board]);

  const restartGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className={styles.gameContainer}>
      <Title order={1} c={'blue'}>
        2048 Game
      </Title>
      <Text tt={'uppercase'} c="blue" ta={'center'}>
        Score: {score}
      </Text>

      {/* Board Container with Overlay */}
      <div className={styles.boardContainer}>
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

        {/* Overlay for Game Over */}
        {gameOver && (
          <Overlay color="#000" center>
            <Flex direction="column" justify="center" align="center" gap="md">
              <Text
                c={'red'}
                fw={700}
                fs={'5rem'}
                tt={'uppercase'}
                ta={'center'}
              >
                Game Over!
              </Text>
              <Button variant="filled" onClick={restartGame}>
                Restart
              </Button>
            </Flex>
          </Overlay>
        )}
      </div>
    </div>
  );
}

export default Game2048;
