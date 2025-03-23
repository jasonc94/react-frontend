import {
  ActionIcon,
  AspectRatio,
  Card,
  Group,
  Title,
  Tooltip,
} from '@mantine/core';
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
  isSelf = false,
}: {
  mediaStream: MediaStream | null;
  userId: string;
  isSelf?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const [aspectRatio, setAspectRatio] = useState<number>(
    window.innerWidth / window.innerHeight
  );

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  useEffect(() => {
    const handleResize = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };

    // Add event listener to update aspect ratio on window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <AspectRatio ratio={aspectRatio}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: '100%', height: '100%' }}
        className={isSelf ? styles.isMySelf : ''}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            minWidth: '500px',
            height: '100%',
            maxWidth: '100%',
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
    </AspectRatio>
  );
}

export default UserVideo;
