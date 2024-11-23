"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface InitialStateI {
  peer: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  createAnswer: (
    offer: RTCSessionDescription
  ) => Promise<RTCSessionDescriptionInit | null>;
  setRemoteAnswer: (answer: RTCSessionDescriptionInit) => void;
  sendStream: (stream: MediaStream) => void;
  remoteStream: MediaStream | null;
  closePeer: () => void;
}

const initialState: InitialStateI = {
  peer: null,
  createOffer: async () => null,
  createAnswer: async (_) => null,
  setRemoteAnswer: () => {},
  sendStream: () => {},
  remoteStream: null,
  closePeer: () => {},
};

const PeerContext = createContext(initialState);

export const PeerProvider = ({ children }: { children: ReactNode }) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const createOffer = async () => {
    if (!peer) return null;
    const offer = await peer.createOffer();
    await peer?.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (!peer) return null;
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peer) return;
    await peer.setRemoteDescription(answer);
  };

  const sendStream = (stream: MediaStream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      const sender = peer?.getSenders().find((s) => s.track === track);
      if (!sender) {
        peer?.addTrack(track, stream);
      }
    }
  };

  const handleTrackEvent = useCallback((event: RTCTrackEvent) => {
    const streams = event.streams;
    setRemoteStream(streams[0]);
  }, []);

  const closePeer = () => {
    if (!peer) return;
    peer.close();
  };

  useEffect(() => {
    if (!peer) return;
    peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [handleTrackEvent]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        sendStream,
        remoteStream,
        closePeer,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

const usePeer = () => useContext(PeerContext);

export default usePeer;
