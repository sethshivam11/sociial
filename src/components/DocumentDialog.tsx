import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { FileIcon, Loader2, PlusCircle, SendHorizonal } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { sendMessage } from "@/lib/store/features/slices/messageSlice";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  chatId: string;
}

function DocumentDialog({ open, setOpen, chatId }: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.message);

  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);

  async function handleSend() {
    await Promise.all(
      files.map(async (file) => {
        const response = await dispatch(
          sendMessage({ attachment: file, chatId, kind: "document" })
        );
        if (!response.payload?.success) {
          toast({
            title: "Cannot send documents",
            description: response.payload?.message || "Something went wrong",
            variant: "destructive",
          });
        }
      })
    );
    setOpen(false);
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }

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
        className="max-sm:h-full"
      >
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
                    files.item(i) as File,
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
            <Button onClick={() => inputRef.current?.click()}>
              Select Files
            </Button>
          </div>
        )}
        <DialogFooter className="max-sm:flex-row max-sm:justify-end max-sm:gap-2">
          {files.length !== 0 && (
            <>
              {files.length < 5 && (
                <Button
                  size="icon"
                  variant="secondary"
                  disabled={loading}
                  onClick={() => inputRef.current?.click()}
                >
                  <PlusCircle />
                </Button>
              )}
              <Button size="icon" onClick={handleSend} disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SendHorizonal />
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentDialog;
