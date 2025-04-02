import { Title, Text, Flex, Button, Select } from '@mantine/core';
import styles from './game-library.module.scss';
import { useState } from 'react';
import { GameFlappyHusky } from '@JC/games/game-flappy-husky';
import { Game2048 } from '@JC/games/game-2048';

export function GameLibrary() {
  const [currentGame, setCurrentGame] = useState<'2048' | 'flappy-husky'>(
    'flappy-husky'
  );

  const games = [
    { label: '2048', value: '2048' },
    { label: 'Flappy BB', value: 'flappy-husky' },
  ];

  const onSelectGame = (game: string | null) => {
    if (!game) return;

    setCurrentGame(game === '2048' ? '2048' : 'flappy-husky');
  };

  return (
    <Flex direction={'column'} className="flex">
      <Title order={1} c={'blue'} ta={'center'}>
        {currentGame}
      </Title>
      <Flex direction={'row'} gap={'md'} justify={'center'}>
        <Select
          label="Games list"
          placeholder="Pick game"
          data={games}
          value={currentGame}
          onChange={onSelectGame}
        />
        {/* {games.map((game) => (
          <Button
            key={game}
            variant="filled"
            onClick={() => setCurrentGame(game as '2048' | 'flappy-husky')}
          >
            {game}
          </Button>
        ))} */}
      </Flex>

      {currentGame === 'flappy-husky' ? <GameFlappyHusky /> : <Game2048 />}
    </Flex>
  );
}

export default GameLibrary;
