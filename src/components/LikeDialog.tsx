import React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { HeartOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { getLikes } from "@/lib/store/features/slices/likeSlice";
import { toast } from "./ui/use-toast";

function LikeDialog({
  likesCount,
  postId,
}: {
  likesCount: number;
  postId: string;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { likes, loading } = useAppSelector((state) => state.like);
  const dispatch = useAppDispatch();

  const fetchLikes = React.useCallback(async () => {
    const response = await dispatch(getLikes(postId));
    if (
      !response.payload ||
      !response.payload?.data ||
      !response.payload?.success
    ) {
      toast({
        title: "Something went wrong!",
        description:
          response.payload?.message ||
          "Failed to fetch likes, Please try again",
      });
    }
  }, []);

  // React.useEffect(() => {
  //   if (dialogOpen) fetchLikes();
  // }, [fetchLikes, dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        {likesCount <= 1 ? "1 like" : `${likesCount} likes`}
      </DialogTrigger>
      <DialogContent
        className="w-fit max-sm:w-full"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-center max-h-10">Likes</DialogTitle>
        {loading ? (
          <div className="min-w-80 min-h-20 flex items-center justify-center">
            <Loader2 className="animate-spin" size="30" />
          </div>
        ) : (
          <ScrollArea className="h-96 p-4">
            <div className="flex flex-col gap-2 h-full">
              {likes.length ? (
                likes.map((like, index) => (
                  <Link
                    href={`/${like.username}`}
                    key={index}
                    className="flex items-center space-x-2 w-full sm:hover:bg-stone-200 sm:hover:dark:bg-stone-800 p-1 rounded"
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
                ))
              ) : (
                <div className="w-full h-80 flex flex-col items-center justify-center gap-2">
                  <HeartOff className="mx-auto" size="50" />
                  <p className="text-xl font-bold tracking-tight">
                    No likes yet
                  </p>
                  <span className="text-center text-stone-500">
                    Be the first one to like this post
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LikeDialog;
