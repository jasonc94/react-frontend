import { Title, Text, Flex } from '@mantine/core';
import styles from './game-flappy-bird.module.scss';
import * as ex from 'excalibur';
import { useEffect, useRef } from 'react';
import { useFlappyBirdStore } from '../stores/flappy-bird-store';
import { Bird } from '../actors/bird-actor';
import { Ground } from '../actors/ground-actor';
import { Pipe } from '../actors/pipe-actor';

export function GameFlappyBird() {
  const gameContainer = useRef<HTMLCanvasElement>(null);

  const game = useFlappyBirdStore((state) => state.gameEngine);
  const initGame = useFlappyBirdStore((state) => state.initGame);
  const addActor = useFlappyBirdStore((state) => state.addActor);
  const exitGame = useFlappyBirdStore((state) => state.exitGame);
  const startGame = useFlappyBirdStore((state) => state.startGame);

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

export default GameFlappyBird;
