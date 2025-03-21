import { useEffect, useRef, useState } from 'react';
import styles from './squad-room.module.scss';

export function SquadRoom() {
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

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
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
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
  };

  const joinSquadRoom = async () => {
    if (!peerConnection) {
      createPeerConnection();
    }

    try {
      const offer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(offer);

      console.log('Offer:', offer);
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
