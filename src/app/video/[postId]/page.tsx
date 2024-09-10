"use client";
import Comment from "@/components/Comment";
import PostCaption from "@/components/PostCaption";
import Share from "@/components/Share";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SliderVideo } from "@/components/ui/slider-video";
import VideoOptions from "@/components/VideoOptions";
import { nameFallback } from "@/lib/helpers";
import { getPost } from "@/lib/store/features/slices/postSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  ChevronLeft,
  Heart,
  Loader2,
  Pause,
  Play,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function Page({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { post, skeletonLoading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.user);

  const [videoRef, setVideoRef] = React.useState<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);

  function likePost(_id: string) {
    // setPost({
    //   ...post,
    //   liked: !post.liked,
    //   likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
    // });
  }

  const handleKeys = React.useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          setIsPaused(!isPaused);
          break;
        case "KeyM":
          setIsMuted(!isMuted);
          break;
        case "ArrowRight":
          if (videoRef) videoRef.currentTime = videoRef.currentTime + 5;
          break;
        case "ArrowLeft":
          if (videoRef) videoRef.currentTime = videoRef.currentTime - 5;
          break;
        default:
          console.log(e.code);
          break;
      }
    },
    [isPaused, isMuted]
  );

  React.useEffect(() => {
    if (isPaused || seeking) {
      videoRef?.pause();
    } else {
      videoRef?.play();
    }
  }, [isPaused, seeking]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [handleKeys]);

  React.useEffect(() => {
    const postId = params.postId;
    if (!postId) return;
    dispatch(getPost(postId));
  }, [dispatch, params]);

  return (
    <div
      className="max-h-[100dvh] h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 snap-y snap-mandatory overflow-auto relative no-scrollbar"
      ref={containerRef}
    >
      <section className="flex items-center justify-center snap-always snap-end w-full h-full py-2 max-sm:bg-stone-950">
        <div className="flex items-center justify-center h-full max-sm:w-full sm:aspect-9/16 bg-stone-950 text-white sm:border relative">
          <video
            className="w-full cursor-pointer object-contain max-h-full"
            preload="auto"
            poster={post?.thumbnail || ""}
            muted={isMuted}
            onClick={() => setIsPaused(!isPaused)}
            onTimeUpdate={() => {
              if (!seeking && videoRef) {
                setSliderValue(videoRef.currentTime || 0);
              }
            }}
            onProgress={(e) => {
              if (!seeking) {
                e.currentTarget.currentTime = sliderValue;
              }
            }}
            onPlaying={(e) => {
              const videos = document.querySelectorAll("video");
              videos.forEach((video) => {
                if (!video.paused && video !== e.currentTarget) {
                  video.pause();
                }
              });
              setVideoRef(e.currentTarget);
            }}
            onEnded={() => setIsPaused(true)}
            loop
            playsInline
            autoPlay
          >
            {post.media[0] && <source src={post.media[0]} />}
          </video>
          <div className="flex items-center justify-start px-3 absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-transparent/80 via-transparent/60 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className="p-1 rounded-xl sm:hidden mr-1 hover:bg-background"
              onClick={() => router.push("/")}
            >
              <ChevronLeft size="25" color="white" />
            </Button>
            {skeletonLoading ? (
              <div className="flex gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-40 h-4" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
            ) : (
              <Link
                href={`/${post.user.username}`}
                className="flex items-center justify-start"
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
                  <p className="text-stone-500 text-sm">
                    @{post.user.username}
                  </p>
                </div>
              </Link>
            )}
          </div>
          {skeletonLoading ? (
            <Skeleton className="w-5 h-10 rounded-full absolute top-2 right-2" />
          ) : (
            <VideoOptions
              postId={post._id}
              fullName={post.user.fullName}
              username={post.user.username}
              avatar={post.user.avatar}
            />
          )}
          <div className="flex flex-col absolute bottom-0 left-0 w-full ">
            <div className="absolute bottom-10 right-0 max-sm:flex hidden flex-col items-center justify-start gap-4 px-3 pb-10">
              <button
                title={post.likes.includes(user._id) ? "Unlike" : "Like"}
                onClick={() => {
                  likePost(post._id);
                }}
              >
                <Heart
                  size="30"
                  className={`${
                    post.likes.includes(user._id)
                      ? "text-rose-500"
                      : "sm:hover:opacity-60"
                  } transition-all active:scale-110`}
                  fill={
                    post.likes.includes(user._id) ? "rgb(244 63 94)" : "none"
                  }
                />
                <span className="text-sm">{post.likesCount}</span>
              </button>
              <Comment
                user={post.user}
                commentsCount={post.commentsCount}
                isVideo={true}
              />
              <Share _id={post._id} isVideo={true} />
            </div>
            <div className="flex flex-col items-center justify-start h-fit bg-gradient-to-b from-transparent via-transparent/50 to-transparent/60">
              <p className="w-full max-h-80 overflow-y-auto overflow-x-clip no-scrollbar max-sm:pr-12 pr-6 pl-6 text-lg">
                <PostCaption
                  caption={post.caption}
                  createdAt={post.createdAt}
                />
              </p>
              <div className="flex items-center px-2 justify-start h-fit w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-1 z-10"
                >
                  {isPaused ? (
                    <Play
                      size="30"
                      strokeWidth="0"
                      fill="currentColor"
                      onClick={() => setIsPaused(!isPaused)}
                    />
                  ) : (
                    <Pause
                      size="30"
                      strokeWidth="0"
                      fill="currentColor"
                      onClick={() => setIsPaused(!isPaused)}
                    />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-1 z-10"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeXIcon size="30" />
                  ) : (
                    <Volume2Icon size="30" />
                  )}
                </Button>
                <div className="mx-3 w-full z-10">
                  <SliderVideo
                    value={[sliderValue]}
                    min={0}
                    max={videoRef?.duration || 15}
                    step={1}
                    onValueChange={(value) => {
                      setSeeking(true);
                      setSliderValue(value[0]);
                    }}
                    onValueCommit={() => {
                      if (!videoRef) return;
                      setSeeking(false);
                      videoRef.currentTime = sliderValue;
                    }}
                    className="w-full "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:flex hidden flex-col items-center justify-end gap-4 px-3 pb-12 h-full">
          <button
            title={post.likes.includes(user._id) ? "Unlike" : "Like"}
            onClick={() => {
              likePost(post._id);
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
            user={post.user}
            commentsCount={post.commentsCount}
            isVideo={true}
          />
          <Share _id={post._id} isVideo={true} />
        </div>
      </section>
    </div>
  );
}

export default Page;
