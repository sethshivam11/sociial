"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSocket } from "@/context/SocketProvider";
import { ChatEventEnum, nameFallback } from "@/lib/helpers";
import { endCall, updateCall } from "@/lib/store/features/slices/callSlice";
import { getProfile } from "@/lib/store/features/slices/userSlice";
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
import Peer, { SignalData } from "simple-peer";

function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const { user, profile } = useAppSelector((state) => state.user);
  const { call } = useAppSelector((state) => state.call);
  const { onlineUsers } = useSocket();

  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const selfVideoContainerRef = useRef<HTMLDivElement>(null);

  const [selfMuted, setSelfMuted] = useState(false);
  const [selfVideoPaused, setSelfVideoPaused] = useState(false);
  const [hideSelfVideo, setHideSelfVideo] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeCamera, setActiveCamera] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [multipleCamAvailalble, setMultipleCamAvailable] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [caller, setCaller] = useState<{
    userId: string;
    signal: SignalData;
  }>();

  function handleCallEnd() {
    dispatch(endCall(call._id)).then((response) => {
      if (response.payload?.success) {
        stopCamera();
        router.push(`/call/ended?username=${user.username}`);
      } else {
        toast({
          title: "Cannot end call",
          description: response.payload?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  }
  function switchCamera() {
    if (!multipleCamAvailalble) return;

    stopCamera();
    console.log(activeCamera);
    if (activeCamera === "user") {
      getUserMedia(true, "environment");
    } else {
      getUserMedia(true, "user");
    }
  }
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    if (selfVideoRef.current) selfVideoRef.current.srcObject = null;
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
  const callPeer = useCallback(
    (userId: string) => {
      if (!stream) return;
      console.log("Calling user");
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (data: SignalData) => {
        socket.emit(ChatEventEnum.CALL_HANDSHAKE_EVENT, {
          from: user._id,
          to: userId,
          data,
        });
      });

      peer.on("stream", (stream) => {
        if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
      });

      socket.on(ChatEventEnum.CALL_ACCEPTED_EVENT, ({ data }) => {
        setCallActive(true);
        peer.signal(data);
      });
    },
    [stream]
  );
  const acceptCall = useCallback(
    (userId: string, signal?: SignalData) => {
      if (!stream) return console.log("No stream available");
      console.log("Accepting call");
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (data: SignalData) => {
        console.log(data);
        socket.emit(ChatEventEnum.CALL_ACCEPTED_EVENT, {
          userId,
          data,
        });
      });

      peer.on("stream", (stream) => {
        if (peerVideoRef.current) peerVideoRef.current.srcObject = stream;
        dispatch(updateCall({ callId: call._id, acceptedAt: `${new Date()}` }));
        if (!query.get("profile")) {
          callPeer(userId);
          router.push(
            `/call/${user.username}?video=${isVideoCall}&profile=${userId}`
          );
        }
      });

      console.log(signal, caller);
      if (signal) peer.signal(signal);
      else if (caller) peer.signal(caller.signal);
      else console.log("Unable to connect: No signal recieved");
    },
    [stream, caller]
  );

  const getUserMedia = useCallback(
    async (video: boolean, mode?: "user" | "environment") => {
      const videoMode = video
        ? { facingMode: { exact: mode || "user" } }
        : false;
      await navigator.mediaDevices
        .getUserMedia({
          video: videoMode,
          audio: true,
        })
        .then((stream) => {
          setStream(stream);
          if (!selfVideoRef.current || !peerVideoRef.current) return;
          selfVideoRef.current.srcObject = stream;
          const capabilties = stream
            ?.getTracks()
            .filter(({ kind }) => kind === "video")[0]
            .getCapabilities();
          if (capabilties?.facingMode) {
            setActiveCamera(capabilties?.facingMode[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      await navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          if (devices.filter(({ kind }) => kind === "videoinput").length > 1) {
            setMultipleCamAvailable(true);
          }
        })
        .catch((err) => console.log(err));

      return () => {
        stopCamera();
      };
    },
    []
  );

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
  }, [getUserMedia, query]);
  useEffect(() => {
    if (!profile?._id) {
      dispatch(getProfile({ username: params.username })).then((response) => {
        if (!response.payload?.success) {
          setNotFoundError(true);
        }
      });
    }
    if (!call._id) {
      setNotFoundError(true);
    }
  }, [dispatch, profile?._id, params]);
  useEffect(() => {
    const userId = query.get("profile");
    console.log(stream, userId);
    if (stream && userId) {
      callPeer(userId);
    }
  }, [stream, query.get("profile")]);
  useEffect(() => {
    function handleHandshake({
      data,
      from,
    }: {
      data: SignalData;
      from: string;
    }) {
      setCaller({ userId: from, signal: data });
      console.log("Recieved signal", data);
    }

    socket.on(ChatEventEnum.CALL_HANDSHAKE_EVENT, handleHandshake);

    return () => {
      socket.off(ChatEventEnum.CALL_HANDSHAKE_EVENT, handleHandshake);
    };
  }, []);
  useEffect(() => {
    if (stream && caller?.userId && caller?.signal)
      acceptCall(caller.userId, caller.signal);
  }, [stream, caller]);

  if (notFoundError) {
    notFound();
  }

  return (
    <div className="col-span-10 flex flex-col items-center justify-center min-h-[100dvh] max-h-[100dvh] bg-black overflow-hidden relative">
      <div className="flex flex-col gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <Button onClick={() => callPeer(call.caller._id)}>Call caller</Button>
        <Button onClick={() => callPeer(call.callee._id)}>Call callee</Button>
        <Button onClick={() => acceptCall(call.callee._id)}>
          Accept callee
        </Button>
        <Button onClick={() => acceptCall(call.caller._id)}>
          Accept caller
        </Button>
      </div>
      {isVideoCall ? (
        <video
          className="w-full h-full max-sm:h-1/2 sm:object-contain object-cover"
          ref={peerVideoRef}
          autoPlay
          playsInline
        />
      ) : (
        <>
          <Avatar className="sm:w-40 w-32 sm:h-40 h-32 object-contain select-none pointer-events-none">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-stone-800">
              {nameFallback(profile.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center gap-0">
            <h1 className="text-2xl tracking-tight font-bold">
              {profile.fullName}
            </h1>
            <h6 className="text-stone-500 text-lg">@{profile.username}</h6>
          </div>
          {callActive ? (
            <p className="text-stone-500">
              {/* {new Date(timer * 1000).toLocaleTimeString("en-IN")} */}
            </p>
          ) : (
            <p className="text-stone-500 animate-pulse">
              {onlineUsers.includes(profile._id) ? "Calling..." : "Ringing..."}
            </p>
          )}
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
          onClick={handleCallEnd}
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
        <video
          className="w-full max-sm:h-full bg-black sm:object-contain object-cover sm:rounded-xl"
          ref={selfVideoRef}
          autoPlay
          muted
          playsInline
        />
      </div>
    </div>
  );
}

export default Page;
