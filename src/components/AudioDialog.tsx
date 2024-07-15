import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, SendHorizontal } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AudioDialog({ open, setOpen }: Props) {
  const [audio, setAudio] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open && recording) {
          setRecording(false);
          setAudio("");
        }
      }}
    >
      <DialogContent>
        <DialogTitle>Record Audio</DialogTitle>
        <div className="rounded-xl w-32 h-4 bg-stone-500 relative">
          <span className="bg-stone-200 w-10"></span>
        </div>
        <DialogFooter className="sm:justify-center justify-center">
          {audio ? (
            <Button size="icon">
              <SendHorizontal />
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AudioDialog;
