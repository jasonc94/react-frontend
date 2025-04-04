import { Title, Text, Flex, Overlay, Button, AspectRatio } from '@mantine/core';
import styles from './game-flappy-husky.module.scss';

import { useEffect, useRef, useState } from 'react';
import { useFlappyHuskyStore } from '../stores/flappy-husky-store';
import { Level } from '../scenes/level';

export function GameFlappyHusky() {
  const gameContainer = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);

  const game = useFlappyHuskyStore((state) => state.gameEngine);
  const gameOver = useFlappyHuskyStore((state) => state.gameOver);
  const initGame = useFlappyHuskyStore((state) => state.initGame);
  const addActor = useFlappyHuskyStore((state) => state.addActor);
  const exitGame = useFlappyHuskyStore((state) => state.exitGame);
  const startGame = useFlappyHuskyStore((state) => state.startGame);

  useEffect(() => {
    if (gameContainer.current === null) return;
    initGame(gameContainer.current);

    return () => {
      gameContainer.current?.remove();
      exitGame();
    };
  }, []);

  useEffect(() => {
    if (game) {
      startGame();
    }
  }, [game, addActor, startGame]);

  const restartGame = async () => {
    const newCount = count + 1;
    game?.addScene(`Level${newCount}`, Level);
    await game?.goToScene(`Level${newCount}`);
    game?.removeScene(`Level${count}`);

    useFlappyHuskyStore.setState({ gameOver: false });
    setCount(newCount);
  };

  return (
    <Flex justify={'center'} className="flex">
      <AspectRatio
        ratio={400 / 550}
        style={{ display: 'flex', position: 'relative' }}
      >
        <canvas
          ref={gameContainer}
          style={{ display: 'block', width: '100%', height: '100%' }}
        ></canvas>
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
      </AspectRatio>
    </Flex>
  );
}

export default GameFlappyHusky;
