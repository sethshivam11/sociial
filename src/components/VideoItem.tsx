"use client";

import { likePost, unlikePost } from "@/lib/store/features/slices/postSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import React, { useState } from "react";
import { toast } from "./ui/use-toast";
import { savePost, unsavePost } from "@/lib/store/features/slices/userSlice";
import Comment from "@/components/Comment";
import PostCaption from "@/components/PostCaption";
import Share from "@/components/Share";
import { PostI } from "@/types/types";
import Link from "next/link";
import {
  Bookmark,
  ChevronLeft,
  Heart,
  Pause,
  Play,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import VideoOptions from "./VideoOptions";
import { SliderVideo } from "./ui/slider-video";
import { nameFallback } from "@/lib/helpers";

function VideoItem({
  post,
  isMuted,
  setIsMuted,
  videoRef,
}: {
  post: PostI;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement> | null;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [seeking, setSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function handleLike(postId: string) {
    dispatch(
      likePost({
        postId,
        userId: user._id,
        type: "post",
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
  function handleUnlike(postId: string) {
    dispatch(
      unlikePost({
        postId,
        userId: user._id,
        type: "post",
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
  return (
    <>
      <div className="flex items-center justify-center h-full max-sm:w-full sm:aspect-9/16 bg-stone-950 text-white sm:border relative">
        <video
          ref={videoRef}
          className="w-full max-h-full cursor-pointer object-contain"
          preload="auto"
          muted={isMuted}
          onClick={() => {
            const video = videoRef?.current;
            if (!video) return;
            if (video.paused) {
              video.play();
              setIsPaused(false);
            } else {
              video.pause();
              setIsPaused(true);
            }
          }}
          onTimeUpdate={() => {
            if (!seeking && videoRef && videoRef.current) {
              setSliderValue(videoRef.current.currentTime || 0);
            }
          }}
          onProgress={(e) => {
            if (!seeking && videoRef && videoRef.current) {
              e.currentTarget.currentTime = sliderValue;
            }
          }}
          onPlaying={() => setIsPaused(false)}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
          onEnded={() => setIsPaused(true)}
          poster={post?.thumbnail || ""}
          loop
          autoPlay
          playsInline
        >
          {post.media[0] && <source src={post.media[0]} />}
        </video>
        <div className="flex items-center justify-start pr-3 absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-transparent/80 via-transparent/60 to-transparent">
          <Link
            className="px-1 py-2 rounded-xl sm:hidden mx-1 hover:bg-transparent"
            href="/"
          >
            <ChevronLeft color="white" />
          </Link>
          <Link
            href={`/${post.user.username}`}
            className="flex items-center justify-start sm:pl-4"
          >
            <Avatar>
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>
                {nameFallback(post.user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center gap-0 mx-2">
              <h1 className="text-xl tracking-tight font-semibold leading-4">
                {post.user.fullName}
              </h1>
              <p className="text-stone-400 text-sm">@{post.user.username}</p>
            </div>
          </Link>
        </div>
        <VideoOptions
          postId={post._id}
          fullName={post.user.fullName}
          username={post.user.username}
          avatar={post.user.avatar}
        />
        <div className="flex flex-col absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent via-transparent/50 to-transparent/60">
          <div className="absolute bottom-10 right-0 max-sm:flex hidden flex-col items-center justify-start gap-4 px-3 pb-10">
            <button
              title={post.likes.includes(user._id) ? "Unlike" : "Like"}
              onClick={() => {
                if (post.likes?.includes(user._id)) {
                  handleUnlike(post._id);
                } else {
                  handleLike(post._id);
                }
              }}
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
              <span className="text-sm">{post.likesCount}</span>
            </button>
            <Comment
              postId={post._id}
              user={post.user}
              commentsCount={post.commentsCount}
              isVideo
            />
            <button
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
                fill={
                  user.savedPosts.includes(post._id) ? "currentColor" : "none"
                }
                className="mb-1"
              />
            </button>
            <Share _id={post._id} isVideo />
          </div>
          <div className="px-6">
            <PostCaption caption={post.caption} createdAt={post.createdAt} />
          </div>
          <div className="flex items-center justify-start px-3 h-fit">
            <button
              className="rounded-full p-1 z-10"
              onClick={() => {
                const video = videoRef?.current;
                if (!video) {
                  setIsPaused((p) => !p);
                  return;
                }
                if (video.paused) {
                  video.play();
                  setIsPaused(false);
                } else {
                  video.pause();
                  setIsPaused(true);
                }
              }}
            >
              {isPaused ? (
                <Play size="30" strokeWidth="0" fill="currentColor" />
              ) : (
                <Pause size="30" strokeWidth="0" fill="currentColor" />
              )}
            </button>
            <button
              className="rounded-full p-1 z-10"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeXIcon size="30" /> : <Volume2Icon size="30" />}
            </button>
            <div className="mx-3 w-full z-10">
              <SliderVideo
                value={[sliderValue]}
                min={0}
                max={videoRef?.current?.duration || 15}
                step={1}
                onValueChange={(value) => {
                  setSeeking(true);
                  setSliderValue(value[0]);
                }}
                onValueCommit={() => {
                  if (!videoRef?.current) return;
                  setSeeking(false);
                  videoRef.current.currentTime = sliderValue;
                }}
                className={`w-full`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex hidden flex-col items-center justify-end gap-4 px-3 pb-12 h-full">
        <button
          title={post.likes.includes(user._id) ? "Unlike" : "Like"}
          onClick={() => {
            if (post.likes?.includes(user._id)) {
              handleUnlike(post._id);
            } else {
              handleLike(post._id);
            }
          }}
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
          <span className="text-sm">{post.likesCount}</span>
        </button>
        <Comment
          postId={post._id}
          user={post.user}
          commentsCount={post.commentsCount}
          isVideo
        />
        <button
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
            className="mb-1"
          />
        </button>
        <Share _id={post._id} isVideo />
      </div>
    </>
  );
}

export default VideoItem;
