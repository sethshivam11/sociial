"use client";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  MoreHorizontal,
  Pause,
  PlayIcon,
  SendHorizonal,
  X,
} from "lucide-react";
import React from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import EmojiKeyboard from "@/components/EmojiKeyboard";
import { stories } from "@/lib/storiesData";
import { nameFallback } from "@/lib/helpers";
import { useAppSelector } from "@/lib/store/store";
import ReportDialog from "@/components/ReportDialog";

interface Props {
  params: {
    username: string;
  };
}

interface Story {
  _id: string;
  images: {
    link: string;
  }[];
  fullName: string;
  avatar: string;
  liked: boolean;
  username: string;
}

interface LinkedStories {
  prevStory2: {
    username: string;
    fullName: string;
    image: string;
    avatar: string;
  } | null;
  prevStory1: LinkedStories["prevStory2"];
  nextStory1: LinkedStories["prevStory2"];
  nextStory2: LinkedStories["prevStory2"];
}

function Story({ params }: Props) {
  const query = useSearchParams();
  const form = useForm<{
    reply: string;
  }>({
    defaultValues: {
      reply: "",
    },
  });
  const router = useRouter();
  const { username } = params;
  const { user } = useAppSelector((state) => state.user);
  const nextRef = React.useRef<HTMLButtonElement>(null);
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const closeRef1 = React.useRef<HTMLButtonElement>(null);
  const closeRef2 = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const progressBarRef = React.useRef<HTMLSpanElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const touchStartRef = React.useRef<number>(0);
  const storyContainer = React.useRef<HTMLDivElement>(null);

  const [index, setIndex] = React.useState(0);
  const [reportDialog, setReportDialog] = React.useState(false);
  const [currentStory, setCurrentStory] = React.useState<Story | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [linkedStories, setLinkedStories] = React.useState<LinkedStories>({
    prevStory2: null,
    prevStory1: null,
    nextStory1: null,
    nextStory2: null,
  });
  const [isPaused, setIsPaused] = React.useState(true);
  const [timer, setTimer] = React.useState<Timer | null>(null);
  const [imageLoading, setImageLoading] = React.useState(true);

  function onSubmit(data: { reply: string }) {
    console.log(data.reply);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLButtonElement>) {
    setIsPaused(true);
    touchStartRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLButtonElement>) {
    const touchEnd = e.changedTouches[0].clientX;
    const delta = touchEnd - touchStartRef.current;

    if (delta > 100) {
      if (linkedStories.prevStory1 && containerRef.current) {
        router.prefetch(`/story/${linkedStories.prevStory1.username}`);
        setIsPaused(true);
        router.push(
          `/story/${linkedStories.prevStory1.username}?previous=true&skip=true`
        );
      } else {
        router.prefetch("/");
        router.push("/");
      }
    } else if (delta < -100) {
      if (linkedStories.nextStory1 && containerRef.current) {
        setIsPaused(true);
        router.prefetch(`/story/${linkedStories.nextStory1.username}`);
        router.push(`/story/${linkedStories.nextStory1.username}`);
      } else {
        router.prefetch("/");
        router.push("/");
      }
    }
  }

  class Timer {
    private timerId: NodeJS.Timeout | undefined;
    private start: number;
    private remaining: number;
    private callback: () => void;

    constructor(callback: () => void, delay: number) {
      this.remaining = delay;
      this.callback = callback;
      this.resume();
      this.start = Date.now();
      this.clear();
      this.timerId = undefined;
    }

    pause() {
      clearTimeout(this.timerId);
      this.timerId = undefined;
      this.remaining -= Date.now() - this.start;
    }

    clear() {
      if (this.timerId) {
        return clearTimeout(this.timerId);
      }
    }

    resume() {
      if (this.timerId) {
        return;
      }

      this.start = Date.now();
      this.timerId = setTimeout(this.callback, this.remaining);
    }
  }

  React.useEffect(() => {
    function getStory() {
      setLoading(true);
      stories.map((story) => {
        if (username === story.username) {
          setCurrentStory(story);
          if (query.get("previous")) {
            setIndex(story.images.length - 1);
          }
        }
      });
      setLoading(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.target === inputRef.current) {
        return;
      }
      switch (e.code) {
        case "Space":
          setIsPaused((paused) => !paused);
          break;

        case "ArrowRight":
          nextRef.current?.click();
          break;

        case "ArrowLeft":
          prevRef.current?.click();
          break;

        case "Escape":
          router.push("/");
          break;

        default:
          console.log(e.code);
          break;
      }
    }

    getStory();

    // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null;
      alert(isFullscreen);
      // if (!isFullscreen && containerRef.current) {
      containerRef.current?.requestFullscreen().catch((err) => {
        alert("Failed to enter fullscreen:" + err);
      });
      // }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("DOMContentLoaded", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("DOMContentLoaded", handleFullscreenChange);
    };
  }, []);

  React.useEffect(() => {
    if (!loading && !currentStory) {
      notFound();
    }
  }, [loading, currentStory]);

  React.useEffect(() => {
    const timer: Timer = new Timer(function () {
      nextRef.current?.click();
    }, 5000);
    setTimer(timer);
    return () => {
      timer.clear();
    };
  }, [index]);

  React.useEffect(() => {
    const animation = progressBarRef.current?.getAnimations()[0];
    if (animation) {
      isPaused ? animation.pause() : animation.play();
    }
    if (isPaused) {
      timer?.pause();
    } else {
      timer?.resume();
    }
  }, [isPaused, timer]);

  React.useEffect(() => {
    progressBarRef.current?.parentNode?.parentElement?.children[
      index - 1
    ]?.children[0]
      ?.getAnimations()[0]
      ?.finish();
    progressBarRef.current?.parentNode?.parentElement?.children[
      index + 1
    ]?.children[0]
      ?.getAnimations()[0]
      ?.finish();

    if (
      currentStory === stories[stories.length - 1] &&
      index === currentStory.images.length - 1
    ) {
      const animation = progressBarRef.current?.getAnimations()[0];
      if (animation) {
        animation.onfinish = () => {
          router.push("/");
        };
      }
    }
  }, [index]);

  React.useEffect(() => {
    if (!currentStory) return;
    const storyIndex = stories.indexOf(currentStory);
    const prevSecondStory = stories[storyIndex - 2];
    const prevFirstStory = stories[storyIndex - 1];
    const nextFirstStory = stories[storyIndex + 1];
    const nextSecondStory = stories[storyIndex + 2];
    const prevStory2 = prevSecondStory
      ? {
          username: prevSecondStory.username,
          fullName: prevSecondStory.fullName,
          avatar: prevSecondStory.avatar,
          image: prevSecondStory.images[0].link,
        }
      : null;
    const prevStory1 = prevFirstStory
      ? {
          username: prevFirstStory.username,
          fullName: prevFirstStory.fullName,
          avatar: prevFirstStory.avatar,
          image: prevFirstStory.images[0].link,
        }
      : null;
    const nextStory1 = nextFirstStory
      ? {
          username: nextFirstStory.username,
          fullName: nextFirstStory.fullName,
          avatar: nextFirstStory.avatar,
          image: nextFirstStory.images[0].link,
        }
      : null;
    const nextStory2 = nextSecondStory
      ? {
          username: nextSecondStory.username,
          fullName: nextSecondStory.fullName,
          avatar: nextSecondStory.avatar,
          image: nextSecondStory.images[0].link,
        }
      : null;
    setLinkedStories({ prevStory2, prevStory1, nextStory1, nextStory2 });
  }, [currentStory?.username]);

  React.useEffect(() => {
    if (imageLoading) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [imageLoading]);

  if (!currentStory) {
    return (
      <div className="col-span-10 h-[100dvh] bg-white dark:bg-black"></div>
    );
  }

  return (
    <div
      className="w-full col-span-10 h-[100dvh] flex items-center justify-center bg-stone-900 text-white select-none"
      ref={containerRef}
    >
      <button
        className="text-stone-100 p-2 absolute hidden sm:inline-block right-0 top-0"
        onClick={() => router.push("/")}
        ref={closeRef2}
        title="Close"
      >
        <X size="40" />
      </button>
      <div className="w-48 aspect-9/16 max-xl:w-32 max-md:hidden mx-2 rounded-sm overflow-clip relative">
        {linkedStories.prevStory2 && (
          <Link href={linkedStories.prevStory2.username}>
            <Avatar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-20 h-20 z-10">
              <AvatarImage src={linkedStories.prevStory2.avatar} alt="" />
              <AvatarFallback>
                {nameFallback(linkedStories.prevStory2.fullName)}
              </AvatarFallback>
            </Avatar>
            <Image
              src={linkedStories.prevStory2.image}
              alt=""
              width="200"
              height="350"
              className="w-full h-full blur-sm object-cover rounded-sm"
            />
          </Link>
        )}
      </div>
      <div className="w-48 aspect-9/16 max-xl:w-32 max-lg:hidden mx-2 rounded-sm overflow-clip relative">
        {linkedStories.prevStory1 && (
          <Link href={linkedStories.prevStory1.username}>
            <Avatar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-lg w-20 h-20 z-10">
              <AvatarImage src={linkedStories.prevStory1.avatar} alt="" />
              <AvatarFallback>
                {nameFallback(linkedStories.prevStory1.fullName)}
              </AvatarFallback>
            </Avatar>
            <Image
              src={linkedStories.prevStory1.image}
              alt=""
              className="w-full h-full blur-sm object-cover rounded-sm"
              width="200"
              height="350"
            />
            6{" "}
          </Link>
        )}
      </div>
      <div className="flex max-sm:hidden items-center justify-center h-full px-4 w-16">
        <button
          className={`p-1 bg-stone-200 text-black rounded-full ${
            index === 0 && !linkedStories.prevStory1 ? "hidden" : ""
          }`}
          ref={prevRef}
          onClick={() => {
            if (index === 0 && linkedStories.prevStory1) {
              if (linkedStories.prevStory1.username) {
                router.push(
                  `/story/${linkedStories.prevStory1.username}?previous=true`
                );
              } else {
                router.push("/");
              }
            } else {
              setImageLoading(true);
              setIndex(index - 1);
            }
          }}
        >
          <ChevronLeft size="20" />
        </button>
      </div>
      <div
        className="ring-1 ring-stone-800 flex items-center my-2 rounded-sm bg-black min-w-72 sm:h-[50rem] max-h-full h-fit sm:aspect-9/16 max-sm:h-full sm:w-fit w-full transition-opacity duration-200 relative"
        ref={storyContainer}
      >
        <div className="w-full absolute flex items-center justify-between p-4 pt-2 top-0 left-0 bg-gradient-to-b from-transparent/40 via-transparent/20 to-transparent pb-4">
          <div className="w-full flex flex-col justify-start">
            <div className="flex gap-0.5">
              {currentStory.images.map((_, i) => (
                <div
                  className="h-[3px] bg-stone-500 rounded-lg w-full mb-2 relative"
                  key={i}
                >
                  <span
                    className={`h-[3px] bg-stone-100 w-0 inline-block absolute rounded-lg ${
                      index === i ? "animate-story" : ""
                    } ${index >= i ? "w-full" : "w-0"}`}
                    ref={index === i ? progressBarRef : null}
                  ></span>
                </div>
              ))}
            </div>
            <div className="flex z-10">
              <Link
                href={`/${currentStory.username}`}
                className="w-full flex items-center justify-start"
              >
                <Avatar className="ring-1 ring-stone-200 hover:opacity-80 transition-opacity">
                  <AvatarImage src={currentStory.avatar} />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-start gap-0 mx-3">
                  <span className="text-stone-200 font-semibold tracking-tight">
                    {currentStory.fullName}
                  </span>
                  <span className="text-stone-500 text-xs">
                    @{currentStory.username}
                  </span>
                </div>
                <span className="text-stone-500 text-sm">&#183; 3h</span>
              </Link>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  title={isPaused ? "Play" : "Pause"}
                  className="hidden sm:inline-block"
                >
                  {isPaused ? (
                    <Pause fill="currentColor" />
                  ) : (
                    <PlayIcon fill="currentColor" />
                  )}
                </button>
                <Dialog>
                  <DialogTrigger className="w-fit" title="Options">
                    <MoreHorizontal />
                  </DialogTrigger>
                  <DialogContent className="w-full md:w-fit" hideCloseIcon>
                    <DialogClose
                      className="text-red-500 w-full md:px-20 py-1"
                      onClick={() => setReportDialog(true)}
                    >
                      Report
                    </DialogClose>
                    <DialogClose className="w-full md:px-20 py-1">
                      Cancel
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <ReportDialog
                  open={reportDialog}
                  setOpen={setReportDialog}
                  type="story"
                  entityId={currentStory._id}
                />
                <button
                  className="sm:hidden"
                  onClick={() => router.push("/")}
                  ref={closeRef1}
                  title="Close"
                >
                  <X />
                </button>
              </div>
            </div>
          </div>
        </div>
        {currentStory && (
          <>
            {imageLoading && (
              <div className="w-full grid place-items-center absolute ">
                <Loader2 className="animate-spin" size="30" />
              </div>
            )}
            <Image
              src={currentStory.images[index]?.link || ""}
              alt="Error fetching the story"
              className="max-h-full h-fit w-full object-fill select-none pointer-events-none"
              width="450"
              height="800"
              onLoad={() => setImageLoading(false)}
              priority={true}
            />
          </>
        )}
        <button
          className="w-1/5 absolute left-0 bg-transparent h-full"
          onClick={() => prevRef.current?.click()}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        <button
          className="w-4/5 absolute right-0 bg-transparent h-full"
          onClick={() => nextRef.current?.click()}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full absolute flex items-center justify-center bottom-0 p-2 bg-gradient-to-b from-transparent via-transparent/40 to-transparent/50 pt-7"
          >
            <EmojiKeyboard
              message={form.watch("reply")}
              setMessage={(emoji) => form.setValue("reply", emoji)}
            />
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder={`Reply to ${currentStory.username}`}
                      {...field}
                      ref={inputRef}
                      autoComplete="off"
                      inputMode="text"
                      className="bg-transparent rounded-full placeholder:text-stone-300 ring-2 border-0 ring-stone-200 focus-visible:ring-0 dark:focus-within:ring-offset-stone-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="px-2 w-fit hover:bg-transparent rounded-full"
              onClick={() => {
                setCurrentStory({
                  ...currentStory,
                  liked: !currentStory.liked,
                });
              }}
              type="button"
            >
              <Heart
                size="30"
                fill={currentStory.liked ? "rgb(244 63 94)" : "none"}
                className={`active:scale-110 transition-all  ${
                  currentStory.liked ? "text-rose-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="px-2 w-fit hover:bg-transparent rounded-full"
              disabled={form.getValues("reply") === ""}
              type="submit"
            >
              <SendHorizonal size="30" />
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex max-sm:hidden items-center justify-center h-full px-4 w-16">
        <button
          className={`p-1 bg-stone-200 text-black rounded-full ${
            index === currentStory.images.length - 1 &&
            !linkedStories.nextStory1
              ? "hidden"
              : ""
          }`}
          ref={nextRef}
          onClick={() => {
            if (index === currentStory.images.length - 1) {
              if (linkedStories.nextStory1?.username) {
                router.push(`/story/${linkedStories.nextStory1?.username}`);
              } else {
                router.push("/");
              }
            } else {
              setImageLoading(true);
              setIndex(index + 1);
            }
          }}
        >
          <ChevronRight size="20" />
        </button>
      </div>
      <div className="w-48 aspect-9/16 max-xl:w-32 max-md:hidden mx-2 rounded-sm overflow-clip relative">
        {linkedStories.nextStory1 && (
          <Link href={linkedStories.nextStory1.username}>
            <Avatar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-20 h-20 z-10">
              <AvatarImage src={linkedStories.nextStory1.avatar} alt="" />
              <AvatarFallback>
                {nameFallback(linkedStories.nextStory1.fullName)}
              </AvatarFallback>
            </Avatar>
            <Image
              src={linkedStories.nextStory1.image}
              alt=""
              width="200"
              height="350"
              className="w-full h-full blur-sm object-cover rounded-sm z-0"
            />
          </Link>
        )}
      </div>
      <div className="w-48 aspect-9/16 max-xl:w-32 max-lg:hidden mx-2 rounded-sm overflow-clip relative">
        {linkedStories.nextStory2 && (
          <Link href={linkedStories.nextStory2.username}>
            <Avatar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-20 h-20 z-10">
              <AvatarImage src={linkedStories.nextStory2.avatar} alt="" />
              <AvatarFallback>
                {nameFallback(linkedStories.nextStory2.fullName)}
              </AvatarFallback>
            </Avatar>
            <Image
              src={linkedStories.nextStory2.image}
              alt=""
              width="200"
              height="350"
              className="w-full h-full blur-sm object-cover rounded-sm"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Story;
