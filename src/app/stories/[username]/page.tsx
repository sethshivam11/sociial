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
import { useRef, useState, useEffect, TouchEvent } from "react";
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
import { getTimeDifference, nameFallback } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import ReportDialog from "@/components/ReportDialog";
import { StoryI } from "@/types/types";
import {
  getStories,
  likeStory,
  seenStory,
  unlikeStory,
} from "@/lib/store/features/slices/storySlice";
import { toast } from "@/components/ui/use-toast";

interface Props {
  params: {
    username: string;
  };
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
  const dispatch = useAppDispatch();
  const form = useForm<{
    reply: string;
  }>({
    defaultValues: {
      reply: "",
    },
  });
  const router = useRouter();
  const { username } = params;
  const { user, loading: userLoading } = useAppSelector((state) => state.user);
  const { stories, skeletonLoading } = useAppSelector((state) => state.story);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const closeRef1 = useRef<HTMLButtonElement>(null);
  const closeRef2 = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const storyContainer = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [reportDialog, setReportDialog] = useState(false);
  const [currentStory, setCurrentStory] = useState<StoryI | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedStories, setLinkedStories] = useState<LinkedStories>({
    prevStory2: null,
    prevStory1: null,
    nextStory1: null,
    nextStory2: null,
  });
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  function onSubmit(data: { reply: string }) {
    console.log(data.reply);
    toast({
      title: "Cannot send reply",
      description: "This feature is not available yet",
      variant: "destructive",
    });
  }

  function handleTouchStart(e: TouchEvent<HTMLButtonElement>) {
    setIsPaused(true);
    touchStartRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent<HTMLButtonElement>) {
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

  function handleLike(storyId: string) {
    dispatch(likeStory({ storyId, userId: user._id })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot like story",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    });
  }

  function handleUnlike(storyId: string) {
    dispatch(unlikeStory({ storyId, userId: user._id })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot unlike story",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    });
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

  useEffect(() => {
    if (!userLoading && !stories.length) dispatch(getStories());
  }, [dispatch, userLoading, stories.length]);

  useEffect(() => {
    function getStory() {
      setLoading(true);
      stories.map((story) => {
        if (username === story.user.username) {
          setCurrentStory(story);
          if (query.get("previous")) {
            setIndex(story.media.length - 1);
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, query, username, stories]);

  useEffect(() => {
    if (
      !loading &&
      !currentStory?.media.length &&
      !skeletonLoading &&
      !stories.length
    ) {
      notFound();
    }
  }, [loading, currentStory, skeletonLoading, stories.length]);

  useEffect(() => {
    const timer: Timer = new Timer(function () {
      nextRef.current?.click();
    }, 15000);
    setTimer(timer);
    return () => {
      timer.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
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

  useEffect(() => {
    if (
      currentStory &&
      index === currentStory.media.length - 1 &&
      !currentStory.seenBy.includes(user._id)
    ) {
      dispatch(seenStory({ storyId: currentStory._id, userId: user._id }));
    }

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
      index === currentStory.media.length - 1
    ) {
      const animation = progressBarRef.current?.getAnimations()[0];
      if (animation) {
        animation.onfinish = () => {
          router.push("/");
        };
      }
    }
  }, [index, currentStory, router, stories, dispatch, user._id]);

  useEffect(() => {
    if (!currentStory) return;
    const storyIndex = stories.indexOf(currentStory);
    const prevSecondStory = stories[storyIndex - 2];
    const prevFirstStory = stories[storyIndex - 1];
    const nextFirstStory = stories[storyIndex + 1];
    const nextSecondStory = stories[storyIndex + 2];
    const prevStory2 = prevSecondStory
      ? {
          username: prevSecondStory.user.username,
          fullName: prevSecondStory.user.fullName,
          avatar: prevSecondStory.user.avatar,
          image: prevSecondStory.media[0],
        }
      : null;
    const prevStory1 = prevFirstStory
      ? {
          username: prevFirstStory.user.username,
          fullName: prevFirstStory.user.fullName,
          avatar: prevFirstStory.user.avatar,
          image: prevFirstStory.media[0],
        }
      : null;
    const nextStory1 = nextFirstStory
      ? {
          username: nextFirstStory.user.username,
          fullName: nextFirstStory.user.fullName,
          avatar: nextFirstStory.user.avatar,
          image: nextFirstStory.media[0],
        }
      : null;
    const nextStory2 = nextSecondStory
      ? {
          username: nextSecondStory.user.username,
          fullName: nextSecondStory.user.fullName,
          avatar: nextSecondStory.user.avatar,
          image: nextSecondStory.media[0],
        }
      : null;
    setLinkedStories({ prevStory2, prevStory1, nextStory1, nextStory2 });
  }, [currentStory, stories]);

  useEffect(() => {
    if (imageLoading) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [imageLoading]);

  if (!currentStory) {
    return <></>;
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
        className="ring-1 ring-stone-800 flex items-center my-2 rounded-sm bg-black min-w-72 sm:h-[50rem] max-h-full h-fit sm:aspect-9/16 max-sm:h-full sm:w-fit w-full transition-opacity duration-200 relative overflow-hidden"
        ref={storyContainer}
      >
        <div className="w-full absolute flex items-center justify-between p-4 pt-2 top-0 left-0 bg-gradient-to-b from-transparent/40 via-transparent/20 to-transparent pb-4">
          <div className="w-full flex flex-col justify-start">
            <div className="flex gap-0.5">
              {currentStory.media.map((_, i) => (
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
                href={`/${currentStory.user.username}`}
                className="w-full flex items-center justify-start"
              >
                <Avatar className="ring-1 ring-stone-200 hover:opacity-80 transition-opacity">
                  <AvatarImage src={currentStory.user.avatar} />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-start gap-0 mx-3">
                  <span className="text-stone-200 font-semibold tracking-tight">
                    {currentStory.user.fullName}
                  </span>
                  <span className="text-stone-500 text-xs">
                    @{currentStory.user.username}
                  </span>
                </div>
                <span className="text-stone-500 text-sm">
                  &#183; {getTimeDifference(currentStory.createdAt)}
                </span>
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
              src={currentStory.media[index] || ""}
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
                      placeholder={`Reply to ${currentStory.user.username}`}
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
              disabled={loading}
              onClick={() => {
                if (loading) return;
                if (currentStory.likes.includes(user._id)) {
                  handleUnlike(currentStory._id);
                } else {
                  handleLike(currentStory._id);
                }
              }}
              type="button"
            >
              <Heart
                size="30"
                fill={
                  currentStory.likes.includes(user._id)
                    ? "rgb(244 63 94)"
                    : "none"
                }
                className={`active:scale-110 transition-all  ${
                  currentStory.likes.includes(user._id) ? "text-rose-500" : ""
                }`}
              />
            </Button>
            {form.watch("reply").length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="px-2 w-fit hover:bg-transparent rounded-full"
                disabled={form.getValues("reply") === ""}
                type="submit"
              >
                <SendHorizonal size="30" />
              </Button>
            )}
          </form>
        </Form>
      </div>
      <div className="flex max-sm:hidden items-center justify-center h-full px-4 w-16">
        <button
          className={`p-1 bg-stone-200 text-black rounded-full ${
            index === currentStory.media.length - 1 && !linkedStories.nextStory1
              ? "hidden"
              : ""
          }`}
          ref={nextRef}
          onClick={() => {
            if (index === currentStory.media.length - 1) {
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
