"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Mic, Phone, RefreshCcw, Video } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";

function Page() {
  const [stream, setStream] = useState<MediaStream | null>(null);
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

        return () => {
          stream?.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  useEffect(() => {
    getUserMedia(true);
  }, [getUserMedia]);
  return (
    <div className="col-span-10 flex flex-col items-center justify-center min-h-[100dvh] max-h-[100dvh] bg-black overflow-hidden relative">
      <ReactPlayer
        playing
        url={stream || ""}
        className="w-full h-full max-sm:h-1/2 sm:object-contain object-cover react-player"
        playsInline
        width="100%"
        height="inherit"
      />
      <div className="flex items-center justify-center gap-4 absolute bottom-10 z-10">
        <Button
          size="icon"
          variant="secondary"
          className={`rounded-full p-3 h-fit w-fit shadow-xl`}
        >
          <RefreshCcw size="30" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className={`rounded-full p-3 w-fit h-fit shadow-xl`}
        >
          <Video size="30" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className={`rounded-full p-3 w-fit h-fit shadow-xl`}
        >
          <Mic size="30" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="rounded-full p-3 w-fit h-fit shadow-xl"
        >
          <Phone size="30" className="rotate-[135deg]" />
        </Button>
      </div>
      <div
        className={`flex items-center justify-center lg:w-96 lg:h-72 sm:w-60 sm:h-44 w-full max-lg:top-4 lg:bottom-4 right-4 sm:shadow-lg sm:rounded-xl sm:absolute transition-transform max-sm:h-1/2 overflow-hidden`}
      >
        <button className="hover:scale-110 p-2 left-0 absolute z-10 max-sm:hidden">
          <ChevronRight size="30" />
        </button>
        <ReactPlayer
          className="w-full max-sm:h-1/2 bg-black sm:object-contain object-cover sm:rounded-xl react-player"
          url={stream || ""}
          width="100%"
          height="inherit"
          playing
          autoPlay
          muted
          playsInline
        />
      </div>
    </div>
  );
}

export default Page;
