import { ActionIcon, Button, Flex, Tooltip } from '@mantine/core';
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
import { useRoomStore } from '../../stores/room-store';

export function RoomControls({
  onJoinSquadCall,
  onLeaveSquadCall,
}: {
  onJoinSquadCall: () => void;
  onLeaveSquadCall: () => void;
}) {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const roomStatus = useRoomStore((state) => state.roomStatus);
  const localStream = useRoomStore((state) => state.localStream);
  const setLocalStream = useRoomStore((state) => state.setLocalStream);

  // try getting media stream again when its mobile
  useEffect(() => {
    if (roomStatus !== 'connected') return;
    const isMobile = () => {
      return (
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    console.log('isMobile', isMobile());

    const getMediaStream = async () => {
      const startTime = performance.now();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const endTime = performance.now();

      const elapsedTime = endTime - startTime;
      console.log(`Time taken to get camera feed: ${elapsedTime}ms`);
      setLocalStream(stream, true);
    };
    if (isMobile()) {
      localStream?.getTracks().forEach((track) => track.stop());
      getMediaStream();
    }
  }, [roomStatus]);

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

  const toggleVideoOrAudio = (type: 'video' | 'audio') => {
    if (localStream) {
      switch (type) {
        case 'video':
          setIsVideoOn((prev) => !prev);
          break;
        case 'audio':
          setIsAudioOn((prev) => !prev);
          break;
      }
    }
  };

  const toggleScreenShare = () => {
    if (localStream) {
      isScreenShareOn ? stopScreenShare() : startScreenShare();
      setIsScreenShareOn((prev) => !prev);
    }
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

      setLocalStream(stream, true);
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

      setLocalStream(stream, true);
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
