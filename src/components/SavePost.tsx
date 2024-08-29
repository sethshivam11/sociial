import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Bookmark, Link, Loader2, PlayIcon } from "lucide-react";
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
}

function SavePost({ post }: Props) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [savedPostIds, setSavedPostIds] = React.useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { loading, user, savedPosts } = useAppSelector((state) => state.user);

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

  const fetchSavedPosts = React.useCallback(async () => {
    dispatch(getSavedPosts()).then((response) => {
      if (response.payload?.success) {
        setSavedPostIds(
          response.payload.data.map((post: { _id: string }) => post._id)
        );
        setDialogOpen(false);
      }
    });
  }, [dispatch, getSavedPosts]);

  React.useEffect(() => {
    if (!user._id || !dialogOpen) return;
    fetchSavedPosts();
  }, [fetchSavedPosts, user._id, dialogOpen]);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!loading) {
          setDialogOpen(open);
        }
      }}
    >
      <DialogTrigger>
        <Bookmark size="30" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Save Post</DialogTitle>
        <DialogDescription>
          {savedPostIds.includes(post._id)
            ? "Do you want to unsave it?"
            : "Do you want to save this post for future references?"}
        </DialogDescription>
        {post.kind === "video" ? (
          <Link href={`/video/${post._id}`} className="relative">
            <PlayIcon
              size="50"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-transparent/50 rounded-full p-2"
            />
            <Image
              src={post?.thumbnail || ""}
              alt=""
              width="800"
              height="800"
            />
          </Link>
        ) : (
          <Carousel className="w-full my-2 mt-2">
            <CarouselContent>
              {post.media.map((image, index) => {
                return (
                  <CarouselItem key={index} className="relative">
                    {post.media?.length < 1 && (
                      <div className="absolute right-2 top-2 bg-transparent/60 text-white px-2 py-0.5 rounded-2xl text-sm select-none">
                        {index + 1}/{post.media.length}
                      </div>
                    )}
                    <Image
                      width="800"
                      height="800"
                      src={image}
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
        )}
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
