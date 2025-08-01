import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';
import WebsocketService from '../services/websocket-service';
import { Center, Flex, Grid, Title } from '@mantine/core';
import { useParams, useSearchParams } from 'react-router-dom';
import UserVideo from '../user-video/user-video';
import RoomControls from '../room-controls/room-controls';
import { EnvironmentContext } from '@JC/shared/context';
import { useRoomStore } from '../../stores/room-store';
import { useAppStore } from '@JC/shared/store';

export function SquadRoom() {
  const { room } = useParams(); // Get the room parameter from the URL
  const [searchParams] = useSearchParams();
  const env = useContext(EnvironmentContext);

  const wsServiceRef = useRef<WebsocketService | null>(null);

  const [websocketConnected, setWebsocketConnected] = useState(false);

  const userId = useRoomStore((state) => state.userId);
  const wsService = useRoomStore((state) => state.wsService);
  const peerStreams = useRoomStore((state) => state.peerStreams);
  const localStream = useRoomStore((state) => state.localStream);
  const roomStatus = useRoomStore((state) => state.roomStatus);
  const onPeerJoin = useRoomStore((state) => state.onPeerJoin);
  const onPeerLeave = useRoomStore((state) => state.onPeerLeave);
  const onPeerOffer = useRoomStore((state) => state.onPeerOffer);
  const onPeerAnswer = useRoomStore((state) => state.onPeerAnswer);
  const onPeerIceCandidate = useRoomStore((state) => state.onPeerIceCandidate);
  const cleanup = useRoomStore((state) => state.cleanUp);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  if (wsServiceRef.current === null && env?.apiDomain) {
    let displayName = searchParams.get('name');
    if (!displayName) displayName = user.displayName;
    if (displayName && displayName !== user.displayName) {
      const updateUser = { ...user, displayName: displayName };
      localStorage.setItem('user', JSON.stringify(updateUser));
      setUser(updateUser);
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    wsServiceRef.current = new WebsocketService(
      `${protocol}://${env?.apiDomain}/ws/squad-connect/${room}/${user.id}/?displayName=${displayName}`
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

      const startTime = performance.now();

      for (const config of constraints) {
        try {
          console.log('Trying to get user media with constraints', config);
          const stream = await navigator.mediaDevices.getUserMedia(config);
          useRoomStore.setState({ localStream: stream });

          const endTime = performance.now();

          const elapsedTime = endTime - startTime;
          console.log(`Time taken to get camera feed: ${elapsedTime}ms`);
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

    useRoomStore.setState({ userId: user.id });
    useRoomStore.setState({ wsService: wsServiceRef.current });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // websocket connection
  useEffect(() => {
    if (!wsService) return;
    wsService.onOpen(() => {
      setWebsocketConnected(true);
    });
    wsService.connect();
  }, [wsService]);

  // room status
  useEffect(() => {
    if (localStream && websocketConnected && roomStatus === 'init') {
      useRoomStore.setState({ roomStatus: 'ready' });
    }
  }, [localStream, websocketConnected, roomStatus]);

  useEffect(() => {
    if (!wsService) return;
    if (roomStatus === 'connected') {
      const handleJoin = async (peerId: string) => {
        console.log(`${peerId} joined the room: `);
        await onPeerJoin(peerId);
      };

      const handleLeave = (peerId: string) => {
        onPeerLeave(peerId);
        console.log(`${peerId} left the room: `);
      };

      const handleOffer = async (
        sender: string,
        offer: RTCSessionDescription
      ) => {
        onPeerOffer(sender, offer);
      };

      const handleAnswer = async (
        sender: string,
        answer: RTCSessionDescription
      ) => {
        onPeerAnswer(sender, answer);
      };

      const handleIceCandidate = async (
        sender: string,
        candidate: RTCIceCandidate
      ) => {
        onPeerIceCandidate(sender, candidate);
      };

      wsService.on('join', handleJoin);
      wsService.on('leave', handleLeave);
      wsService.on('offer', handleOffer);
      wsService.on('answer', handleAnswer);
      wsService.on('icecandidate', handleIceCandidate);
    } else {
      wsServiceRef.current?.resetOnCallbacks();
    }
  }, [
    roomStatus,
    wsService,
    onPeerJoin,
    onPeerLeave,
    onPeerOffer,
    onPeerAnswer,
    onPeerIceCandidate,
  ]);

  const joinSquadCall = useCallback(async () => {
    if (!userId || !wsService) return;
    wsService.send({
      sender: userId,
      type: 'join',
      payload: { type: 'join', payload: { userId: user.id } },
    });
    useRoomStore.setState({ roomStatus: 'connected' });
  }, [wsService, userId]);

  const leaveSquadCall = useCallback(async () => {
    if (!userId || !wsService) return;
    wsService.send({
      sender: userId,
      type: 'leave',
      payload: { type: 'leave', payload: { userId: user.id } },
    });
    useRoomStore.setState({
      roomStatus: 'ready',
      peerStreams: {},
      peerConnections: {},
    });
  }, [wsService, userId]);

  const getColSpan = (index: number) => {
    const totalLength = Object.keys(peerStreams).length + 1;
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

      {roomStatus === 'ready' && (
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
          <UserVideo mediaStream={localStream} userId={userId!} isSelf={true} />
        </Grid.Col>
        {Object.keys(peerStreams).map((peerId, index) => (
          <Grid.Col key={peerId} span={getColSpan(index + 1)} className="flex">
            <UserVideo
              mediaStream={peerStreams[peerId]}
              userId={peerId}
            ></UserVideo>
          </Grid.Col>
        ))}
      </Grid>

      <RoomControls
        onJoinSquadCall={joinSquadCall}
        onLeaveSquadCall={leaveSquadCall}
      ></RoomControls>
    </Flex>
  );
}

export default SquadRoom;
