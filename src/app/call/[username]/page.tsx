"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
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
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

function Page() {
  const router = useRouter();
  const query = useSearchParams();
  const user = {
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png",
    fullName: "Shivam Soni",
    username: "sethshivam",
  };
  const peerVideoRef = React.useRef<HTMLVideoElement>(null);
  const selfVideoRef = React.useRef<HTMLVideoElement>(null);
  const selfVideoContainerRef = React.useRef<HTMLDivElement>(null);
  const [selfMuted, setSelfMuted] = React.useState(false);
  const [selfVideoPaused, setSelfVideoPaused] = React.useState(false);
  const [hideSelfVideo, setHideSelfVideo] = React.useState(false);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [activeCamera, setActiveCamera] = React.useState("");
  const [isVideoCall, setIsVideoCall] = React.useState(false);
  const [multipleCamAvailalble, setMultipleCamAvailable] =
    React.useState(false);

  function handleCallEnd() {
    router.push(`/call/ended?username=${user.username}`);
  }

  function switchCamera() {
    console.log("Switching Camera");
  }

  function handleSelfVideoPause() {
    if (!isVideoCall) {
      setSelfVideoPaused(false);
      setIsVideoCall(true);
      return getUserMedia(true, { exact: "user" }, true);
    }
    if (!selfVideoRef.current) return;
    if (selfVideoPaused) {
      selfVideoRef.current.srcObject = stream;
      setSelfVideoPaused(false);
    } else {
      selfVideoRef.current.srcObject = null;
      setSelfVideoPaused(true);
    }
  }

  const getUserMedia = React.useCallback(
    async (
      video: boolean,
      facingMode?: { exact: "user" | "environment" },
      convertingToVideo?: boolean
    ) => {
      const videoMode = video
        ? { facingMode: facingMode ? facingMode : { exact: "user" } }
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
          peerVideoRef.current.srcObject = stream;
          const capabilties = stream.getTracks()[0].getCapabilities();
          if (capabilties.facingMode) {
            setActiveCamera(capabilties.facingMode[0]);
            console.log(capabilties.facingMode[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          if (convertingToVideo) {
            console.log("converting to video");
            toast({
              title: "Permission",
              description: "Please allow to enable video",
              variant: "destructive",
            });
            setIsVideoCall(false);
            setSelfVideoPaused(true);
          }
        });
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        if (devices.filter(({ kind }) => kind === "videoinput").length > 1) {
          setMultipleCamAvailable(true);
        }
      });
    },
    []
  );

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (query.get("video") === "true") {
      setIsVideoCall(true);
      getUserMedia(true);
    } else {
      setIsVideoCall(false);
      setSelfVideoPaused(true);
      getUserMedia(false);
    }
  }, []);

  return (
    <div className="col-span-10 flex flex-col items-center justify-center min-h-[100dvh] max-h-[100dvh] bg-black overflow-hidden relative">
      <video
        className="w-full h-full max-sm:h-1/2 sm:object-contain object-cover"
        ref={peerVideoRef}
        autoPlay
        playsInline
      />
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
        className={`flex items-center justify-center lg:w-96 lg:h-72 sm:w-60 sm:h-44 w-full max-lg:top-4 lg:bottom-4 right-4 sm:shadow-lg bg-black sm:border sm:border-stone-500 sm:rounded-xl sm:absolute transition-transform max-sm:h-1/2 ${
          isVideoCall ? "visible" : "invisible"
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
