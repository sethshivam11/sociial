import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Check,
  Disc,
  PauseIcon,
  PlayIcon,
  RotateCcw,
  SendHorizontal,
} from "lucide-react";
import { toast } from "./ui/use-toast";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AudioDialog({ open, setOpen }: Props) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const progressRef = React.useRef<HTMLSpanElement>(null);
  const [audio, setAudio] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  async function getUserAudio() {
    const devicesAvailable =
      (await navigator.mediaDevices) &&
      (await navigator.mediaDevices.getUserMedia);
    if (!devicesAvailable) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setRecording(true);
        setStream(stream);
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();
        setIsPaused(false);
      })
      .catch((err) => {
        console.log(err.message);
        if (err.message === "Permission denied") {
          toast({
            title: "Permission",
            description: "Please allow microphone permission",
            variant: "destructive",
          });
        }
      });
  }

  function stopRecording() {
    if (mediaRecorder.current) {
      mediaRecorder.current?.stop();
      mediaRecorder.current.ondataavailable = (e) => {
        const audioURL = URL.createObjectURL(e.data);
        setAudio(audioURL);
        console.log(audioURL);
        audioRef.current?.setAttribute("src", audioURL);
      };
      mediaRecorder.current = null;
      setRecording(false);
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsPaused(true);
    }
  }

  React.useEffect(() => {
    if (mediaRecorder.current) {
      if (isPaused) mediaRecorder.current.pause();
      else mediaRecorder.current.resume();
    } else if (audioRef.current) {
      if (isPaused) audioRef.current.pause();
      else audioRef.current.play();
    }
  }, [isPaused]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open && recording) {
          setRecording(false);
          setIsPaused(true);
          mediaRecorder.current = null;
          setStream(null);
          setAudio("");
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="min-h-52"
      >
        <DialogTitle>{recording ? "Recording..." : "Record Audio"}</DialogTitle>
        <div className="rounded-xl w-full h-4 bg-stone-800 overflow-hidden flex items-start justify-start relative">
          <span
            ref={progressRef}
            className="inline-block bg-stone-500 border-stone-500 w-10 h-full"
          ></span>
        </div>
        <audio
          preload="metadata"
          onWaiting={() => setIsPaused(true)}
          ref={audioRef}
          className="w-full h-10"
          onPause={() => setIsPaused(true)}
          onEnded={() => setIsPaused(true)}
          onTimeUpdate={(value) =>
            progressRef.current?.classList.add(
              `w-[${Math.ceil(value.currentTarget.currentTime)}%]`
            )
          }
          controls
          controlsList="nodownload"
        ></audio>
        <DialogFooter className="sm:justify-center justify-center">
          {audio ? (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-xl"
                onClick={() => setAudio("")}
              >
                <RotateCcw />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl"
                onClick={() => setIsPaused((paused) => !paused)}
              >
                {isPaused ? (
                  <PlayIcon fill="currentColor" />
                ) : (
                  <PauseIcon fill="currentColor" />
                )}
              </Button>
              <Button size="icon" className="rounded-xl">
                <SendHorizontal />
              </Button>
            </>
          ) : (
            <>
              {!recording ? (
                <Button
                  size="icon"
                  className="rounded-xl"
                  onClick={getUserAudio}
                >
                  <Disc />
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => setIsPaused((paused) => !paused)}
                  >
                    {isPaused ? (
                      <PauseIcon fill="currentColor" />
                    ) : (
                      <PlayIcon fill="currentColor" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-xl"
                    onClick={stopRecording}
                  >
                    <Check />
                  </Button>
                </>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AudioDialog;
