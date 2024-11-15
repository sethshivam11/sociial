"use client";
import { Button } from "@/components/ui/button";
import { getTimeDifference } from "@/lib/helpers";
import {
  deleteAnonymousMessage,
  getAnonymousMessages,
} from "@/lib/store/features/slices/anonymousMessageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  Download,
  History,
  MoreVertical,
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

function Page() {
  const dispatch = useAppDispatch();
  const { skeletonLoading, messages } = useAppSelector(
    (state) => state.anonymousMessage
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
    dispatch(deleteAnonymousMessage(messageId)).then((response) => {
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
    dispatch(getAnonymousMessages());
  }, [dispatch]);

  return (
    <div className="xl:col-span-8 sm:col-span-9 col-span-10 container flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight mt-8 mb-3">
        Confessions
      </h1>
      <p className="text-stone-500 text-sm mb-6">
        These messages are anonymous and can be deleted by you at any time.
      </p>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {skeletonLoading ? (
          <MessageCardLoading />
        ) : (
          messages.map((message, index) => (
            <div
              className="flex justify-between gap-1 rounded-xl p-4 ring-1 ring-stone-200 dark:ring-stone-800"
              key={index}
            >
              <div className="flex flex-col justify-between text-pretty">
                {message.attachment && (
                  <Dialog>
                    <DialogTrigger>
                      <Image
                        src={message.attachment}
                        alt=""
                        width="300"
                        height="300"
                        className="object-contain pointer-events-none select-none rounded-md mb-2"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Media Preview</DialogTitle>
                      <Image
                        src={message.attachment}
                        alt=""
                        width="800"
                        height="800"
                        className="object-contain pointer-events-none select-none rounded-xl mt-2"
                      />
                      <DialogFooter>
                        <Button
                          size="icon"
                          onClick={() => handleDownload(message.attachment)}
                        >
                          <Download />
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {message.content}
                <div
                  className="flex items-center mt-2 gap-1 text-stone-500 text-xs"
                  title={message.createdAt}
                >
                  <History size="16" />
                  {getTimeDifference(message.createdAt)}
                </div>
              </div>
              <Menubar className="bg-transparent border-transparent xl:justify-start justify-center w-fit p-0">
                <MenubarMenu>
                  <MenubarTrigger className="px-1.5 rounded-lg" asChild>
                    <Button variant="ghost">
                      <MoreVertical size="20" />
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent className="rounded-xl">
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
          ))
        )}
      </div>
      {messages.length <= 0 && !skeletonLoading && (
        <div className="flex flex-col justify-center items-center gap-2 h-full">
          <History size="80" />
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              No messages for now
            </h1>
            <p className="text-stone-500 text-sm">
              Ask your friends to try this
            </p>
          </div>
        </div>
      )}
      <ReportDialog
        open={report.open}
        setOpen={(open) => setReport((prev) => ({ ...prev, open }))}
        type="anonymous-message"
        entityId={report.entityId}
      />
    </div>
  );
}

export default Page;
