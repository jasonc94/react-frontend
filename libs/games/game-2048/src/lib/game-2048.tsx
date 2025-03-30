import { useCallback, useEffect, useRef, useState } from 'react';
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
  const game2048Ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      const newBoard = move(board, direction, setScore);
      setBoard(newBoard);
      setGameOver(isGameOver(newBoard));
    },
    [board]
  );

  // keyboard arrow
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
        handleMove(directionMap[e.key]);
      }
    };

    window.addEventListener('keydown', onArrowKey);
    return () => window.removeEventListener('keydown', onArrowKey);
  }, [handleMove]);

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const xDelta = touchEndX - touchStartX;
    const yDelta = touchEndY - touchStartY;

    if (Math.abs(xDelta) > Math.abs(yDelta)) {
      // horizonatl swipe
      if (xDelta > 50) {
        handleMove('right');
      } else if (xDelta < -50) {
        handleMove('left');
      }
    } else {
      // vertical swipe
      if (yDelta > 50) {
        handleMove('down');
      } else if (yDelta < -50) {
        handleMove('up');
      }
    }
  };

  // mobile swipes
  useEffect(() => {
    const game2048Element = game2048Ref.current;

    if (!game2048Element) return;

    game2048Element.addEventListener('touchstart', onTouchStart, {
      passive: false,
    });
    game2048Element.addEventListener('touchmove', onTouchMove, {
      passive: false,
    });
    game2048Element.addEventListener('touchend', onTouchEnd);

    return () => {
      if (!game2048Element) return;
      game2048Element.removeEventListener('touchstart', onTouchStart);
      game2048Element.removeEventListener('touchmove', onTouchMove);
      game2048Element.removeEventListener('touchend', onTouchEnd);
    };
  }, [board]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        restartGame();
      }, 1000);
    }
  }, [gameOver]);

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
      <div ref={game2048Ref} className={styles.boardContainer}>
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
