import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, PlusCircle, SendHorizonal, XIcon } from "lucide-react";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function MediaDialog({ open, setOpen }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<{ url: string; type: string }[]>([]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setFiles([]);
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-sm:w-full max-sm:h-full max-sm:max-w-full"
      >
        <DialogTitle className="text-center text-xl">
          {files.length ? "Media Preview" : "Add Files"}
        </DialogTitle>
        <input
          type="file"
          id="file-input"
          className="w-0 h-0 absolute invisible border-0"
          ref={inputRef}
          accept="image/*,video/mp4,video/3gp"
          onChange={(e) => {
            const inputFiles = e.target.files;
            if (inputFiles) {
              if (inputFiles.length > 5) {
                e.target.files = null;
                return toast({
                  title: "Warning",
                  description: "You can only upload 5 files at a time",
                  variant: "destructive",
                });
              }
              const maxCap = inputFiles.length > 5 ? 5 : inputFiles.length;
              for (let i = 0; i < maxCap; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setFiles((prevFiles) => [
                    ...prevFiles,
                    {
                      url: e.target?.result as string,
                      type: inputFiles.item(i)?.type as string,
                    },
                  ]);
                };
                reader.readAsDataURL(inputFiles[i]);
              }
            }
          }}
          multiple
        />
        {files.length ? (
          <Carousel>
            <CarouselNext className="z-10" />
            <CarouselPrevious className="z-10" />
            <CarouselContent>
              {files.map((file, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center relative"
                >
                  <button
                    className="bg-transparent/50 absolute right-2 top-2 p-1 rounded-full z-10"
                    onClick={() => {
                      setFiles((prevFiles) =>
                        prevFiles.filter(({ url }) => url !== file.url)
                      );
                    }}
                    title="Remove file"
                  >
                    <XIcon color="white" />
                  </button>
                  {file.type.includes("image") ? (
                    <Image
                      src={file.url}
                      width={500}
                      height={500}
                      alt=""
                      className="object-contain w-full select-none pointer-events-none max-h-[80dvh]"
                    />
                  ) : (
                    <video src={file.url} controls className="w-full" />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 max-sm:h-80 sm:min-h-96">
            <ImageIcon size="70" />
            <p className="text-sm text-gray-500">Add Photos & Videos</p>
            <Button className="rounded-xl">
              <Label htmlFor="file-input" className="cursor-pointer">
                Select Files
              </Label>
            </Button>
          </div>
        )}
        {files.length !== 0 && (
          <DialogFooter className="max-sm:flex-row max-sm:justify-end max-sm:gap-2">
            {files.length < 5 && (
              <Button variant="secondary" size="icon" className="rounded-xl">
                <Label htmlFor="file-input" className="cursor-pointer">
                  <PlusCircle />
                </Label>
              </Button>
            )}
            <Button size="icon" className="rounded-xl" title="Send">
              <SendHorizonal />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MediaDialog;
