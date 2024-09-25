import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Bookmark, Loader2, PlayIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  getSavedPosts,
  savePost,
  unsavePost,
} from "@/lib/store/features/slices/userSlice";
import { toast } from "./ui/use-toast";
import { PostI } from "@/types/types";

interface Props {
  post: PostI;
  isVideo?: boolean;
}

function SavePost({ post, isVideo }: Props) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [savedPostIds, setSavedPostIds] = React.useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.user);

  function handleSave() {
    dispatch(savePost(post._id)).then((response) => {
      if (response.payload?.success) {
        setSavedPostIds((prev) => [...prev, post._id]);
      } else if (!response.payload?.success) {
        toast({
          title: "Failed to save post",
          variant: "destructive",
        });
      }
    });
  }

  function handleUnsave() {
    dispatch(unsavePost(post._id)).then((response) => {
      if (response.payload?.success) {
        setSavedPostIds((prev) => prev.filter((id) => id !== post._id));
        setDialogOpen(false);
      } else if (!response.payload?.success) {
        toast({
          title: "Failed to unsave post",
          variant: "destructive",
        });
      }
    });
  }
  
  React.useEffect(() => {
    if (!user._id || !dialogOpen) return;
    dispatch(getSavedPosts()).then((response) => {
      if (response.payload?.success) {
        setSavedPostIds(
          response.payload.data.map((post: { _id: string }) => post._id)
        );
        setDialogOpen(false);
      }
    });
  }, [dispatch, user._id, dialogOpen]);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!loading) {
          setDialogOpen(open);
        }
      }}
    >
      <DialogTrigger title="Save">
        <Bookmark size="30" className={isVideo ? "mb-1" : ""} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Save Post</DialogTitle>
        <DialogDescription>
          {savedPostIds.includes(post._id)
            ? "Do you want to unsave it?"
            : "Do you want to save this post for future references?"}
        </DialogDescription>
        <Carousel className="w-full my-2">
          <CarouselContent>
            {post.media.map((image, index) => {
              return (
                <CarouselItem key={index} className="relative">
                  {post.media?.length < 1 && (
                    <div className="absolute right-2 top-2 bg-transparent/60 text-white px-2 py-0.5 rounded-2xl text-sm select-none">
                      {index + 1}/{post.media.length}
                    </div>
                  )}
                  {post.kind === "video" && (
                    <PlayIcon
                      size="50"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-transparent/50 rounded-full p-2 backdrop-blur-sm"
                    />
                  )}
                  <Image
                    width="800"
                    height="800"
                    src={post.kind === "video" ? post?.thumbnail || "" : image}
                    alt={`Photo by ${post.user.fullName} with username ${post.user.username}`}
                    className="object-cover select-none w-full h-full rounded-sm max-h-[600px]"
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <DialogFooter>
          {savedPostIds.includes(post._id) ? (
            <Button onClick={handleUnsave}>
              {loading ? <Loader2 className="animate-spin" /> : "Unsave"}
            </Button>
          ) : (
            <Button onClick={handleSave}>
              {loading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SavePost;
