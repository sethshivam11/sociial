import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import {
  FileIcon,
  ImageIcon,
  MicIcon,
  PlusCircle,
  SendHorizonal,
  VideoIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function DocumentDialog({ open, setOpen }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<
    { name: String; file: File; type: string }[]
  >([]);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setFiles([]);
      }}
    >
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-sm:h-full">
        <DialogTitle>
          {files.length ? "Send Document" : "Add Files"}
        </DialogTitle>
        <input
          type="file"
          id="file-input"
          className="w-0 h-0 invisible border-0"
          ref={inputRef}
          accept="accept/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const maxCap = files.length > 5 ? 5 : files.length;
              for (let i = 0; i < maxCap; i++) {
                const fileSize = files.item(i)?.size;
                if (!fileSize) return;
                if (fileSize > 50000000) {
                  toast({
                    title: "File Size",
                    description: "File size should not exceed 50MB",
                    variant: "destructive",
                  });
                } else {
                  setFiles((prevFiles) => [
                    ...prevFiles,
                    {
                      name: files.item(i)?.name as string,
                      file: files.item(i) as File,
                      type: files.item(i)?.type as string,
                    },
                  ]);
                }
              }
            }
          }}
          multiple
        />
        {files.length ? (
          <div className="flex flex-wrap gap-2 sm:h-40 h-fit">
            {files.map((file, index) => (
              <div
                className="flex flex-col items-center justify-center w-[86px] h-28 p-1 border rounded-md gap-2 hover:bg-stone-200 hover:dark:bg-stone-800 overflow-hidden relative text-center"
                key={index}
              >
                <FileIcon size="30" />
                <p className="text-sm text-ellipsis w-20 overflow-hidden whitespace-nowrap text-gray-500">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 sm:h-40">
            <FileIcon size="70" />
            <p className="text-sm text-gray-500">Add Files & Documents</p>
            <Button className="rounded-xl">
              <Label htmlFor="file-input" className="cursor-pointer">
                Select Files
              </Label>
            </Button>
          </div>
        )}
        <DialogFooter className="max-sm:flex-row max-sm:justify-end max-sm:gap-2">
          {files.length !== 0 && (
            <>
              {files.length < 5 && (
                <Button size="icon" variant="secondary" className="rounded-xl">
                  <Label htmlFor="file-input" className="cursor-pointer">
                    <PlusCircle />
                  </Label>
                </Button>
              )}
              <Button
                size="icon"
                onClick={() => {
                  setFiles([]);
                  setOpen(false);
                }}
                className="rounded-xl"
              >
                <SendHorizonal />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentDialog;
