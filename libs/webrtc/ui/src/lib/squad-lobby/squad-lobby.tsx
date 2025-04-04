import { useState } from 'react';
import styles from './squad-lobby.module.scss';
import {
  Button,
  Card,
  Center,
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
import { useNavigate } from 'react-router-dom';

export function SquadLobby() {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isEnteringRoom, setIsEnteringRoom] = useState<number | null>(null);
  const [newSquadName, setNewSquadName] = useState('');
  const [searchString, setSearchString] = useState('');
  const [joinAsName, setJoinAsName] = useState('');
  const [squads, setSquads] = useState(['Alpha', 'Bravo', 'Charlie']);
  const navigate = useNavigate();

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
      setIsCreatingRoom(false);
    }
  };

  return (
    <div>
      <h1>Welcome to Squad Connect!</h1>

      <Flex justify={'center'}>
        <Popover
          opened={isCreatingRoom}
          onChange={setIsCreatingRoom}
          position="bottom"
          withArrow
        >
          <Popover.Target>
            <Button onClick={() => setIsCreatingRoom((o) => !o)}>
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
        <Center>
          <Text fw={500} size="xl" mb="md">
            Available Squad Rooms
          </Text>
        </Center>

        {filteredSquads.length > 0 ? (
          filteredSquads.map((squad, index) => (
            <Card key={index} shadow="sm" padding="lg" withBorder>
              <Group justify="space-between">
                <Text>{squad}</Text>
                {/* <Button onClick={() => navigate(`/squad-connect/${squad}`)}>
                  Enter Squad Room
                </Button> */}

                <Popover
                  opened={isEnteringRoom === index}
                  onChange={(opened) => {
                    setIsEnteringRoom(opened ? index : null);
                  }}
                  position="top"
                  withArrow
                >
                  <Popover.Target>
                    <Button onClick={() => setIsEnteringRoom(index)}>
                      Enter Squad Room
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Stack>
                      <Input
                        placeholder="Join as: "
                        value={joinAsName}
                        onChange={(e) => setJoinAsName(e.target.value)}
                      />
                      <Button
                        onClick={() =>
                          navigate(`/squad-connect/${squad}?name=${joinAsName}`)
                        }
                      >
                        Ok
                      </Button>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            </Card>
          ))
        ) : (
          <Center>
            <Text>No rooms found</Text>
          </Center>
        )}
      </Stack>
    </div>
  );
}

export default SquadLobby;
