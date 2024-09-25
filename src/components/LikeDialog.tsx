import React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { History, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { toast } from "./ui/use-toast";
import { fetchLikes, resetLikes } from "@/lib/store/features/slices/postSlice";

function LikeDialog({
  likesCount,
  postId,
}: {
  likesCount: number;
  postId: string;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { likes, loading } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!dialogOpen) return;
    dispatch(fetchLikes(postId)).then((response) => {
      if (
        !response.payload?.success &&
        response.payload?.message !== "No likes found"
      ) {
        toast({
          title: "Something went wrong!",
          description:
            response.payload?.message ||
            "Failed to fetch likes, Please try again",
        });
      } else if (response.payload?.message === "No likes found") {
        dispatch(resetLikes());
      }
    });
  }, [dialogOpen, dispatch, postId]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        {likesCount <= 1 ? `${likesCount} like` : `${likesCount} likes`}
      </DialogTrigger>
      <DialogContent
        className="w-fit max-sm:w-full"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-center max-h-10">Likes</DialogTitle>
        {loading ? (
          <div className="min-w-80 min-h-96 flex items-center justify-center">
            <Loader2 className="animate-spin" size="30" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 h-full">
            {likes.length ? (
              <ScrollArea className="h-96 sm:min-w-80 w-full px-2 pt-4">
                {likes.map((like, index) => (
                  <Link
                    href={`/${like.username}`}
                    key={index}
                    className="flex items-center space-x-2 w-full sm:hover:bg-stone-200 sm:hover:dark:bg-stone-800 p-2 rounded-xl"
                  >
                    <Avatar>
                      <AvatarFallback>
                        {nameFallback(like.fullName)}
                      </AvatarFallback>
                      <AvatarImage src={like.avatar} alt={like.fullName} />
                    </Avatar>
                    <div className="flex flex-col leading-4">
                      <span>{like.fullName}</span>
                      <span className="text-stone-500 leading-4 text-sm">
                        @{like.username}
                      </span>
                    </div>
                  </Link>
                ))}
              </ScrollArea>
            ) : (
              <div className="w-full sm:min-w-80 h-96 flex flex-col items-center justify-center gap-2">
                <History className="mx-auto" size="50" />
                <p className="text-xl font-bold tracking-tight">No likes yet</p>
                <span className="text-center text-stone-500">
                  Be the first one to like this post
                </span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LikeDialog;
