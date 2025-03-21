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
    if (!peerConnection) {
      createPeerConnection();
    }
  }, []);

  const startWsConnection = () => {
    ws.current = new WebSocket('ws://localhost:8000/ws/testing-room/');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      switch (type) {
        case 'offer':
          if (!peerConnection) {
            createPeerConnection();
          }
          if (peerConnection) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.payload)
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            ws?.current?.send(
              JSON.stringify({ type: 'answer', payload: answer })
            );
          }
          break;
        case 'answer':
          if (peerConnection) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.payload)
            );
          }
          break;
        case 'icecandidate':
          if (peerConnection) {
            try {
              await peerConnection.addIceCandidate(data.payload);
            } catch (e) {
              console.error('error adding ice candidate', e);
            }
          }
          break;
      }
      console.log('WebSocket message received:', event.data);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
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

  const joinSquadRoom = async () => {
    if (!peerConnection) {
      return;
    }

    startWsConnection();

    try {
      const offer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(offer);

      ws?.current?.send(JSON.stringify({ type: 'offer', payload: offer }));

      console.log('Offer sent successfully');
    } catch (error) {
      console.error('Error creating offer:', error);
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
