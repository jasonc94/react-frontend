import { AspectRatio, Text, Overlay, Flex } from '@mantine/core';
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
    <AspectRatio ratio={aspectRatio} mx="auto" style={{ display: 'flex' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          borderRadius: '8px',
          backgroundColor: '#000',
          marginLeft: 'auto',
          marginRight: 'auto',
          objectFit: 'contain',
        }}
      />
    </AspectRatio>

    // <AspectRatio ratio={aspectRatio} mx="auto">
    //   <Flex
    //     justify="center"
    //     style={{ position: 'relative', width: '100%', height: '100%' }}
    //   >
    //     <video
    //       ref={videoRef}
    //       autoPlay
    //       muted
    //       playsInline
    //       style={{
    //         minWidth: '600px',
    //         height: '100%',
    //         maxWidth: '100%',
    //         borderRadius: '8px',
    //         backgroundColor: '#000',
    //       }}
    //     />
    //     <Text
    //       style={{
    //         position: 'absolute',
    //         bottom: '10px',
    //         left: '10px',
    //         color: 'white',
    //         fontWeight: 'bold',
    //         zIndex: 2,
    //       }}
    //     >
    //       User: {userId}
    //     </Text>
    //   </Flex>
    // </AspectRatio>
  );
}

export default UserVideo;
