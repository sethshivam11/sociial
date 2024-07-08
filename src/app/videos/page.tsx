"use client";
import Comment from "@/components/Comment";
import MobileNav from "@/components/MobileNav";
import Share from "@/components/Share";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { nameFallback } from "@/lib/helpers";
import {
  ArrowLeft,
  Heart,
  Loader2,
  MoreVerticalIcon,
  Pause,
  Play,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDebounceCallback } from "usehooks-ts";

function Videos() {
  const router = useRouter();
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
        isPremium: true,
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
  const [unfollowDialog, setUnfollowDialog] = React.useState(false);
  const [reportDialog, setReportDialog] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);

  function unfollow(username: string) {
    console.log(`Unfollowed user ${username}`);
  }

  function report(postId: string, username: string) {
    console.log(`Reported post ${postId} by user ${username}`);
  }

  async function copyLink(username: string, postId: string) {
    const link = `${process.env.NEXT_PUBLIC_LINK || ""}/post/${postId}`;
    if (navigator.clipboard === undefined) {
      return toast({
        title: "Error",
        description: "An error occurred while copying the link.",
        variant: "destructive",
      });
    }
    await navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "The link has been copied to your clipboard.",
    });
  }
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

  const debounce = useDebounceCallback((entry: IntersectionObserverEntry) => {
    const videoElement = entry.target as HTMLVideoElement;
    videoElement.play().then(() => {
      setIsPaused(false);
      if (!videoElement.paused && !entry.isIntersecting) {
        videoElement.pause();
      }
    });
  }, 300);

  React.useEffect(() => {
    const videos = document.querySelectorAll("video");
    const observers: IntersectionObserver[] = [];

    videos.forEach((video) => {
      if (video) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              debounce(entry);
            });
          },
          {
            threshold: 0.9,
            root: null,
            rootMargin: "100px",
          }
        );
        observer.observe(video);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [posts]);

  React.useEffect(() => {
    if (isPaused) {
      videoRef?.pause();
    } else {
      videoRef?.play();
    }
  }, [isPaused]);

  return (
    <div className="max-h-[100dvh] h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 snap-y snap-mandatory overflow-auto relative no-scrollbar">
      {posts.map((post, index) => (
        <section
          className="flex items-center justify-center snap-always snap-end w-full h-full py-2 max-sm:bg-stone-950"
          key={index}
        >
          <div className="flex items-center justify-center h-full max-sm:w-full sm:aspect-9/16 bg-stone-950 text-white sm:border relative">
            <video
              className="w-full object-contain aspect-square videoPlayer"
              preload="auto"
              muted={isMuted}
              onClick={() => setIsPaused(!isPaused)}
              onWaiting={() => setBuffering(true)}
              onTimeUpdate={() =>
                setSliderValue(Math.ceil(videoRef?.currentTime || 0))
              }
              onPlaying={(e) => {
                setVideoRef(e.currentTarget);
                setBuffering(false);
              }}
              onEnded={() => setIsPaused(true)}
              playsInline
            >
              <source src={post.video} />
            </video>
            <div className="flex items-center justify-start px-3 absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-transparent/80 via-transparent/60 to-transparent">
              <Button
                variant="ghost"
                size="icon"
                className="p-1 rounded-xl sm:hidden mr-1"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size="25" color="white" />
              </Button>
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
                {post.user.isPremium ? (
                  <Image
                    src="/icons/premium.svg"
                    alt=""
                    width="20"
                    height="20"
                    className="w-5 h-5 pointer-events-none select-none"
                  />
                ) : (
                  ""
                )}
              </Link>
            </div>
            <Dialog>
              <DialogTrigger
                className="w-fit h-fit absolute top-2 right-2 rounded-full hover:bg-stone-800 p-2"
                title="Options"
                asChild
              >
                <MoreVerticalIcon />
              </DialogTrigger>
              <DialogContent
                className="w-full md:w-fit"
                hideCloseIcon
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogClose
                  className="text-red-500 w-full md:px-20 py-1"
                  onClick={() => setReportDialog(true)}
                >
                  Report
                </DialogClose>
                <DialogClose
                  className="text-red-500 w-full md:px-20 py-1"
                  onClick={() => setUnfollowDialog(true)}
                >
                  Unfollow
                </DialogClose>
                <DialogClose
                  className="w-full md:px-20 py-1"
                  onClick={() => copyLink(post.user.username, post._id)}
                >
                  Copy link
                </DialogClose>
                <DialogClose
                  className="w-full md:px-20 py-1"
                  onClick={() => router.push(`/video/${post._id}`)}
                >
                  Open post
                </DialogClose>
                <DialogClose
                  className="w-full md:px-20 py-1"
                  onClick={() => router.push(`/${post.user.username}`)}
                >
                  Go to Account
                </DialogClose>
                <DialogClose className="w-full md:px-20 py-1">
                  Cancel
                </DialogClose>
              </DialogContent>
            </Dialog>
            <AlertDialog open={unfollowDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <Image
                      width="80"
                      height="80"
                      className="mx-auto select-none pointer-events-none"
                      src={post.user.avatar}
                      alt=""
                    />
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Unfollow&nbsp;
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      {post.user.fullName}
                    </span>
                    &nbsp;&#183; @{post.user.username}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex w-full sm:flex-col-reverse sm:gap-2 sm:justify-center items-center sm:space-x-0">
                  <AlertDialogCancel
                    autoFocus={false}
                    className="w-full"
                    onClick={() => setUnfollowDialog(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="w-full bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => unfollow(post.user.username)}
                  >
                    Unfollow
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog open={reportDialog}>
              <DialogContent
                className="sm:w-2/3 w-full h-fit flex flex-col bg-stone-100 dark:bg-stone-900"
                hideCloseIcon
              >
                <DialogTitle className="text-center text-2xl my-1 ">
                  Report Post
                </DialogTitle>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="report-title">Title</Label>
                    <Input
                      id="report-title"
                      placeholder="What is the issue?"
                      className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                      id="report-description"
                      placeholder="Describe the issue in detail."
                      rows={5}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-file">
                    Image
                    <span className="text-stone-500 text-sm">
                      &nbsp;(Optional)
                    </span>
                  </Label>
                  <Input
                    type="file"
                    id="report-file"
                    accept="image/*"
                    className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1 ring-stone-200"
                  />
                </div>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => report(post._id, post.user.username)}
                  >
                    Report
                  </Button>
                  <DialogClose onClick={() => setReportDialog(false)}>
                    Cancel
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {buffering ? (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent/50 p-4 rounded-full animate-visible">
                <Loader2 className="animate-spin" size="50" />
              </div>
            ) : (
              <div className="flex flex-col absolute bottom-0 left-0 w-full ">
                <div className="flex flex-col items-end justify-start gap-5 px-3 w-full pb-10">
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
                <p className="absolute bottom-10 w-full pr-12 pl-6 text-sm bg-gradient-to-b from-transparent via-transparent/60 to-transparent-90">
                  <span>{post.caption.slice(0, 80)}&nbsp;</span>
                  <button
                    className="text-stone-500"
                    onClick={(e) => {
                      const btn = e.target as HTMLButtonElement;
                      const span = btn.parentElement
                        ?.childNodes[0] as HTMLElement;
                      if (span.innerHTML !== post.caption) {
                        span.innerHTML = post.caption;
                        btn.innerHTML = "&nbsp;less";
                      } else {
                        span.innerHTML = post.caption.slice(0, 80);
                        btn.innerHTML = "&nbsp;more";
                      }
                    }}
                  >
                    more
                  </button>
                </p>
                <div className="flex items-center justify-start px-3 h-fit bg-gradient-to-b from-transparent via-transparent/50 to-transparent/60">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full p-1"
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
                    className="rounded-full p-1"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeXIcon size="30" />
                    ) : (
                      <Volume2Icon size="30" />
                    )}
                  </Button>
                  <div className="mx-3 w-full">
                    <Slider
                      value={[sliderValue]}
                      min={0}
                      max={videoRef?.duration || 15}
                      step={1}
                      onValueChange={(value) => {
                        if (videoRef) {
                          videoRef.currentTime = value[0] || 0;
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export default Videos;
