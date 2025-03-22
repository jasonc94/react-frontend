import { useState } from 'react';
import styles from './squad-lobby.module.scss';
import {
  Button,
  Card,
  Flex,
  Group,
  Input,
  Modal,
  Popover,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function SquadLobby() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [searchString, setSearchString] = useState('');
  const [squads, setSquads] = useState(['Alpha', 'Bravo', 'Charlie']);

  const filteredSquads = squads.filter((room) =>
    room.toLowerCase().includes(searchString.toLowerCase())
  );

  const createSquad = () => {
    if (newSquadName.trim()) {
      if (squads.includes(newSquadName)) {
        notifications.show({
          title: 'Error',
          message: 'Squad already exists',
          color: 'red',
        });
        return;
      }
      setSquads([...squads, newSquadName]);
      setNewSquadName('');
      setIsPopoverOpen(false);
    }
  };

  const joinSquad = (squad: string) => {};

  return (
    <div>
      <h1>Welcome to Squad Connect!</h1>

      <Flex justify={'center'}>
        <Popover
          opened={isPopoverOpen}
          onChange={setIsPopoverOpen}
          position="bottom"
          withArrow
        >
          <Popover.Target>
            <Button onClick={() => setIsPopoverOpen((o) => !o)}>
              Create Squad Room
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              <Input
                placeholder="Enter Squad Room Name"
                value={newSquadName}
                onChange={(e) => setNewSquadName(e.target.value)}
              />
              <Button onClick={createSquad}>Create</Button>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Flex>

      {/* Search Input */}
      <Input
        placeholder="Search Squad Rooms"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        mt="md"
      />

      {/* Squad Room List */}
      <Stack mt="md">
        {filteredSquads.length > 0 ? (
          filteredSquads.map((squad, index) => (
            <Card key={index} shadow="sm" padding="lg" withBorder>
              <Group justify="space-between">
                <Text>{squad}</Text>
                <Button onClick={() => console.log(`Joining ${squad}`)}>
                  Join
                </Button>
              </Group>
            </Card>
          ))
        ) : (
          <Text>No rooms found</Text>
        )}
      </Stack>
    </div>
  );
}

export default SquadLobby;
