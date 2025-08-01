import { AspectRatio, Text, Overlay, Flex, Avatar } from '@mantine/core';
import styles from './user-video.module.scss';
import { useEffect, useRef, useState } from 'react';
import { IconGhost2 } from '@tabler/icons-react';
import React from 'react';
import { useAppStore } from '@JC/shared/store';

function UserVideo({
  mediaStream,
  userId,
  isSelf = false,
}: {
  mediaStream: MediaStream | null;
  userId: string;
  isSelf?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(
    window.innerWidth / window.innerHeight
  );

  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }

    const checkCameraStatus = () => {
      const hasCameraFeed = mediaStream?.getVideoTracks().some((track) => {
        return track.enabled && track.readyState === 'live';
      });

      setIsCameraOn(!!hasCameraFeed);
    };

    checkCameraStatus();

    const interval = setInterval(checkCameraStatus, 1000); // Polling every second

    return () => clearInterval(interval);
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
    <AspectRatio
      ratio={aspectRatio}
      mx="auto"
      style={{ display: 'flex', position: 'relative' }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isSelf}
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
      <Text
        style={{
          position: 'absolute',
          top: '96%',
          left: '10px',
          width: 'auto',
          fontWeight: 'bold',
        }}
      >
        User: {isSelf ? user.displayName : userId}
      </Text>
      {!isCameraOn && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '8px',
          }}
        >
          <Flex direction={'column'} align={'center'} gap={'md'}>
            <Avatar size={'xl'} name="User" variant="filled" color="indigo">
              <IconGhost2></IconGhost2>
            </Avatar>
            User: {isSelf ? user.displayName : userId}
          </Flex>
        </div>
      )}
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

export default React.memo(UserVideo);
