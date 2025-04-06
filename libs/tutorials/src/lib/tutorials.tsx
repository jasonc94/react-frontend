import styles from './tutorials.module.scss';
import { Flex, Select, Title } from '@mantine/core';
import { useState } from 'react';

export function Tutorials() {
  const [currentTutorial, setCurrentTutorial] = useState<
    'Deploy React' | 'Deploy Django'
  >('Deploy React');

  const tutorials = [
    { label: 'Deploy React', value: 'Deploy React' },
    { label: 'Deploy Django', value: 'Deploy Django' },
  ];

  const onSelectTutorial = (tutorial: string | null) => {
    if (!tutorial) return;
    setCurrentTutorial(
      tutorial === 'Deploy React' ? 'Deploy React' : 'Deploy Django'
    );
  };

  return (
    <Flex direction={'column'} className="flex" gap={'md'}>
      <Title order={1} c={'blue'} ta={'center'}>
        Tutorials
      </Title>
      <Flex direction={'row'} gap={'md'} justify={'center'}>
        <Select
          label="Tutorials list"
          placeholder="Pick a tutorial"
          data={tutorials}
          value={currentTutorial}
          onChange={onSelectTutorial}
        />
      </Flex>
    </Flex>
  );
}

export default Tutorials;
