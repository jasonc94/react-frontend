import { useState } from 'react';
import styles from './squad-lobby.module.scss';
import {
  Button,
  Card,
  Input,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

const mockSquadRooms = ['Alpha', 'Beta', 'Gamma'];

export function SquadLobby() {
  const [newSquadModalOpened, setNewSquadModalOpened] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [searchString, setSearchString] = useState('');
  const [squads, setSquads] = useState([
    'Alpha Squad',
    'Bravo Squad',
    'Charlie Squad',
  ]);

  const filteredSquads = mockSquadRooms.filter((room) =>
    room.toLowerCase().includes(searchString.toLowerCase())
  );

  const createSquad = () => {
    if (newSquadName.trim()) {
      setSquads([...squads, newSquadName]);
      setNewSquadName('');
      setNewSquadModalOpened(false);
    }
  };

  const joinSquad = (squad: string) => {};

  return (
    <div className={styles['container']}>
      <Stack align="center">
        <h1>Welcome to Squad Lobby!</h1>
        <Button size="xl" onClick={() => setNewSquadModalOpened(true)}>
          Create New Squad Room
        </Button>

        <Card
          className={styles['room-list-card']}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
        >
          <Input
            placeholder="Search squad rooms..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <Stack mt="md">
            {filteredSquads.length > 0 ? (
              filteredSquads.map((squad) => (
                <Card key={squad} shadow="xs" padding="md" withBorder>
                  <Text>{squad}</Text>
                  <Button size="sm" onClick={() => joinSquad(squad)} mt="sm">
                    Join Squad Room
                  </Button>
                </Card>
              ))
            ) : (
              <Text>No rooms found</Text>
            )}
          </Stack>
        </Card>
      </Stack>

      <Modal
        opened={newSquadModalOpened}
        onClose={() => setNewSquadModalOpened(false)}
        title="Create a New Squad Room"
      >
        <Stack>
          <TextInput
            placeholder="Enter squad room name"
            value={newSquadName}
            onChange={(e) => setNewSquadName(e.currentTarget.value)}
          />
          <Button onClick={() => setNewSquadModalOpened(false)}>Cancel</Button>
          <Button onClick={createSquad}>Ok</Button>
        </Stack>
      </Modal>
    </div>
  );
}

export default SquadLobby;
