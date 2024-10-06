import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  getReactions,
  unreactMessage,
} from "@/lib/store/features/slices/messageSlice";
import { History, Loader2 } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/use-toast";

interface Props {
  messageId: string;
  type: string;
  reacts: {
    content: string;
    user: string;
    _id: string;
  }[];
}

function MessageReacts({ reacts, type, messageId }: Props) {
  const dispatch = useAppDispatch();
  const { reactions, loading } = useAppSelector((state) => state.message);
  const { user } = useAppSelector((state) => state.user);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function getUniqueEmojis(reacts: Props["reacts"]): string {
    let threeEmojis = new Set<string>();
    reacts.map((react) => {
      if (threeEmojis.size < 3) {
        threeEmojis.add(react.content);
      }
    });
    return Array.from(threeEmojis).join("");
  }

  function handleUnreact(userId: string) {
    setDialogOpen(false);
    dispatch(unreactMessage({ messageId, userId })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot unreact to message",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  React.useEffect(() => {
    if (dialogOpen) {
      dispatch(getReactions(messageId));
    }
  }, [dispatch, dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        className={`absolute rounded-full text-sm px-1 py-0.5 z-10 ring-1 -bottom-4 ring-white dark:ring-black ${
          reacts && type === "reply"
            ? "left-3 mr-auto bg-stone-800 dark:bg-stone-300 text-white dark:text-black"
            : "right-3 ml-auto bg-stone-300 dark:bg-stone-800 text-black dark:text-white"
        }`}
      >
        {getUniqueEmojis(reacts)}&nbsp;
        {reacts.length > 1 && reacts.length}
      </DialogTrigger>
      <DialogContent
        className="w-fit"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-xl font-semibold tracking-tight">
          Reactions
        </DialogTitle>
        {loading ? (
          <div className="flex items-center justify-center w-80 h-80">
            <Loader2 className="animate-spin" />
          </div>
        ) : reactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-80 h-80 gap-4">
            <History size="60" />
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xl tracking-tight font-semibold">
                No reactions yet
              </h1>
              <p className="text-stone-500">
                Be the first to react to this message
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="w-80 h-80 p-3">
            {reactions.map((react, index) =>
              react.user.username !== user.username ? (
                <Link
                  href={`/${react.user.username}`}
                  className="flex items-center justify-between w-full hover:bg-stone-200 dark:hover:bg-stone-800 pl-0 pr-4 py-2 rounded-lg"
                  key={index}
                >
                  <div className="flex">
                    <Avatar className="mx-2">
                      <AvatarImage src={react.user.avatar} />
                      <AvatarFallback>
                        {nameFallback(react.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p>{react.user.fullName}</p>
                      <p className="text-stone-500 text-sm">
                        @{react.user.username}
                      </p>
                    </div>
                  </div>
                  <p className="w-5 h-5 text-xl">{react.content}</p>
                </Link>
              ) : (
                <button
                  className="flex items-center justify-between w-full hover:bg-stone-200 dark:hover:bg-stone-800 pl-0 pr-4 py-2 rounded-lg"
                  onClick={() => handleUnreact(user._id)}
                  key={index}
                >
                  <div className="flex">
                    <Avatar className="mx-2">
                      <AvatarImage src={react.user.avatar} />
                      <AvatarFallback>
                        {nameFallback(react.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <p>{react.user.fullName}</p>
                      <p className="text-stone-500 text-sm">Tap to remove</p>
                    </div>
                  </div>
                  <p className="w-5 h-5 text-xl">{react.content}</p>
                </button>
              )
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MessageReacts;
