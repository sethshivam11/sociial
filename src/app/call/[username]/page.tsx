"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatEventEnum, nameFallback } from "@/lib/helpers";
import { endCall } from "@/lib/store/features/slices/callSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Phone,
  RefreshCcw,
  Video,
  VideoOff,
} from "lucide-react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { socket } from "@/socket";
import usePeer from "@/context/PeerProvider";
import PermissionsRequired from "@/components/PermissionsRequired";
import ReactPlayer from "react-player";

function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { call } = useAppSelector((state) => state.call);
  const {
    peer,
    createAnswer,
    createOffer,
    closePeer,
    remoteStream,
    sendStream,
    setRemoteAnswer,
  } = usePeer();

  const callId = query.get("call");
  const profileId = query.get("profile");
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const selfVideoContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [selfMuted, setSelfMuted] = useState(false);
  const [selfVideoPaused, setSelfVideoPaused] = useState(false);
  const [hideSelfVideo, setHideSelfVideo] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeCamera, setActiveCamera] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [multipleCamAvailalble, setMultipleCamAvailable] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);
  const [permissions, setPermissions] = useState(true);
  const [sendingStream, setSendingStream] = useState(false);
  const [peerInfo, setPeerInfo] = useState({
    _id: "",
    fullName: "",
    username: "",
    avatar: "",
  });

  function switchCamera() {
    if (!multipleCamAvailalble) return;

    stopCamera();
    if (activeCamera === "user") {
      getUserMedia(true, "environment");
    } else {
      getUserMedia(true, "user");
    }
  }
  function handleSelfVideoPause() {
    if (!selfVideoRef.current) return;
    if (selfVideoPaused) {
      selfVideoRef.current.srcObject = stream;
      setSelfVideoPaused(false);
    } else {
      selfVideoRef.current.srcObject = null;
      setSelfVideoPaused(true);
    }
  }
  const getUserMedia = useCallback(
    async (video: boolean, mode?: "user" | "environment") => {
      try {
        const videoMode = video
          ? { facingMode: { exact: mode || "user" } }
          : false;
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoMode,
          audio: true,
        });
        setStream(mediaStream);
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = mediaStream;
        }
        const capabilties = mediaStream
          ?.getTracks()
          .filter(({ kind }) => kind === "video")[0]
          .getCapabilities();
        if (capabilties?.facingMode) {
          setActiveCamera(capabilties?.facingMode[0]);
        }
        await navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            if (
              devices.filter(({ kind }) => kind === "videoinput").length > 1
            ) {
              setMultipleCamAvailable(true);
            }
          })
          .catch((err) => console.log(err));

        return () => {
          stopCamera();
        };
      } catch (error) {
        console.log(error);
        setPermissions(false);
      }
    },
    []
  );
  const startCall = useCallback(async () => {
    if (!peer) return;
    const offer = await createOffer();
    socket.emit(ChatEventEnum.CALL_HANDSHAKE_EVENT, {
      userId: user._id !== call.caller._id ? call.caller._id : call.callee._id,
      offer,
    });
  }, [peer, socket, createOffer]);
  const acceptCall = useCallback(
    async (offer: RTCSessionDescription) => {
      const ans = await createAnswer(offer);
      socket.emit(ChatEventEnum.CALL_ACCEPTED_EVENT, {
        userId:
          user._id !== call.caller._id ? call.caller._id : call.callee._id,
        answer: ans,
      });
    },
    [createAnswer, socket]
  );
  const handleCallAccepted = useCallback(
    async (answer: RTCSessionDescription) => {
      try {
        if (!peer) return;
        await peer.setRemoteDescription(answer);
      } catch (error) {
        console.error("Failed to set remote description:", error);
      }
    },
    [setRemoteAnswer, stream]
  );
  const handleNegotiation = useCallback(async () => {
    if (!peer) return;
    const localOffer = await peer.createOffer();
    await peer.setLocalDescription(localOffer);
    socket.emit(ChatEventEnum.CALL_HANDSHAKE_EVENT, {
      userId: user._id !== call.callee._id ? call.callee._id : call.caller._id,
      offer: localOffer,
    });
    if (stream && !sendingStream) sendStream(stream);
    else console.log("No stream to send");
  }, [stream, peer, socket, sendStream, sendingStream]);
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    } else console.log("no stream to stop camera", stream);
    if (selfVideoRef.current) selfVideoRef.current.srcObject = null;
  }, [stream, selfVideoRef]);
  function handleCallEnd(unpicked?: boolean) {
    dispatch(endCall(call._id)).then((response) => {
      if (response.payload?.success) {
        stopCamera();
        closePeer();
        const username =
          call.caller._id !== user._id
            ? call.caller.username
            : call.callee.username;
        router.push(
          unpicked
            ? `/call/unpicked?username=${username}`
            : `/call/ended?username=${username}`
        );
      }
    });
  }
  function handleCallEnded() {
    stopCamera();
    closePeer();
    const username =
      call.caller._id !== user._id
        ? call.caller.username
        : call.callee.username;
    router.push(`/call/ended?username=${username}`);
  }

  useEffect(() => {
    if (!selfVideoContainerRef.current) return;
    if (hideSelfVideo) {
      selfVideoContainerRef.current.classList.add(
        "lg:translate-x-[370px]",
        "sm:translate-x-56"
      );
    } else {
      selfVideoContainerRef.current.classList.remove(
        "lg:translate-x-[370px]",
        "sm:translate-x-56"
      );
    }
  }, [hideSelfVideo]);
  useEffect(() => {
    if (query.get("video") === "true") {
      setIsVideoCall(true);
      getUserMedia(true);
    } else {
      setIsVideoCall(false);
      setSelfVideoPaused(true);
      getUserMedia(false);
    }
    if (call.caller._id === user._id) {
      timerRef.current = setTimeout(() => {
        handleCallEnd(true);
      }, 30000);
    }
  }, [getUserMedia, query]);
  useEffect(() => {
    if (profileId) {
      setPeerInfo(call.caller._id === profileId ? call.caller : call.callee);
    }
    if (!call._id) {
      setNotFoundError(true);
    }
  }, [dispatch, params]);
  useEffect(() => {
    if (!peer) return;
    peer.addEventListener("negotiationneeded", handleNegotiation);

    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [peer]);
  useEffect(() => {
    if (callId) {
      startCall();
    }
  }, [callId, startCall]);
  useEffect(() => {
    socket.on(ChatEventEnum.CALL_HANDSHAKE_EVENT, acceptCall);
    socket.on(ChatEventEnum.CALL_ACCEPTED_EVENT, handleCallAccepted);
    socket.on(ChatEventEnum.CALL_DISCONNECTED_EVENT, handleCallEnded);

    return () => {
      socket.off(ChatEventEnum.CALL_HANDSHAKE_EVENT, acceptCall);
      socket.off(ChatEventEnum.CALL_ACCEPTED_EVENT, handleCallAccepted);
      socket.off(ChatEventEnum.CALL_DISCONNECTED_EVENT, handleCallEnded);
    };
  }, [socket]);
  useEffect(() => {
    if (remoteStream && stream && !sendingStream) {
      sendStream(stream);
      setSendingStream(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  }, [remoteStream, stream, sendingStream]);

  if (notFoundError) {
    notFound();
  } else if (!sendingStream && callId) {
    return (
      <div className="col-span-10 flex items-center justify-center min-h-[100dvh] max-h-[100dvh] bg-black overflow-hidden relative">
        <div className="grid lg:grid-cols-3 min-w-3/4">
          <ReactPlayer
            className="w-full max-sm:h-full max-md:hidden bg-stone-800 sm:object-contain object-cover lg:col-span-2 min-h-96 react-player"
            url={stream || ""}
            config={{ file: { attributes: { playsinline: true } } }}
            playing
            autoPlay
            muted
            playsInline
            width="100%"
            height="100%"
          />
          <div className="flex flex-col justify-center items-center gap-4 bg-stone-200 dark:bg-stone-800 py-10 max-md:h-[30rem] max-md:w-96 max-md:rounded-xl">
            <Avatar className="sm:w-40 w-32 sm:h-40 h-32 object-contain select-none pointer-events-none">
              <AvatarImage src={peerInfo.avatar} />
              <AvatarFallback className="bg-stone-800">
                {nameFallback(peerInfo.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center gap-0">
              <h1 className="text-2xl tracking-tight font-bold">
                {peerInfo.fullName}
              </h1>
              <p className="text-stone-500 text-lg">@{peerInfo.username}</p>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
              disabled={sendingStream && !stream}
              onClick={() => {
                if (stream) {
                  sendStream(stream);
                  setSendingStream(true);
                } else console.log("No stream to send");
              }}
            >
              Join Call
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (!permissions) {
    return <PermissionsRequired />;
  } else {
    return (
      <div className="col-span-10 flex flex-col items-center justify-center min-h-[100dvh] max-h-[100dvh] bg-black overflow-hidden relative">
        {isVideoCall ? (
          <ReactPlayer
            playing
            config={{ file: { attributes: { playsinline: true } } }}
            url={remoteStream || ""}
            className="w-full h-full max-sm:h-1/2 sm:object-contain object-cover relative overflow-hidden react-player height-50-sm"
            playsInline
            width="100%"
            height="100%"
          />
        ) : (
          <>
            <Avatar className="sm:w-40 w-32 sm:h-40 h-32 object-contain select-none pointer-events-none">
              <AvatarImage src={peerInfo.avatar} />
              <AvatarFallback className="bg-stone-800">
                {nameFallback(peerInfo.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center gap-0">
              <h1 className="text-2xl tracking-tight font-bold">
                {peerInfo.fullName}
              </h1>
              <p className="text-stone-500 text-lg">@{peerInfo.username}</p>
            </div>
          </>
        )}
        <div className="flex items-center justify-center gap-4 absolute bottom-10 z-10">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full p-3 h-fit w-fit shadow-xl ${
              multipleCamAvailalble ? "" : "hidden"
            }`}
            onClick={switchCamera}
          >
            <RefreshCcw size="30" />
          </Button>
          {isVideoCall && (
            <Button
              size="icon"
              variant="secondary"
              className={`rounded-full p-3 w-fit h-fit shadow-xl ${
                selfVideoPaused
                  ? "bg-stone-200 sm:hover:bg-stone-400 text-black"
                  : ""
              }`}
              onClick={handleSelfVideoPause}
            >
              {selfVideoPaused ? <VideoOff size="30" /> : <Video size="30" />}
            </Button>
          )}
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full p-3 w-fit h-fit shadow-xl ${
              selfMuted ? "bg-stone-200 sm:hover:bg-stone-400 text-black" : ""
            }`}
            onClick={() => setSelfMuted((prevMuted) => !prevMuted)}
          >
            {selfMuted ? <MicOff size="30" /> : <Mic size="30" />}
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full p-3 w-fit h-fit shadow-xl"
            onClick={() => handleCallEnd()}
          >
            <Phone size="30" className="rotate-[135deg]" />
          </Button>
        </div>
        <div
          className={`flex items-center justify-center lg:w-96 lg:h-72 sm:w-60 sm:h-44 w-full max-lg:top-4 lg:bottom-4 right-4 sm:shadow-lg sm:rounded-xl sm:absolute transition-transform max-sm:h-1/2 overflow-hidden ${
            isVideoCall ? "visible bg-black" : "invisible bg-transparent"
          }`}
          ref={selfVideoContainerRef}
        >
          <button
            className="hover:scale-110 p-2 left-0 absolute z-10 max-sm:hidden"
            onClick={() => setHideSelfVideo((prevHidden) => !prevHidden)}
          >
            {hideSelfVideo ? (
              <ChevronLeft size="30" />
            ) : (
              <ChevronRight size="30" />
            )}
          </button>
          <ReactPlayer
            className="w-full bg-black sm:object-contain object-cover overflow-hidden react-player height-100-sm"
            height="100%"
            width="100%"
            url={stream || ""}
            config={{ file: { attributes: { playsInline: true } } }}
            playing
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>
    );
  }
}

export default Page;
