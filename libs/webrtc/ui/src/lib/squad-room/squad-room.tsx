import { useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';
import WebsocketService from '../services/websocket-service';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
} from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

export function SquadRoom() {
  const { room } = useParams(); // Get the room parameter from the URL
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const wsService = useRef<WebsocketService | null>(null);
  const localStream = useRef<MediaStream>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  if (wsService.current === null) {
    wsService.current = new WebsocketService(
      `ws://localhost:8000/ws/squad-connect/${room}/`
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
        localStream.current = stream;
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
          createPeerConnection();
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    if (localStream.current === null) {
      initLocalStream();
    }

    wsService.current?.on('offer', createAnswer);
    wsService.current?.on('answer', handleAnswer);
    wsService.current?.on('icecandidate', handleIceCandidate);
    wsService.current?.connect();

    // Cleanup
    return () => {
      if (localStream.current) {
        localStream.current?.getTracks().forEach((track) => track.stop());
      }
      wsService.current?.disconnect();
    };
  }, []);

  const createPeerConnection = () => {
    if (peerConnection.current) return;
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

    if (localStream.current) {
      localStream.current
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream.current!));
    }

    peerConnection.current = pc;
    console.log('Peer connection created');
  };

  const createOffer = async () => {
    try {
      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer);
      wsService?.current?.send({ type: 'offer', payload: offer });
      console.log('Offer created');
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const createAnswer = async (offer: RTCSessionDescription) => {
    try {
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer);
      wsService?.current?.send({ type: 'answer', payload: answer });
      console.log('Answer created');
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescription) => {
    try {
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      console.log('Answer received');
    } catch (error) {
      console.error('Handle Answer - Error setting remote description:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      await peerConnection.current?.addIceCandidate(candidate);
    } catch (e) {
      console.error('error adding ice candidate', e);
    }
  };

  const joinSquadRoom = async () => {
    await createOffer();
  };

  const toggleVideoOrAudio = (type: 'video' | 'audio') => {
    if (localVideo.current?.srcObject) {
      const mediaStream = localVideo.current.srcObject as MediaStream;
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
    <Stack align="center">
      <Title order={1}>Welcome to {room}!</Title>

      <Group grow>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
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
        </Card>

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

      <Button onClick={joinSquadRoom} size="lg" radius="xl">
        Join Squad Room
      </Button>
    </Stack>
  );
}

export default SquadRoom;
