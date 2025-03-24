import { Button, Flex } from '@mantine/core';
import styles from './room-controls.module.scss';

export function RoomControls({
  roomStatus,
  onJoinSquadCall,
  onLeaveSquadCall,
  onStartScreenShare,
  onStopScreenShare,
}: {
  roomStatus: string;
  onJoinSquadCall: () => void;
  onLeaveSquadCall: () => void;
  onStartScreenShare: () => void;
  onStopScreenShare: () => void;
}) {
  return (
    <Flex justify={'center'} gap={'md'}>
      {roomStatus === 'connected' ? (
        <Button onClick={onLeaveSquadCall} size="lg" radius="xl">
          Leave
        </Button>
      ) : (
        <Button
          onClick={onJoinSquadCall}
          size="lg"
          radius="xl"
          disabled={roomStatus === 'init'}
        >
          Join Squad Call
        </Button>
      )}

      <Button
        onClick={onStartScreenShare}
        size="lg"
        radius="xl"
        disabled={roomStatus === 'init'}
      >
        Share Screen
      </Button>

      <Button
        onClick={onStopScreenShare}
        size="lg"
        radius="xl"
        disabled={roomStatus === 'init'}
      >
        Stop Screen Share
      </Button>
    </Flex>
  );
}

export default RoomControls;
