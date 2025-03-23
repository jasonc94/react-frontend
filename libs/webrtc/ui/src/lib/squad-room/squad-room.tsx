import { useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';
import WebsocketService from '../services/websocket-service';
import { Button, Card, Group, Stack, Title } from '@mantine/core';

import { useParams } from 'react-router-dom';
import UserVideo from '../user-video/user-video';

export function SquadRoom() {
  const { room } = useParams(); // Get the room parameter from the URL
  const wsService = useRef<WebsocketService | null>(null);

  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<{
    [senderId: string]: RTCPeerConnection;
  }>({});
  const [status, setStatus] = useState<'init' | 'waiting' | 'connected'>(
    'init'
  );
  const [peerStreams, setPeerStreams] = useState<{
    [senderId: string]: MediaStream;
  }>({});

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
    if (!localStream) {
      initLocalStream();
    }

    wsService.current?.onOpen(() => {
      setWebsocketConnected(true);
    });
    wsService.current?.connect();

    // Cleanup
    return () => {
      if (localStream) {
        localStream?.getTracks().forEach((track) => track.stop());
      }
      wsService.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (localStream && websocketConnected) {
      setStatus('waiting');
    }
  }, [localStream, websocketConnected]);

  // **important** - these callbacks needs to be reassigned when peerconnection changes
  useEffect(() => {
    if (localStream && userId.current) {
      wsService.current?.on('join', handleJoin);
      wsService.current?.on('leave', handleLeave);
      wsService.current?.on('offer', handleOffer);
      wsService.current?.on('answer', handleAnswer);
      wsService.current?.on('icecandidate', handleIceCandidate);
    }
  }, [peerConnections, localStream]);

  // create peer connection and send offer for the new user joining room
  const handleJoin = async (peerId: string) => {
    const pc = createPeerConnection(peerId);
    await createOffer(pc);
    setStatus('connected');
    console.log('Peer joined the room', peerId);
  };

  // cleanup peer connection when user leaves the room
  const handleLeave = async (peerId: string) => {
    peerConnections[peerId]?.close();
    setPeerConnections((prev) => {
      const copy = { ...prev };
      delete copy[peerId];
      return copy;
    });
    setPeerStreams((prev) => {
      const copy = { ...prev };
      delete copy[peerId];
      return copy;
    });
    console.log('Peer left the room', peerId);
  };

  const createOffer = async (pc: RTCPeerConnection) => {
    try {
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

  const handleOffer = async (peerId: string, offer: RTCSessionDescription) => {
    try {
      // create peer connection for the offer sender
      const pc = createPeerConnection(peerId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsService?.current?.send({
        sender: userId.current!,
        type: 'answer',
        payload: answer,
      });
      console.log('Offer handled, answer created');
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const handleAnswer = async (
    peerId: string,
    answer: RTCSessionDescription
  ) => {
    try {
      //  acknowledge the answer
      const pc = peerConnections[peerId];
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Answer Handled');
    } catch (error) {
      console.error('Handle Answer - Error setting remote description:', error);
    }
  };

  const handleIceCandidate = async (
    sender: string,
    candidate: RTCIceCandidate
  ) => {
    try {
      const pc = peerConnections[sender];
      if (!pc) return;
      await pc.addIceCandidate(candidate);
    } catch (e) {
      console.error('error adding ice candidate', e);
    }
  };

  const createPeerConnection = (peerId: string) => {
    if (peerConnections[peerId]) return peerConnections[peerId];

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
          sender: userId.current!,
          type: 'icecandidate',
          payload: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setPeerStreams((prev) => ({ ...prev, [peerId]: stream }));
    };

    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
    }

    setPeerConnections((prev) => ({ ...prev, [peerId]: pc }));
    console.log('Peer connection created', peerId);
    return pc;
  };

  const joinSquadCall = async () => {
    wsService?.current?.send({
      sender: userId.current!,
      type: 'join',
      payload: { type: 'join', payload: { userId: userId.current } },
    });
    setStatus('connected');
  };

  const leaveSquadCall = async () => {
    wsService?.current?.send({
      sender: userId.current!,
      type: 'leave',
      payload: { type: 'leave', payload: { userId: userId.current } },
    });
    setStatus('waiting');
  };

  return (
    <Stack align="center">
      <Title order={1}>Welcome to {room}!</Title>

      <Group grow>
        <UserVideo
          mediaStream={localStream}
          userId={userId.current!}
          isSelf={true}
        ></UserVideo>

        {Object.keys(peerStreams).map((peerId) => (
          <UserVideo
            key={peerId}
            mediaStream={peerStreams[peerId]}
            userId={peerId}
          ></UserVideo>
        ))}
      </Group>
      {status === 'connected' ? (
        <Button onClick={leaveSquadCall} size="lg" radius="xl">
          Leave
        </Button>
      ) : (
        <Button
          onClick={joinSquadCall}
          size="lg"
          radius="xl"
          disabled={status === 'init'}
        >
          Join Squad Call
        </Button>
      )}
    </Stack>
  );
}

export default SquadRoom;
