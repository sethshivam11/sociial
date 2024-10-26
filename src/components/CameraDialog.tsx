"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import {
  CameraIcon,
  Loader2,
  RepeatIcon,
  RotateCcw,
  SendHorizonal,
  XIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { sendMessage } from "@/lib/store/features/slices/messageSlice";

interface Props {
  chatId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function CameraDialog({ open, setOpen, chatId }: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.message);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [permisionDenied, setPermissionDenied] = useState(false);
  const [multipleCamAvailalble, setMultipleCamAvailable] = useState(false);
  const [activeCamera, setActiveCamera] = useState<string | undefined>(
    undefined
  );

  function captureImage() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpg");

    setImage(imageDataUrl);
    stopCamera();
  }
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
  function resetCamera() {
    stopCamera();
    setImage(undefined);
  }
  function switchCamera() {
    if (!multipleCamAvailalble) return;

    stopCamera();
    if (activeCamera === "user") {
      getUserMedia({ exact: "environment" });
    } else {
      getUserMedia({ exact: "user" });
    }
  }
  async function handleSend() {
    if (!image) return;
    const response = await fetch(image);
    const blob = await response.blob();
    const imageFile = new File([blob], `${Date.now()}.jpg`, {
      type: blob.type,
    });
    dispatch(
      sendMessage({ chatId, attachment: imageFile, kind: "image" })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot send image",
          description: response.payload?.message || "Something went wrong!",
          variant: "destructive",
        });
      } else {
        setOpen(false);
        resetCamera();
      }
    });
  }

  const getUserMedia = useCallback(
    async function (facingMode?: { exact: string }) {
      const mediaDevicesAvailable =
        (await navigator.mediaDevices) ||
        (await navigator.mediaDevices?.getUserMedia);
      if (!mediaDevicesAvailable) {
        return toast({
          title: "Error",
          description: "Camera is not supported by your browser",
          variant: "destructive",
        });
      }
      await navigator.mediaDevices
        .getUserMedia({ video: facingMode ? { facingMode } : true })
        .then((stream) => {
          setPermissionDenied(false);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStream(stream);
          const capabilties = stream?.getTracks()[0].getCapabilities();
          if (capabilties.facingMode) {
            setActiveCamera(capabilties.facingMode[0]);
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message === "Permission denied") {
            setPermissionDenied(true);
            toast({
              title: "Permission",
              description: "Please allow camera permission",
              variant: "destructive",
            });
          }
        });
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          if (devices.filter(({ kind }) => kind === "videoinput").length > 1) {
            setMultipleCamAvailable(true);
          }
        })
        .catch((err) => console.log(err));

      return () => {
        resetCamera();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (open) {
      getUserMedia();
    }
  }, [open, getUserMedia]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        resetCamera();
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-sm:h-full max-sm:w-full max-sm:max-w-full max-sm:px-1"
      >
        <DialogTitle className="tracking-tight text-2xl font-bold text-center">
          {image ? "Image Preview" : "Take a Photo"}
        </DialogTitle>
        {image ? (
          <Image
            src={image}
            alt=""
            width={videoRef.current?.videoWidth || 500}
            height={videoRef.current?.videoHeight || 500}
            className="object-contain aspect-square"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay={true}
              className="w-full object-contain min-h-96"
              playsInline
            />
            <canvas ref={canvasRef} className="w-0 h-0 hidden"></canvas>
          </>
        )}
        <DialogFooter className="flex flex-row items-center justify-center sm:justify-center gap-3 w-full">
          {image ? (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-xl"
                title="Retake"
                onClick={() => {
                  getUserMedia();
                  setImage(undefined);
                }}
              >
                <RotateCcw />
              </Button>
              <Button
                size="icon"
                className="rounded-xl"
                title="Send"
                disabled={loading}
                onClick={handleSend}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SendHorizonal />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="icon"
                className={`rounded-full p-1 ${
                  multipleCamAvailalble ? "visible" : "invisible"
                }`}
                title="Switch Camera"
                disabled={permisionDenied || loading}
                onClick={() => switchCamera()}
              >
                <RepeatIcon />
              </Button>
              <Button
                size="icon"
                className="rounded-full p-2.5 w-fit h-fit"
                title="Click"
                onClick={captureImage}
                disabled={permisionDenied}
              >
                <CameraIcon size="40" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full p-1"
                title="Close"
                onClick={() => {
                  resetCamera();
                  setOpen(false);
                }}
              >
                <XIcon />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CameraDialog;
