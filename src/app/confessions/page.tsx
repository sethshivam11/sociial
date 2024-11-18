"use client";
import { Button } from "@/components/ui/button";
import { getTimeDifference } from "@/lib/helpers";
import {
  deleteConfession,
  getConfession,
} from "@/lib/store/features/slices/confessionSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  Download,
  History,
  MoreVertical,
  Play,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import ReportDialog from "@/components/ReportDialog";
import { toast } from "@/components/ui/use-toast";
import MessageCardLoading from "@/components/skeletons/MessageCardLoading";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { skeletonLoading, messages } = useAppSelector(
    (state) => state.confession
  );

  const [report, setReport] = useState({
    open: false,
    entityId: "",
  });

  function handleDownload(content: string) {
    const fileURL = content.replace("/upload", "/upload/fl_attachment");
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `Image-${new Date().toLocaleString("en-IN")}`;
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
  }
  function handleDelete(messageId: string) {
    dispatch(deleteConfession(messageId)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Message was deleted",
        });
      } else {
        toast({
          title: "Cannot delete message",
          description: response.payload?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getConfession());
  }, [dispatch]);

  return (
    <div className="xl:col-span-8 sm:col-span-9 col-span-10 sm:container px-4 sm:pb-6 pb-20 flex flex-col min-h-[100dvh]">
      <Select
        defaultValue="confessions"
        onValueChange={(value) => {
          if (value === "messages") {
            router.push("/messages");
          }
        }}
      >
        <SelectTrigger className="md:-ml-4 sm:ml-4 max-sm:mx-0 mt-6 sm:mb-3 mb-2 text-2xl tracking-tight font-bold text-left border-0 w-fit gap-2 focus:ring-0 pl-0">
          <SelectValue placeholder="Conversations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="messages">Conversations</SelectItem>
          <SelectItem value="confessions">Confessions</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-stone-500 text-sm sm:mb-6 mb-4 md:-ml-4 sm:ml-4">
        These are anonymous messages and can be deleted by you at any time.
      </p>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {skeletonLoading ? (
          <MessageCardLoading />
        ) : (
          messages.map((message, index) => (
            <div
              className="flex flex-col justify-between gap-1 rounded-xl p-4 ring-1 ring-stone-200 dark:ring-stone-800 text-pretty break-words"
              key={index}
            >
              {message.attachment && (
                <Dialog>
                  <DialogTrigger>
                    {message.attachment.kind === "image" ? (
                      <Image
                        src={message.attachment.url}
                        alt=""
                        width="300"
                        height="300"
                        className="object-contain pointer-events-none select-none rounded-md mb-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center relative">
                        <Play className="flex absolute bg-transparent/60 p-2 w-fit h-fit rounded-full" />
                        <video
                          src={message.attachment.url}
                          className="object-cover h-full w-full rounded-md mb-2"
                          muted
                        />
                      </div>
                    )}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Media Preview</DialogTitle>
                    {message.attachment.kind === "image" ? (
                      <Image
                        src={message.attachment.url}
                        alt=""
                        width="800"
                        height="800"
                        className="object-contain pointer-events-none select-none rounded-xl mt-2"
                      />
                    ) : (
                      <video
                        src={message.attachment.url}
                        className="object-contain select-none w-full rounded-xl mt-2"
                        controlsList="nodownload"
                        controls
                      />
                    )}
                    <DialogFooter>
                      <Button
                        size="icon"
                        onClick={() => handleDownload(message.attachment.url)}
                      >
                        <Download />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {message.content}
              <div className="flex justify-between items-center gap-2">
                <div
                  className="flex items-center mt-2 gap-1 text-stone-500 text-xs"
                  title={new Date(message.createdAt).toLocaleString("en-IN")}
                >
                  <History size="16" />
                  {getTimeDifference(message.createdAt)}
                </div>
                <Menubar className="bg-transparent border-transparent xl:justify-start justify-center w-fit p-0">
                  <MenubarMenu>
                    <MenubarTrigger className="px-1.5 rounded-lg" asChild>
                      <Button variant="ghost">
                        <MoreVertical size="20" />
                      </Button>
                    </MenubarTrigger>
                    <MenubarContent className="rounded-xl" align="end">
                      <MenubarItem
                        className="flex items-center gap-1 rounded-lg py-2.5"
                        onClick={() => handleDelete(message._id)}
                      >
                        <Trash2 /> Delete
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-1 rounded-lg py-2.5 text-red-600 focus:text-red-600"
                        onClick={() =>
                          setReport({
                            open: true,
                            entityId: message._id,
                          })
                        }
                      >
                        <ShieldAlert /> Report
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
          ))
        )}
      </div>
      {messages.length <= 0 && !skeletonLoading && (
        <div className="flex flex-col justify-center items-center gap-2 h-full">
          <History size="80" />
          <div className="flex flex-col justify-center items-center">
            <h1 className="sm:text-2xl text-xl font-semibold tracking-tight">
              No messages for now
            </h1>
            <p className="text-stone-500 max-sm:text-sm">
              Ask your friends to try this
            </p>
          </div>
        </div>
      )}
      <ReportDialog
        open={report.open}
        setOpen={(open) => setReport((prev) => ({ ...prev, open }))}
        type="confession"
        entityId={report.entityId}
      />
    </div>
  );
}

export default Page;
