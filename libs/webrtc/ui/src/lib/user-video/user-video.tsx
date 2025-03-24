import { AspectRatio, Card, Title } from '@mantine/core';
import styles from './user-video.module.scss';
import { useEffect, useRef, useState } from 'react';

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
      </Card>
    </AspectRatio>
  );
}

export default UserVideo;
