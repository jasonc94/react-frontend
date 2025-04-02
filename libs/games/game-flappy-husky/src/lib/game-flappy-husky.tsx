import { Title, Text, Flex } from '@mantine/core';
import styles from './game-flappy-bird.module.scss';

import { useEffect, useRef } from 'react';
import { useFlappyHuskyStore } from '../stores/flappy-husky-store';

export function GameFlappyHusky() {
  const gameContainer = useRef<HTMLCanvasElement>(null);

  const game = useFlappyHuskyStore((state) => state.gameEngine);
  const initGame = useFlappyHuskyStore((state) => state.initGame);
  const addActor = useFlappyHuskyStore((state) => state.addActor);
  const exitGame = useFlappyHuskyStore((state) => state.exitGame);
  const startGame = useFlappyHuskyStore((state) => state.startGame);

  useEffect(() => {
    if (gameContainer.current === null) return;
    initGame(gameContainer.current);

    return () => exitGame();
  }, []);

  useEffect(() => {
    if (game) {
      startGame();
    }
  }, [game, addActor, startGame]);

  return (
    <Flex direction={'column'} className="flex">
      <Title order={1} c={'blue'}>
        2048 Game
      </Title>
      <Text tt={'uppercase'} c="blue" ta={'center'}>
        Score:
      </Text>
      <Flex justify={'center'} className="flex">
        <canvas ref={gameContainer}></canvas>
      </Flex>
    </Flex>
  );
}

export default GameFlappyHusky;
