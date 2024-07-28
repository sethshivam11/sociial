"use client";
import Comment from "@/components/Comment";
import Share from "@/components/Share";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SliderVideo } from "@/components/ui/slider-video";
import VideoOptions from "@/components/VideoOptions";
import { nameFallback } from "@/lib/helpers";
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
import React, { useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";

function Videos() {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [videoRef, setVideoRef] = React.useState<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [posts, setPosts] = React.useState([
    {
      _id: "2",
      user: {
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption:
        "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
      liked: false,
      video:
        "https://res.cloudinary.com/dv3qbj0bn/video/upload/f_auto:video,q_auto/v1/samples/dance-2",
      likesCount: 12,
      commentsCount: 1,
    },
    {
      _id: "3",
      user: {
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption:
        "In the vibrant world of social media, where every moment is captured and shared, we find ourselves scrolling through an endless feed of memories and stories. Among these, a post catches our eye, a video accompanied by a caption that reads: \"This is a caption which is very long and I don't know what to write in it so, I am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊\". It's a simple yet heartfelt message from a user named Shivam, known among his followers for his engaging content and genuine interactions. His avatar, a familiar face to many, signals another piece of content ready to spark joy and provoke thought. As we delve deeper, we encounter another post, this one succinct with the words: \"This is a caption\". It's a stark contrast to the previous one, yet it holds its own charm and simplicity. Each post, with its unique caption, video, and engagement metrics, tells a story, invites interaction, and builds connections. In this digital age, where every second is documented and shared, these posts are more than just content; they are windows into the lives of others, offering glimpses of their world, their thoughts, and their moments of vulnerability and joy. As we continue to scroll, we're reminded of the power of sharing, the beauty of connection, and the endless possibilities that come with opening up to the world.",
      liked: false,
      video:
        "https://res.cloudinary.com/dv3qbj0bn/video/upload/f_auto:video,q_auto/v1/sociial/videos/tnw4jy33z047bskwwhyt",
      likesCount: 12,
      commentsCount: 1,
    },
  ]);
  const [buffering, setBuffering] = React.useState(false);
  const [comments, setComments] = React.useState([
    {
      _id: "12",
      postId: "1",
      user: {
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
    {
      _id: "13",
      postId: "1",
      user: {
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
    {
      _id: "12",
      postId: "1",
      user: {
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
    {
      _id: "12",
      postId: "1",
      user: {
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
  ]);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  function likePost(_id: string) {
    setPosts(
      posts.map((post) =>
        post._id === _id
          ? {
              ...post,
              liked: !post.liked,
              likesCount: post.liked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  }
  function addComment(content: string, postId: string) {
    setComments([
      {
        _id: `${Math.floor(Math.random() * 100)}`,
        postId: comments[0].postId,
        content,
        user: comments[0].user,
        liked: false,
        likesCount: 0,
      },
      ...comments,
    ]);
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
            }
          : post
      )
    );
  }
  function likeComment(_id: string, postId: string) {
    setComments(
      comments.map((comment) =>
        comment._id === _id
          ? {
              ...comment,
              liked: !comment.liked,
              likesCount: comment.liked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            }
          : comment
      )
    );
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
          console.log(e.code);
          break;
      }
    },
    [isPaused, isMuted]
  );

  const debounce = useDebounceCallback((entry: IntersectionObserverEntry) => {
    const videoElement = entry.target as HTMLVideoElement;
    if (entry.isIntersecting) {
      videoElement.currentTime = 0;
      videoElement.play().then(() => {
        setIsPaused(false);
        if (!videoElement.paused && !entry.isIntersecting) {
          videoElement.pause();
        }
      });
    } else {
      videoElement.pause();
    }
  }, 100);

  React.useEffect(() => {
    const videos = document.querySelectorAll("video");
    const observers: IntersectionObserver[] = [];

    videos.forEach((video) => {
      if (video) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setSliderValue(0);
              if (entry.isIntersecting) debounce(entry);
            });
          },
          {
            threshold: 0.9,
            root: containerRef.current,
            rootMargin: "100px",
          }
        );
        observer.observe(video);
        observers.push(observer);
        const containerRect = containerRef.current?.getBoundingClientRect();
        const videoRect = video.getBoundingClientRect();
        if (
          containerRect &&
          videoRect.top >= containerRect.top &&
          videoRect.bottom <= containerRect.bottom
        ) {
          video.play().then(() => {
            setIsPaused(false);
            setSliderValue(0);
          });
        }
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [posts.length]);

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

  return (
    <div
      className="max-h-[100dvh] h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 snap-y snap-mandatory overflow-auto relative no-scrollbar"
      ref={containerRef}
    >
      {posts.map((post, index) => (
        <section
          className="flex items-center justify-center snap-always snap-end w-full h-full py-2 max-sm:bg-stone-950"
          key={index}
        >
          <div className="flex items-center justify-center h-full max-sm:w-full sm:aspect-9/16 bg-stone-950 text-white sm:border relative">
            <video
              className="w-full cursor-pointer"
              preload="auto"
              muted={isMuted}
              onClick={() => setIsPaused(!isPaused)}
              onWaiting={() => setBuffering(true)}
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
                setBuffering(false);
              }}
              onEnded={() => setIsPaused(true)}
              playsInline
            >
              <source src={post.video} />
            </video>
            <div className="flex items-center justify-start pr-3 absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-transparent/80 via-transparent/60 to-transparent">
              <Button
                variant="ghost"
                size="icon"
                className="p-1 w-fit rounded-xl sm:hidden mx-1 hover:bg-transparent"
                onClick={() => router.push("/")}
              >
                <ChevronLeft color="white" />
              </Button>
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
                  <p className="text-stone-400 text-sm">
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
            {buffering && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent/50 p-4 rounded-full animate-visible">
                <Loader2 className="animate-spin" size="50" />
              </div>
            )}
            <div className="flex flex-col absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent via-transparent/50 to-transparent/60">
              <div className="absolute bottom-10 right-0 max-sm:flex hidden flex-col items-center justify-start gap-4 px-3 pb-10">
                <button
                  title={post.liked ? "Unlike" : "Like"}
                  onClick={() => {
                    likePost(post._id);
                  }}
                >
                  <Heart
                    size="30"
                    className={`${
                      post.liked ? "text-rose-500" : "sm:hover:opacity-60"
                    } transition-all active:scale-110`}
                    fill={post.liked ? "rgb(244 63 94)" : "none"}
                  />
                  <span className="text-sm">{post.likesCount}</span>
                </button>
                <Comment
                  comments={comments}
                  user={post.user}
                  commentsCount={post.commentsCount}
                  likeComment={likeComment}
                  addComment={addComment}
                  isVideo={true}
                />
                <Share _id={post._id} isVideo={true} />
              </div>
              <p className="w-full max-h-80 overflow-y-auto overflow-x-clip no-scrollbar max-sm:pr-12 pr-6 pl-6 text-sm">
                <span>{post.caption.slice(0, 80)}&nbsp;</span>
                <button
                  className="text-stone-400 text-left"
                  onClick={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    const span = btn.parentElement
                      ?.childNodes[0] as HTMLElement;
                    if (span.innerHTML !== "") {
                      span.innerHTML = "";
                      btn.classList.remove("text-stone-400");
                      btn.innerHTML = post.caption;
                    } else {
                      span.innerHTML = post.caption.slice(0, 80);
                      btn.classList.add("text-stone-400");
                      btn.innerHTML = "&nbsp;more";
                    }
                  }}
                >
                  more
                </button>
              </p>
              <div className="flex items-center justify-start px-3 h-fit">
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
                    className={`w-full ${
                      containerRef.current?.childNodes ? "" : "hidden"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sm:flex hidden flex-col items-center justify-end gap-4 px-3 pb-12 h-full">
            <button
              title={post.liked ? "Unlike" : "Like"}
              onClick={() => {
                likePost(post._id);
              }}
            >
              <Heart
                size="30"
                className={`${
                  post.liked ? "text-rose-500" : "sm:hover:opacity-60"
                } transition-all active:scale-110`}
                fill={post.liked ? "rgb(244 63 94)" : "none"}
              />
              <span className="text-sm">{post.likesCount}</span>
            </button>
            <Comment
              comments={comments}
              user={post.user}
              commentsCount={post.commentsCount}
              likeComment={likeComment}
              addComment={addComment}
              isVideo={true}
            />
            <Share _id={post._id} isVideo={true} />
          </div>
        </section>
      ))}
    </div>
  );
}

export default Videos;
