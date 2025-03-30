import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
  Stack,
  Tooltip,
} from '@mantine/core';
import styles from './room-controls.module.scss';
import {
  IconDoorExit,
  IconMicrophone,
  IconMicrophoneOff,
  IconScreenShare,
  IconScreenShareOff,
  IconVideo,
  IconVideoOff,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function RoomControls({
  roomStatus,
  localStream,
  peerConnections,
  onJoinSquadCall,
  onLeaveSquadCall,
  onLocalStreamUpdate,
}: {
  roomStatus: string;
  localStream: MediaStream | null;
  peerConnections: {
    [peerId: string]: {
      peerConnection: RTCPeerConnection;
      stream: MediaStream | null;
    };
  };
  onJoinSquadCall: () => void;
  onLeaveSquadCall: () => void;
  onLocalStreamUpdate: (stream: MediaStream) => void;
}) {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);

  useEffect(() => {
    if (localStream) {
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoOn));
    }
  }, [isVideoOn, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = isAudioOn));
    }
  }, [isAudioOn, localStream]);

  const toggleVideoOrAudio = async (type: 'video' | 'audio') => {
    if (localStream) {
      switch (type) {
        case 'video':
          setIsVideoOn((prev) => !prev);
          break;
        case 'audio':
          setIsAudioOn((prev) => !prev);
          break;
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      onLocalStreamUpdate(stream);
    }
  };

  const toggleScreenShare = () => {
    if (localStream) {
      isScreenShareOn ? stopScreenShare() : startScreenShare();
      setIsScreenShareOn((prev) => !prev);
    }
  };

  const replacePeerStream = async (stream: MediaStream) => {
    Object.values(peerConnections).forEach(({ peerConnection: pc }) => {
      stream.getTracks().forEach((track) => {
        const sender = pc
          .getSenders()
          .find((sender) => sender.track?.kind === track.kind);
        sender?.replaceTrack(track);
      });
    });
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('Screen sharing ended by user');
        stopScreenShare();
      });

      replacePeerStream(stream);

      // Update the local stream state
      onLocalStreamUpdate(stream);
      setIsScreenShareOn(true);
    } catch (e) {
      console.error('Error sharing screen', e);
      setIsScreenShareOn(false);
    }
  };

  const stopScreenShare = async () => {
    try {
      localStream?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      replacePeerStream(stream);
      onLocalStreamUpdate(stream);
      setIsScreenShareOn(false);
    } catch (e) {
      console.error('Error sharing screen', e);
    }
  };

  if (roomStatus === 'connected') {
    return (
      <Flex justify={'center'} gap={'md'} className={styles.container}>
        <Tooltip
          label={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
          withArrow
        >
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color={isVideoOn ? undefined : 'red'}
            onClick={() => toggleVideoOrAudio('video')}
          >
            {isVideoOn ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label={isAudioOn ? 'Mute' : 'Unmute'} withArrow>
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color={isAudioOn ? undefined : 'red'}
            onClick={() => toggleVideoOrAudio('audio')}
          >
            {isAudioOn ? (
              <IconMicrophone size={24} />
            ) : (
              <IconMicrophoneOff size={24} />
            )}
          </ActionIcon>
        </Tooltip>

        <Tooltip
          label={isScreenShareOn ? 'Stop Sharing' : 'Share Screen'}
          withArrow
        >
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color={isScreenShareOn ? 'red' : undefined}
            onClick={toggleScreenShare}
          >
            {isScreenShareOn ? (
              <IconScreenShareOff size={24} />
            ) : (
              <IconScreenShare size={24} />
            )}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Leave Squad Call" withArrow>
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color="red"
            onClick={onLeaveSquadCall}
          >
            <IconDoorExit size={24} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    );
  }

  return (
    <Flex direction={'column'} gap={'md'} className={styles.container}>
      <Flex justify={'center'} gap={'md'}>
        <Tooltip
          label={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
          withArrow
        >
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color={isVideoOn ? undefined : 'red'}
            onClick={() => toggleVideoOrAudio('video')}
          >
            {isVideoOn ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label={isAudioOn ? 'Mute' : 'Unmute'} withArrow>
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color={isAudioOn ? undefined : 'red'}
            onClick={() => toggleVideoOrAudio('audio')}
          >
            {isAudioOn ? (
              <IconMicrophone size={24} />
            ) : (
              <IconMicrophoneOff size={24} />
            )}
          </ActionIcon>
        </Tooltip>
      </Flex>

      <Button
        onClick={onJoinSquadCall}
        size="lg"
        radius="xl"
        disabled={roomStatus === 'init'}
      >
        Join Squad Call
      </Button>
    </Flex>
  );
}

export default RoomControls;
