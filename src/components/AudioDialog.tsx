import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Check,
  Disc,
  Loader2,
  Mic,
  PauseIcon,
  PlayIcon,
  RotateCcw,
  SendHorizontal,
} from "lucide-react";
import { toast } from "./ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { sendMessage } from "@/lib/store/features/slices/messageSlice";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  chatId: string;
}

function AudioDialog({ open, setOpen, chatId }: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.message);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [audio, setAudio] = useState("");
  const [recording, setRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timeStamp, setTimeStamp] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

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
  async function handleSend() {
    const response = await fetch(audio);
    const blob = await response.blob();
    const file = new File([blob], `${Date.now()}.mp3`, {
      type: blob.type,
    });
    dispatch(sendMessage({ attachment: file, chatId, kind: "audio" }))
      .then((response) => {
        if (!response.payload?.success) {
          toast({
            title: "Cannot send audio",
            description: response.payload?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setAudio("");
        setOpen(false);
      });
  }

  useEffect(() => {
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
              <Button
                size="icon"
                className="rounded-xl"
                title="Send"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SendHorizontal />
                )}
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
