import { useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';

export function SquadRoom() {
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const ws = useRef<WebSocket | null>(null);

  // Local Video Feed
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initLocalStream();

    // Cleanup
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Peer Connection
  useEffect(() => {
    if (peerConnection && localStream) {
      startWsConnection();
    }
  }, [peerConnection, localStream]);

  const startWsConnection = () => {
    ws.current = new WebSocket('ws://localhost:8000/ws/testing-room/');

    ws.current.onopen = async () => {
      console.log('WebSocket connection opened');
      await createOffer();
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      console.log('WebSocket message received:', type);
      switch (type) {
        case 'offer':
          await createAnswer(data.payload);
          break;
        case 'answer':
          await handleAnswer(data.payload);
          break;
        case 'icecandidate':
          await handleIceCandidate(data.payload);
          break;
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const createPeerConnection = () => {
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
        ws.current?.send(
          JSON.stringify({ type: 'icecandidate', payload: event.candidate })
        );
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

    setPeerConnection(pc);
    console.log('Peer connection created');
  };

  const createOffer = async () => {
    try {
      const offer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(offer);
      ws?.current?.send(JSON.stringify({ type: 'offer', payload: offer }));
      console.log('Offer created');
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const createAnswer = async (offer: RTCSessionDescription) => {
    try {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection?.createAnswer();
      await peerConnection?.setLocalDescription(answer);
      ws?.current?.send(JSON.stringify({ type: 'answer', payload: answer }));
      console.log('Answer created');
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescription) => {
    try {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      console.log('Answer received');
    } catch (error) {
      console.error('Handle Answer - Error setting remote description:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      await peerConnection?.addIceCandidate(candidate);
    } catch (e) {
      console.error('error adding ice candidate', e);
    }
  };

  const joinSquadRoom = async () => {
    if (!peerConnection) {
      createPeerConnection();
      return;
    }
  };

  return (
    <div>
      <h1>Squad Room</h1>
      <div>
        <video ref={localVideo} autoPlay muted playsInline />
        <video ref={remoteVideo} autoPlay playsInline />
      </div>
      <button onClick={joinSquadRoom}>Join Squad Room</button>
    </div>
  );
}

export default SquadRoom;
