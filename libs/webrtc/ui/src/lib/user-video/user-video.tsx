import { ActionIcon, Card, Group, Title, Tooltip } from '@mantine/core';
import styles from './user-video.module.scss';
import { useEffect, useRef, useState } from 'react';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
} from '@tabler/icons-react';

export function UserVideo({
  mediaStream,
  userId,
}: {
  mediaStream: MediaStream | null;
  userId: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const toggleVideoOrAudio = (type: 'video' | 'audio') => {
    if (videoRef.current?.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          backgroundColor: '#000',
        }}
      />
      <Title order={5} mt="sm">
        User: {userId}
      </Title>
      <Group mt="md" justify="center">
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
      </Group>
    </Card>
  );
}

export default UserVideo;
