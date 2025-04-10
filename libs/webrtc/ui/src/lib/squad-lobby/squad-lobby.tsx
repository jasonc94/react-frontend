import { useEffect, useState } from 'react';
import styles from './squad-lobby.module.scss';
import {
  Button,
  Card,
  Center,
  Flex,
  Group,
  Input,
  Popover,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@JC/shared/api';
import { Room } from '@JC/models';

export function SquadLobby() {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isEnteringRoom, setIsEnteringRoom] = useState<number | null>(null);
  const [newSquadName, setNewSquadName] = useState('');
  const [searchString, setSearchString] = useState('');
  const [joinAsName, setJoinAsName] = useState('');
  const [squads, setSquads] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { api } = useApi(false);
  const navigate = useNavigate();

  const filteredSquads = squads.filter((room) =>
    room.name.toLowerCase().includes(searchString.toLowerCase())
  );

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await api.get<Room[]>('/chatrooms/rooms/');

        setSquads(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const createSquad = async () => {
    if (newSquadName.trim()) {
      if (squads.some((room) => room.name === newSquadName)) {
        notifications.show({
          title: 'Error',
          message: 'Squad already exists',
          color: 'red',
        });
        return;
      }
      const response = await api.post('/chatrooms/rooms/', {
        name: newSquadName,
      });
      setSquads([...squads, response.data]);
      setNewSquadName('');
      setIsCreatingRoom(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                <Text fw={700}>{squad.name}</Text>
                {squad.participants?.length && (
                  <Text>
                    <b>Participants: </b>
                    {squad.participants?.map((p) => p.name).join(', ')}
                  </Text>
                )}

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
                          navigate(
                            `/squad-connect/${squad.name}?name=${joinAsName}`
                          )
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
