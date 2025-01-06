"use client";
import Comment from "@/components/Comment";
import PostCaption from "@/components/PostCaption";
import Share from "@/components/Share";
import VideoLoading from "@/components/skeletons/VideoLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SliderVideo } from "@/components/ui/slider-video";
import { toast } from "@/components/ui/use-toast";
import VideoOptions from "@/components/VideoOptions";
import { nameFallback } from "@/lib/helpers";
import {
  getPost,
  likePost,
  unlikePost,
} from "@/lib/store/features/slices/postSlice";
import { savePost, unsavePost } from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  Bookmark,
  ChevronLeft,
  Heart,
  Pause,
  Play,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";

function Page({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { post, skeletonLoading, loading } = useAppSelector(
    (state) => state.post
  );
  const { user } = useAppSelector((state) => state.user);

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

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
  const handleKeys = useCallback(
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
          break;
      }
    },
    [isPaused, isMuted, videoRef]
  );

  useEffect(() => {
    if (isPaused || seeking) {
      videoRef?.pause();
    } else {
      videoRef?.play();
    }
  }, [isPaused, seeking, videoRef]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [handleKeys]);

  useEffect(() => {
    const postId = params.postId;
    if (!postId) return;
    dispatch(getPost(postId)).then((response) => {
      if (response.payload?.message === "Post not found") {
        setNotFoundError(true);
      }
    });
  }, [dispatch, params]);

  if (notFoundError) {
    notFound();
  }

  return (
    <div
      className="max-h-[100dvh] min-h-[42rem] h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 snap-y snap-mandatory overflow-auto relative no-scrollbar"
      ref={containerRef}
    >
      {skeletonLoading ? (
        <VideoLoading />
      ) : (
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
              <button
                className="px-1 py-2 rounded-xl sm:hidden mx-1 hover:bg-transparent"
                onClick={() => router.push("/")}
              >
                <ChevronLeft color="white" />
              </button>
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
                  <h1 className="text-lg tracking-tight font-semibold leading-4">
                    {post.user.fullName}
                  </h1>
                  <p className="text-stone-500 text-sm">
                    @{post.user.username}
                  </p>
                </div>
              </Link>
            </div>
            <VideoOptions
              postId={post._id}
              fullName={post.user.fullName}
              username={post.user.username}
              avatar={post.user.avatar}
            />
            <div className="flex flex-col absolute bottom-0 left-0 w-full ">
              <div className="absolute bottom-10 right-0 max-sm:flex hidden flex-col items-center justify-start gap-4 px-3 pb-10">
                <button
                  title={post.likes.includes(user._id) ? "Unlike" : "Like"}
                  disabled={loading}
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
                    fill={
                      post.likes.includes(user._id) ? "rgb(244 63 94)" : "none"
                    }
                  />
                  <span className="text-sm">{post.likesCount}</span>
                </button>
                <Comment
                  postId={post._id}
                  user={post.user}
                  commentsCount={post.commentsCount}
                  isVideo={true}
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
                      user.savedPosts.includes(post._id)
                        ? "currentColor"
                        : "none"
                    }
                    className="mb-1"
                  />
                </button>
                <Share _id={post._id} isVideo={true} />
              </div>
              <div className="flex flex-col items-center justify-start h-fit bg-gradient-to-b from-transparent via-transparent/50 to-transparent/60">
                <div className="w-full max-h-80 overflow-y-auto overflow-x-clip no-scrollbar max-sm:pr-12 pr-6 pl-6 text-lg">
                  <PostCaption
                    caption={post.caption}
                    createdAt={post.createdAt}
                  />
                </div>
                <div className="flex items-center px-2 justify-start h-fit w-full">
                  <button className="rounded-full p-1 z-10">
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
                  </button>
                  <button
                    className="rounded-full p-1 z-10"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeXIcon size="30" />
                    ) : (
                      <Volume2Icon size="30" />
                    )}
                  </button>
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
              disabled={loading}
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
              user={post.user}
              postId={post._id}
              commentsCount={post.commentsCount}
              isVideo={true}
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
            <Share _id={post._id} isVideo={true} />
          </div>
        </section>
      )}
    </div>
  );
}

export default Page;
