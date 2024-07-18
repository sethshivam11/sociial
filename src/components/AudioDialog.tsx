import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Check,
  Disc,
  Mic,
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
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [audio, setAudio] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [timeStamp, setTimeStamp] = React.useState(0);
  const [audioDuration, setAudioDuration] = React.useState(0);

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
        setIsPaused(true);
        timerRef.current = setInterval(() => {
          setAudioDuration((duration) => duration + 1);
        }, 1000);
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setAudioDuration((prev) => prev + 1);
      }
      setIsPaused(false);
      mediaRecorder.current.stop();
      mediaRecorder.current.ondataavailable = (e) => {
        const audioURL = URL.createObjectURL(e.data);
        setAudio(audioURL);
        if (!audioRef.current) return;
        audioRef.current.setAttribute("src", audioURL);
        audioRef.current.load();
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
        setRecording(false);
        setIsPaused(true);
        mediaRecorder.current = null;
        setStream(null);
        setAudio("");
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-sm:h-full"
      >
        <DialogTitle className={recording ? "animate-pulse" : ""}>
          {recording ? "Recording..." : "Record Audio"}
        </DialogTitle>
        <div className="flex items-center justify-center w-full h-40">
          <div
            className={`mx-auto rounded-full${
              recording && isPaused
                ? " bg-red-100 dark:bg-red-950 ring-1 ring-red-500"
                : ""
            } my-6 animate-recording relative`}
          >
            <Mic size="50" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-0">
          <div
            className={`rounded-xl w-full h-2 bg-stone-800 overflow-hidden items-start justify-start relative ${
              audio ? "flex" : "hidden"
            }`}
          >
            <span
              ref={progressRef}
              className="inline-block bg-stone-500 border-stone-500 h-full"
            />
          </div>
          <div className="hidden justify-between w-full px-2">
            <span>
              {timeStamp > 60 ? Math.floor(timeStamp / 60) : "0"}:
              {timeStamp - Math.floor(timeStamp / 60)}
            </span>
            <span>{audioDuration}</span>
          </div>
        </div>
        <audio
          preload="metadata"
          onWaiting={() => setIsPaused(true)}
          ref={audioRef}
          className="w-full h-10"
          onPause={() => setIsPaused(true)}
          onEnded={(e) => (e.currentTarget.currentTime = 0)}
          onTimeUpdate={(e) => {
            const audioElement = e.currentTarget;
            if (!progressRef.current) return;
            const time = Math.ceil(audioElement.currentTime);
            setTimeStamp(Math.ceil(time));
            if (
              !(
                isNaN(Number(audioElement.duration)) ||
                audioElement.duration === Infinity
              )
            ) {
              setAudioDuration(Math.ceil(audioElement.duration));
              progressRef.current.style.width = `${Math.ceil(
                (audioElement.currentTime * 100) / audioElement.duration
              )}%`;
            } else {
              progressRef.current.style.width = `${Math.ceil(
                (audioElement.currentTime * 100) / audioDuration
              )}%`;
            }
          }}
        />
        <DialogFooter className="max-sm:flex-row gap-2 sm:justify-center justify-center items-center">
          {audio ? (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-xl"
                title="Discard & Record Again"
                onClick={() => {
                  setAudio("");
                  setIsPaused(true);
                  setAudioDuration(0);
                }}
              >
                <RotateCcw />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl"
                title={isPaused ? "Pause" : "Play"}
                onClick={() => setIsPaused((paused) => !paused)}
              >
                {isPaused ? (
                  <PlayIcon fill="currentColor" />
                ) : (
                  <PauseIcon fill="currentColor" />
                )}
              </Button>
              <Button size="icon" className="rounded-xl" title="Send">
                <SendHorizontal />
              </Button>
            </>
          ) : (
            <>
              {!recording ? (
                <Button
                  size="icon"
                  className="rounded-xl"
                  title="Start Recording"
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
                    title={isPaused ? "Pause Recording" : "Resume Recording"}
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
                    title="Stop Recording"
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
