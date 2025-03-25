import { useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';
import WebsocketService from '../services/websocket-service';
import { Button, Center, Flex, Title } from '@mantine/core';

import { useParams, useSearchParams } from 'react-router-dom';
import UserVideo from '../user-video/user-video';
import RoomControls from '../room-controls/room-controls';

export function SquadRoom() {
  const { room } = useParams(); // Get the room parameter from the URL
  const [searchParams] = useSearchParams();

  const wsService = useRef<WebsocketService | null>(null);

  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<{
    [senderId: string]: {
      peerConnection: RTCPeerConnection;
      stream: MediaStream | null;
    };
  }>({});

  const [status, setStatus] = useState<'init' | 'ready' | 'connected'>('init');

  const userId = useRef<string>(null);

  if (!userId.current) {
    userId.current =
      searchParams.get('name') || Math.random().toString(36).substring(2, 9);
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
      console.log('Init local stream');
      initLocalStream();
    }

    // Cleanup
    return () => {
      if (localStream) {
        console.log('Cleanup local stream');
        localStream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  // websocket connection
  useEffect(() => {
    wsService.current?.onOpen(() => {
      setWebsocketConnected(true);
    });
    wsService.current?.connect();

    return () => {
      wsService.current?.disconnect();
    };
  }, []);

  // room status
  useEffect(() => {
    if (localStream && websocketConnected && status === 'init') {
      setStatus('ready');
    }
  }, [localStream, websocketConnected]);

  // **important** - these callbacks needs to be reassigned when peerconnection changes
  useEffect(() => {
    if (localStream && userId.current && status === 'connected') {
      wsService.current?.on('join', handleJoin);
      wsService.current?.on('leave', handleLeave);
      wsService.current?.on('offer', handleOffer);
      wsService.current?.on('answer', handleAnswer);
      wsService.current?.on('icecandidate', handleIceCandidate);
    } else {
      wsService.current?.resetOnCallbacks();
    }
  }, [peers, localStream, status]);

  // create peer connection and send offer for the new user joining room
  const handleJoin = async (peerId: string) => {
    console.log(`${peerId} joined the room: `);
    const pc = createPeerConnection(peerId);
    await createOffer(pc, peerId);
  };

  // cleanup peer connection when user leaves the room
  const handleLeave = async (peerId: string) => {
    peers[peerId]?.peerConnection?.close();
    setPeers((prev) => {
      const copy = { ...prev };
      delete copy[peerId];
      return copy;
    });
    // setPeerStreams((prev) => {
    //   const copy = { ...prev };
    //   delete copy[peerId];
    //   return copy;
    // });
    console.log(`${peerId} left the room: `);
  };

  const createOffer = async (pc: RTCPeerConnection, receiver?: string) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsService?.current?.send({
        sender: userId.current!,
        receiver: receiver,
        type: 'offer',
        payload: offer,
      });
      console.log(`Client created offer for ${receiver}`);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (sender: string, offer: RTCSessionDescription) => {
    try {
      // create peer connection for the offer sender
      const pc = createPeerConnection(sender);
      // if (pc.iceConnectionState === 'connected') {
      //   return;
      // }
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsService?.current?.send({
        sender: userId.current!,
        receiver: sender,
        type: 'answer',
        payload: answer,
      });
      console.log(`Client answered offer for ${sender}`);
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const handleAnswer = async (
    sender: string,
    answer: RTCSessionDescription
  ) => {
    try {
      //  acknowledge the answer
      const pc = peers[sender]?.peerConnection;
      if (!pc) return;
      // if (pc.iceConnectionState === 'connected') {
      //   return;
      // }
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log(`Client acknowledged answer from ${sender}`);
    } catch (error) {
      console.error('Handle Answer - Error setting remote description:', error);
    }
  };

  const handleIceCandidate = async (
    sender: string,
    candidate: RTCIceCandidate
  ) => {
    try {
      const pc = peers[sender]?.peerConnection;
      if (!pc) return;
      await pc.addIceCandidate(candidate);
    } catch (e) {
      console.error('error adding ice candidate', e);
    }
  };

  const createPeerConnection = (peerId: string) => {
    if (peers[peerId]?.peerConnection) return peers[peerId]?.peerConnection;

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
      console.log(
        `${peerId} ICE connection state changed:`,
        pc.iceConnectionState
      );
    };

    pc.onicecandidate = (event) => {
      // console.log('New ICE candidateReceived');
      if (event.candidate) {
        wsService.current?.send({
          sender: userId.current!,
          receiver: peerId,
          type: 'icecandidate',
          payload: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setPeers((prev) => ({
        ...prev,
        [peerId]: { peerConnection: pc, stream },
      }));
    };

    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
    }

    setPeers((prev) => ({
      ...prev,
      [peerId]: { peerConnection: pc, stream: null },
    }));
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
    setStatus('ready');
    // setPeerStreams({});
    // setPeerConnections({});
    Object.entries(peers).forEach(([peerId, peer]) => {
      peer.peerConnection.close();
      peer.stream?.getTracks().forEach((track) => track.stop());
    });
    setPeers({});
  };

  return (
    <Flex direction={'column'} gap="md" className="flex">
      <Title order={1}>Welcome to {room}!</Title>

      {status === 'ready' && (
        <Center>
          <Title order={2}>Waiting Area... Click to Join</Title>
        </Center>
      )}

      <Flex
        gap="md"
        wrap={'wrap'}
        justify={'center'}
        align={'stretch'}
        className="flex"
      >
        <UserVideo
          mediaStream={localStream}
          userId={userId.current!}
          isSelf={true}
        />

        {Object.entries(peers).map(([peerId, { stream }]) => (
          <UserVideo
            key={peerId}
            mediaStream={stream}
            userId={peerId}
          ></UserVideo>
        ))}
      </Flex>

      <RoomControls
        roomStatus={status}
        localStream={localStream}
        peerConnections={peers}
        onJoinSquadCall={joinSquadCall}
        onLeaveSquadCall={leaveSquadCall}
        onLocalStreamUpdate={setLocalStream}
      ></RoomControls>
    </Flex>
  );
}

export default SquadRoom;
