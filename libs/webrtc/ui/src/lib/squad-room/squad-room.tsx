import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';
import WebsocketService from '../services/websocket-service';
import { Button, Center, Flex, Grid, Title } from '@mantine/core';
import { useParams, useSearchParams } from 'react-router-dom';
import UserVideo from '../user-video/user-video';
import RoomControls from '../room-controls/room-controls';
import { EnvironmentContext } from '@JC/shared/context';

export function SquadRoom() {
  const { room } = useParams(); // Get the room parameter from the URL
  const [searchParams] = useSearchParams();
  const env = useContext(EnvironmentContext);

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

  if (wsService.current === null && env?.apiDomain) {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    wsService.current = new WebsocketService(
      `${protocol}://${env?.apiDomain}/ws/squad-connect/${room}/${userId.current}/`
    );
  }

  useEffect(() => {
    // Local Video Feed
    const getOptimizedStream = async () => {
      const constraints = [
        {
          video: {
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 },
          },
          audio: true,
        },
        {
          video: true,
          audio: true,
        },
      ];

      for (const config of constraints) {
        try {
          console.log('Trying to get user media with constraints', config);
          const stream = await navigator.mediaDevices.getUserMedia(config);
          setLocalStream(stream);
          break;
        } catch (err) {
          console.warn(`Failed to get user media with constraints`, err);
        }
      }
    };
    if (!localStream) {
      console.log('Init local stream');
      getOptimizedStream();
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
      if (!pc.currentRemoteDescription) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log(`Client acknowledged answer from ${sender}`);
      }
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

  const joinSquadCall = useCallback(async () => {
    wsService?.current?.send({
      sender: userId.current!,
      type: 'join',
      payload: { type: 'join', payload: { userId: userId.current } },
    });
    setStatus('connected');
  }, [wsService, userId]);

  const leaveSquadCall = useCallback(async () => {
    wsService?.current?.send({
      sender: userId.current!,
      type: 'leave',
      payload: { type: 'leave', payload: { userId: userId.current } },
    });
    setStatus('ready');
    Object.entries(peers).forEach(([peerId, peer]) => {
      peer.peerConnection.close();
      peer.stream?.getTracks().forEach((track) => track.stop());
    });
    setPeers({});
  }, [wsService, userId, peers]);

  const getColSpan = (index: number) => {
    const totalLength = Object.keys(peers).length + 1;
    switch (true) {
      case totalLength < 4:
        return 12 / totalLength;
      case totalLength === 4:
        return 6;
      case totalLength === 5:
        if (index < 2) {
          return 6;
        } else {
          return 4;
        }
      case totalLength === 6:
        return 4;
      case totalLength === 7:
        if (index < 3) {
          return 4;
        }
        return 3;
      case totalLength === 8:
        return 3;
      default:
        return 4;
    }
  };

  return (
    <Flex
      direction={'column'}
      gap="md"
      className="flex"
      style={{ position: 'relative' }}
    >
      <Title order={1}>Welcome to {room}!</Title>

      {status === 'ready' && (
        <Center>
          <Title order={2}>Waiting Area... Click to Join</Title>
        </Center>
      )}

      {/* <Flex
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
      </Flex> */}

      <Grid className="flex">
        <Grid.Col span={getColSpan(0)} className="flex">
          <UserVideo
            mediaStream={localStream}
            userId={userId.current!}
            isSelf={true}
          />
        </Grid.Col>
        {Object.keys(peers).map((peerId, index) => (
          <Grid.Col key={peerId} span={getColSpan(index + 1)} className="flex">
            <UserVideo
              mediaStream={peers[peerId].stream}
              userId={peerId}
            ></UserVideo>
          </Grid.Col>
        ))}
      </Grid>

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
