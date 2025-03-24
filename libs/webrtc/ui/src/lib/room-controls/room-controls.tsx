import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
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
import { useState } from 'react';

export function RoomControls({
  roomStatus,
  mediaStream,
  peerConnections,
  onJoinSquadCall,
  onLeaveSquadCall,
  onLocalStreamUpdate,
}: {
  roomStatus: string;
  mediaStream: MediaStream | null;
  peerConnections: { [peerId: string]: RTCPeerConnection };
  onJoinSquadCall: () => void;
  onLeaveSquadCall: () => void;
  onLocalStreamUpdate: (stream: MediaStream) => void;
}) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);

  const toggleVideoOrAudio = (type: 'video' | 'audio') => {
    if (mediaStream) {
      switch (type) {
        case 'video':
          mediaStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
          setIsVideoOn((prev) => !prev);
          break;
        case 'audio':
          mediaStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
          setIsAudioOn((prev) => !prev);
          break;
      }
    }
  };

  const toggleScreenShare = () => {
    if (mediaStream) {
      isScreenShareOn ? stopScreenShare() : startScreenShare();
      setIsScreenShareOn((prev) => !prev);
    }
  };

  const replacePeerStream = async (stream: MediaStream) => {
    Object.values(peerConnections).forEach((pc) => {
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

      replacePeerStream(stream);

      // Update the local stream state
      onLocalStreamUpdate(stream);
      setIsScreenShareOn(true);
    } catch (e) {
      console.error('Error sharing screen', e);
    }
  };

  const stopScreenShare = async () => {
    try {
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
    <Center>
      <Button
        onClick={onJoinSquadCall}
        size="lg"
        radius="xl"
        disabled={roomStatus === 'init'}
      >
        Join Squad Call
      </Button>
    </Center>
  );
}

export default RoomControls;
