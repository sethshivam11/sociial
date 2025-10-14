"use client";

import { PostI } from "@/types/types";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import PostOptions from "./PostOptions";
import {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "./ui/carousel";
import PostCaption from "./PostCaption";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { likePost, unlikePost } from "@/lib/store/features/slices/postSlice";
import { toast } from "./ui/use-toast";
import { savePost, unsavePost } from "@/lib/store/features/slices/userSlice";
import { useRouter } from "next/navigation";
import { Bookmark, Heart, PlayIcon } from "lucide-react";
import Image from "next/image";
import Comment from "./Comment";
import Share from "./Share";
import LikeDialog from "./LikeDialog";
import { useEffect, useState } from "react";

interface Props {
  post: PostI;
  postIndex: number;
}

function PostItem({ post, postIndex }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.user);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(1);

  function handleLike(postId: string, type: "posts" | "explore") {
    dispatch(
      likePost({
        postId: postId,
        userId: user._id,
        type,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot like post",
          description: "Please try again later.",
        });
      }
    });
  }
  function handleUnlike(postId: string, type: "posts" | "explore") {
    dispatch(
      unlikePost({
        postId: postId,
        userId: user._id,
        type,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot unlike post",
          description: "Please try again later.",
        });
      }
    });
  }
  function handleSave(postId: string) {
    dispatch(savePost(postId)).then((response) => {
      if (response.payload?.success) {
        toast({ title: "Post saved" });
      } else if (!response.payload?.success) {
        toast({
          title: "Failed to save post",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  function handleUnsave(postId: string) {
    dispatch(unsavePost(postId)).then((response) => {
      if (response.payload?.success) {
        toast({ title: "Post unsaved" });
      } else if (!response.payload?.success) {
        toast({
          title: "Failed to unsave post",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="rounded-xl bg-stone-100 dark:bg-stone-900 p-4 w-full sm:w-[85%] mx-auto min-h-64 min-w-64">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 w-full">
          <Link className="w-8 h-8" href={`/${post.user.username}`}>
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={post.user.avatar}
                alt=""
                className="pointer-events-none select-none"
              />
              <AvatarFallback>
                {nameFallback(post.user.fullName)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/${post.user.username}`}>
            <p className="flex items-center justify-start gap-0.5">
              <span>{post.user.fullName}</span>
            </p>
            <p className="text-sm text-gray-500 leading-3">
              @{post.user.username}
            </p>
          </Link>
        </div>
        <PostOptions
          user={post.user}
          postId={post._id}
          isVideo={post.kind === "video"}
          explorePosts
        />
      </div>
      <Carousel
        setApi={setApi}
        className={`w-full relative my-2 mt-2 ${
          post.kind === "video" ? "cursor-pointer" : ""
        }`}
        onClick={() =>
          post.kind === "video" ? router.push(`/video/${post._id}`) : null
        }
      >
        {post.media?.length > 1 && (
          <div className="w-10 h-7 flex items-center justify-center absolute right-2 top-2 bg-transparent/60 text-white text-sm font-light rounded-2xl text-sm select-none z-10">
            {current}/{count}
          </div>
        )}
        <CarouselContent>
          {post.media.map((image, index) => {
            return (
              <CarouselItem key={index} className="relative">
                <div
                  className="flex absolute w-full h-full items-center justify-center z-10"
                  onDoubleClick={async (e) => {
                    if (loading || post.kind === "video") return;
                    if (post.likes.includes(user._id)) {
                      handleUnlike(post._id, "posts");
                    } else {
                      handleLike(post._id, "posts");
                    }
                  }}
                >
                  <Heart
                    size="150"
                    strokeWidth="0"
                    fill="rgb(244 63 94)"
                    className={
                      post.likes.includes(user._id) ? "animate-like" : "hidden"
                    }
                  />
                </div>
                {post.kind === "video" && (
                  <PlayIcon
                    size="50"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-transparent/50 rounded-full p-2 backdrop-blur-sm"
                  />
                )}
                <Image
                  width="800"
                  height="800"
                  src={post.kind === "image" ? image : post.thumbnail || ""}
                  priority={index === 0 && postIndex < 10 ? true : false}
                  alt={`${post.kind === "image" ? "Post" : "Video"} by ${
                    post.user.fullName
                  } with username ${post.user.username}`}
                  className="object-cover select-none w-full h-full rounded-sm z-10 max-h-[600px]"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-between select-none">
        <div className="flex gap-3">
          <button
            title={post.likes.includes(user._id) ? "Unlike" : "Like"}
            disabled={loading}
            onClick={() =>
              post.likes.includes(user._id)
                ? handleUnlike(post._id, "explore")
                : handleLike(post._id, "explore")
            }
          >
            <Heart
              size="30"
              className={`${
                post.likes.includes(user._id)
                  ? "text-rose-500"
                  : "sm:hover:opacity-60"
              } transition-all active:scale-110`}
              fill={post.likes.includes(user._id) ? "rgb(244 63 94)" : "none"}
            />
          </button>
          <Comment
            postId={post._id}
            user={post.user}
            commentsCount={post.commentsCount}
          />
          <Share _id={post._id} />
        </div>
        <button
          title={user.savedPosts.includes(post._id) ? "Unsave" : "Save"}
          onClick={() => {
            if (user.savedPosts.includes(post._id)) {
              handleUnsave(post._id);
            } else {
              handleSave(post._id);
            }
          }}
        >
          <Bookmark
            size="30"
            fill={user.savedPosts.includes(post._id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="flex items-center gap-1 text-sm text-stone-400 mt-2 select-none">
        <LikeDialog likesCount={post.likesCount} postId={post._id} />
        {post.likesCount > 0 && post.commentsCount > 0 && " & "}
        {post.commentsCount > 0 &&
          `${post.commentsCount} comment${post.commentsCount > 1 ? "s" : ""}`}
      </div>
      <PostCaption caption={post.caption} createdAt={post.createdAt} />
    </div>
  );
}

export default PostItem;
