import { useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';
import WebsocketService from '../services/websocket-service';
import { Button, Card, Group, Stack, Title } from '@mantine/core';

import { useParams } from 'react-router-dom';
import UserVideo from '../user-video/user-video';

export function SquadRoom() {
  const { room } = useParams(); // Get the room parameter from the URL
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const wsService = useRef<WebsocketService | null>(null);

  const [peerConnections, setPeerConnections] = useState<{
    [id: string]: RTCPeerConnection;
  }>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const userId = useRef<string>(null);

  if (!userId.current) {
    userId.current = Math.random().toString(36).substring(2, 9);
  }

  if (wsService.current === null) {
    wsService.current = new WebsocketService(
      `ws://localhost:8000/ws/squad-connect/${room}/${userId.current}/`
    );
  }

  useEffect(() => {
    // Local Video Feed
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initLocalStream();

    wsService.current?.connect();

    // Cleanup
    return () => {
      if (localStream) {
        localStream?.getTracks().forEach((track) => track.stop());
      }
      wsService.current?.disconnect();
    };
  }, []);

  // Peer connnection and ws connection setup
  useEffect(() => {
    if (localStream && userId.current) {
      createPeerConnection(userId.current!);
      wsService.current?.on('offer', createAnswer);
      wsService.current?.on('answer', handleAnswer);
      wsService.current?.on('icecandidate', handleIceCandidate);
    }
  }, [peerConnections, localStream]);

  // const createPeerConnection = () => {
  //   if (peerConnection.current) return;
  //   const pc = new RTCPeerConnection({
  //     iceServers: [
  //       { urls: 'stun:stun.l.google.com:19302' },
  //       { urls: 'stun:stun.l.google.com:5349' },
  //       { urls: 'stun:stun1.l.google.com:3478' },
  //       { urls: 'stun:stun1.l.google.com:5349' },
  //       { urls: 'stun:stun2.l.google.com:19302' },
  //       { urls: 'stun:stun2.l.google.com:5349' },
  //       { urls: 'stun:stun3.l.google.com:3478' },
  //       { urls: 'stun:stun3.l.google.com:5349' },
  //       { urls: 'stun:stun4.l.google.com:19302' },
  //       { urls: 'stun:stun4.l.google.com:5349' },
  //     ],
  //   });

  //   pc.oniceconnectionstatechange = () => {
  //     console.log('ICE connection state:', pc.iceConnectionState);
  //   };

  //   pc.onicecandidate = (event) => {
  //     console.log('New ICE candidateReceived');
  //     if (event.candidate) {
  //       wsService.current?.send({
  //         sender: userId,
  //         type: 'icecandidate',
  //         payload: event.candidate,
  //       });
  //     }
  //   };

  //   pc.ontrack = (event) => {
  //     if (remoteVideo.current) {
  //       remoteVideo.current.srcObject = event.streams[0];
  //     }
  //   };

  //   if (localStream) {
  //     localStream
  //       .getTracks()
  //       .forEach((track) => pc.addTrack(track, localStream));
  //   }

  //   peerConnection.current = pc;
  //   console.log('Peer connection created');
  // };

  const createOffer = async () => {
    try {
      const pc = peerConnections[userId.current!];
      if (!pc) return;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsService?.current?.send({
        sender: userId.current!,
        type: 'offer',
        payload: offer,
      });
      console.log('Offer created');
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const createAnswer = async (sender: string, offer: RTCSessionDescription) => {
    try {
      const pc = peerConnections[userId.current!];
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsService?.current?.send({
        sender: userId.current!,
        type: 'answer',
        payload: answer,
      });
      console.log('Answer created');
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const handleAnswer = async (
    sender: string,
    answer: RTCSessionDescription
  ) => {
    try {
      const pc = peerConnections[userId.current!];
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Answer received');
    } catch (error) {
      console.error('Handle Answer - Error setting remote description:', error);
    }
  };

  const handleIceCandidate = async (
    sender: string,
    candidate: RTCIceCandidate
  ) => {
    try {
      const pc = peerConnections[userId.current!];
      if (!pc) return;
      await pc.addIceCandidate(candidate);
    } catch (e) {
      console.error('error adding ice candidate', e);
    }
  };

  const createPeerConnection = (userId: string) => {
    if (peerConnections[userId]) return peerConnections[userId];

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun.l.google.com:5349' },
        { urls: 'stun:stun1.l.google.com:3478' },
        { urls: 'stun:stun1.l.google.com:5349' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:5349' },
        { urls: 'stun:stun3.l.google.com:3478' },
        { urls: 'stun:stun3.l.google.com:5349' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:5349' },
      ],
    });

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
    };

    pc.onicecandidate = (event) => {
      console.log('New ICE candidateReceived');
      if (event.candidate) {
        wsService.current?.send({
          sender: userId,
          type: 'icecandidate',
          payload: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
    }

    setPeerConnections((prev) => ({ ...prev, [userId]: pc }));
    console.log('Peer connection created', userId);
    return pc;
  };

  const joinSquadCall = async () => {
    // createPeerConnection(userId.current!);
    await createOffer();
  };

  return (
    <Stack align="center">
      <Title order={1}>Welcome to {room}!</Title>

      <Group grow>
        {/* <Card shadow="sm" padding="lg" radius="md" withBorder>
          <video
            ref={localVideo}
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
            Local Video
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
                {isVideoOn ? (
                  <IconVideo size={24} />
                ) : (
                  <IconVideoOff size={24} />
                )}
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
        </Card> */}
        <UserVideo mediaStream={localStream}></UserVideo>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              backgroundColor: '#000',
            }}
          />
          <Title order={5} mt="sm">
            Remote Video
          </Title>
        </Card>
      </Group>

      <Button onClick={joinSquadCall} size="lg" radius="xl">
        Join Squad Call
      </Button>
    </Stack>
  );
}

export default SquadRoom;
