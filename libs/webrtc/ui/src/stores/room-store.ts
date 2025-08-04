import { create } from 'zustand';
import WebsocketService from '../lib/services/websocket-service';

type RoomState = {
  userId: string | null;
  roomStatus: 'init' | 'ready' | 'connected';
  localStream: MediaStream | null;
  wsService: WebsocketService | null;
  peerConnections: { [peerId: string]: RTCPeerConnection };
  peerStreams: { [peerId: string]: MediaStream };
};

type RoomStateActions = {
  setLocalStream: (stream: MediaStream, replacePeerStream?: boolean) => void;
  onPeerJoin: (peerId: string) => Promise<void>;
  onPeerLeave: (peerId: string) => void;
  onPeerOffer: (peerId: string, offer: RTCSessionDescription) => Promise<void>;
  onPeerAnswer: (
    peerId: string,
    answer: RTCSessionDescription
  ) => Promise<void>;
  onPeerIceCandidate: (
    peerId: string,
    candidate: RTCIceCandidate
  ) => Promise<void>;
  cleanUp: () => void;
};

const initialRoomState: RoomState = {
  userId: null,
  roomStatus: 'init',
  localStream: null,
  wsService: null,
  peerConnections: {},
  peerStreams: {},
};

export const useRoomStore = create<RoomState & RoomStateActions>((set, get) => {
  const createPeerConnection = (peerId: string) => {
    const { userId, peerConnections, wsService } = get();

    if (userId === null) throw new Error('User ID is not initialized');

    if (wsService === null)
      throw new Error('Websocket service is not initialized');

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

    addLocalStreamToPeer(pc);

    registerPeerStream(pc, peerId);

    pc.oniceconnectionstatechange = () => {
      console.log(
        `${peerId} ICE connection state changed:`,
        pc.iceConnectionState
      );
    };

    pc.onicecandidate = (event) => {
      console.log('ICE Candidate:', event.candidate);
      if (event.candidate) {
        wsService.send({
          sender: userId,
          receiver: peerId,
          type: 'icecandidate',
          payload: event.candidate,
        });
      }
    };

    console.log('Peer connection created', peerId);
    set({ peerConnections: { ...peerConnections, [peerId]: pc } });
    return pc;
  };

  const addLocalStreamToPeer = (pc: RTCPeerConnection) => {
    const { localStream } = get();
    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
    }
  };

  const registerPeerStream = (pc: RTCPeerConnection, peerId: string) => {
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      const { peerStreams } = get();
      console.log('Peer stream added', peerId);
      set({ peerStreams: { ...peerStreams, [peerId]: stream } });
      console.log(
        'peer count',
        Object.keys(useRoomStore.getState().peerStreams).length
      );
    };
  };

  const replacePeerStream = (stream: MediaStream) => {
    const { peerConnections } = get();
    Object.values(peerConnections).forEach((pc) => {
      if (pc.signalingState === 'closed') return;
      stream.getTracks().forEach((track) => {
        const sender = pc
          .getSenders()
          .find((sender) => sender.track?.kind === track.kind);
        sender?.replaceTrack(track);
      });
    });
  };

  const createOffer = async (pc: RTCPeerConnection, receiver?: string) => {
    const { userId, wsService } = get();
    if (userId === null) throw new Error('User ID is not initialized');
    if (wsService === null)
      throw new Error('Websocket service is not initialized');
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsService.send({
        sender: userId,
        receiver: receiver,
        type: 'offer',
        payload: offer,
      });
      console.log(`Client created offer for ${receiver}`);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (
    pc: RTCPeerConnection,
    peerId: string,
    offer: RTCSessionDescription
  ) => {
    const { wsService, userId } = get();
    if (userId === null) throw new Error('User ID is not initialized');
    if (wsService === null)
      throw new Error('Websocket service is not initialized');
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsService.send({
        sender: userId,
        receiver: peerId,
        type: 'answer',
        payload: answer,
      });
      console.log(`Client answered offer for ${peerId}`);
      return pc;
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  return {
    ...initialRoomState,
    setLocalStream: (stream: MediaStream, replacePeer?: boolean) => {
      if (replacePeer) {
        replacePeerStream(stream);
      }
      set({ localStream: stream });
    },
    onPeerJoin: async (peerId: string) => {
      const pc = createPeerConnection(peerId);
      await createOffer(pc, peerId);
    },
    onPeerLeave: (peerId: string) => {
      const { peerConnections, peerStreams } = get();
      const pc = peerConnections[peerId];
      if (pc) pc.close();
      const streamsCopy = { ...peerStreams };
      const peersCopy = { ...peerConnections };
      delete streamsCopy[peerId];
      delete peersCopy[peerId];
      set({
        peerConnections: peersCopy,
        peerStreams: streamsCopy,
      });
    },
    onPeerOffer: async (peerId: string, offer: RTCSessionDescription) => {
      const pc = createPeerConnection(peerId);
      await handleOffer(pc, peerId, offer);
    },
    onPeerAnswer: async (peerId: string, answer: RTCSessionDescription) => {
      const { peerConnections } = get();
      try {
        //  acknowledge the answer
        const pc = peerConnections[peerId];
        if (!pc) {
          console.error(
            'not able to acknowledge answer, peer connection not found'
          );
          return;
        }
        // if (pc.iceConnectionState === 'connected') {
        //   return;
        // }
        if (!pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log(`Client acknowledged answer from ${peerId}`);
        }
      } catch (error) {
        console.error(
          'Handle Answer - Error setting remote description:',
          error
        );
      }
    },
    onPeerIceCandidate: async (peerId: string, candidate: RTCIceCandidate) => {
      const { peerConnections } = get();
      try {
        const pc = peerConnections[peerId];
        if (!pc) {
          console.error(
            'not able to add ice candidate, peer connection not found'
          );
          return;
        }
        await pc.addIceCandidate(candidate);
        console.log(`Client added ice candidate from ${peerId}`);
      } catch (e) {
        console.error('error adding ice candidate', e);
      }
    },
    cleanUp: () => {
      const { peerConnections, localStream, wsService } = get();
      Object.values(peerConnections).forEach((pc) => {
        pc.close();
      });
      if (localStream) {
        console.log('stopping local stream');
        localStream?.getTracks().forEach((track) => track.stop());
      }
      if (wsService) {
        wsService.disconnect();
      }

      set(initialRoomState);
    },
  };
});
