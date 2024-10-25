"use client";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  MoreHorizontal,
  Pause,
  PlayIcon,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  deleteStory,
  getUserStory,
  markSelfSeen,
} from "@/lib/store/features/slices/storySlice";
import { toast } from "@/components/ui/use-toast";
import { nameFallback } from "@/lib/helpers";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Story() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading: userLoading } = useAppSelector((state) => state.user);
  const { userStory, loading } = useAppSelector((state) => state.story);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const closeRef1 = useRef<HTMLButtonElement>(null);
  const closeRef2 = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const storyContainer = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  function handleDelete() {
    if (!userStory) return;
    dispatch(deleteStory(userStory._id)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Story deleted",
          description: "Your story has been deleted successfully.",
        });
        router.push("/");
      } else {
        toast({
          title: "Cannot delete story",
          description:
            response.payload?.message ||
            "An error occurred while deleting the story.",
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
    if (!userLoading && !userStory?.media.length) dispatch(getUserStory());
  }, [dispatch, userLoading, userStory?.media]);

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

    if (userStory?.media.length === index + 1) {
      const animation = progressBarRef.current?.getAnimations()[0];
      if (animation) {
        animation.onfinish = () => {
          router.push("/");
        };
      }
    }
  }, [index, userStory, router]);

  useEffect(() => {
    if (imageLoading) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [imageLoading]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, userStory]);

  useEffect(() => {
    if (userStory?.selfSeen || index + 1 !== userStory?.media.length) return;
    dispatch(markSelfSeen());
  }, [dispatch, userStory?.selfSeen, userStory?.media.length, index]);

  if (!userStory?.media.length) {
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
      <div className="flex max-sm:hidden items-center justify-center h-full px-4 w-16">
        <button
          className={`p-1 bg-stone-200 text-black rounded-full ${
            index === 0 ? "hidden" : ""
          }`}
          disabled={index === 0}
          ref={prevRef}
          onClick={() => {
            if (index !== 0) {
              setImageLoading(true);
              setIndex(index - 1);
            } else {
              router.push("/");
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
              {userStory.media.map((_, i) => (
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
                href={`/${userStory.user.username}`}
                className="w-full flex items-center justify-start"
              >
                <Avatar className="ring-1 ring-stone-200 hover:opacity-80 transition-opacity">
                  <AvatarImage src={userStory.user.avatar} />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-start gap-0 mx-3">
                  <span className="text-stone-200 font-semibold tracking-tight">
                    {userStory.user.fullName}
                  </span>
                  <span className="text-stone-500 text-xs">
                    @{userStory.user.username}
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
                      onClick={() => setDeleteDialog(true)}
                    >
                      Delete
                    </DialogClose>
                    <DialogClose className="w-full md:px-20 py-1">
                      Cancel
                    </DialogClose>
                  </DialogContent>
                </Dialog>
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
        {userStory && (
          <>
            {imageLoading && (
              <div className="w-full grid place-items-center absolute ">
                <Loader2 className="animate-spin" size="30" />
              </div>
            )}
            <Image
              src={userStory.media[index] || ""}
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
        />
        <button
          className="w-4/5 absolute right-0 bg-transparent h-full"
          onClick={() => nextRef.current?.click()}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
        />
        {userStory?.seenBy.length > 0 && (
          <Dialog onOpenChange={setIsPaused}>
            <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
              <button className="absolute flex flex-col items-start justify-center bg-gradient-to-b from-transparent to-transparent/50 bottom-2 left-2 text-stone-400 text-xs gap-1">
                <div className="flex items-center justify-center">
                  {userStory?.likes[0]?.avatar && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={userStory?.likes[0]?.avatar} />
                      <AvatarFallback>
                        {nameFallback(userStory?.likes[0].avatar)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {userStory?.likes[1]?.avatar && (
                    <Avatar className="w-6 h-6 -ml-2">
                      <AvatarImage src={userStory?.likes[1]?.avatar} />
                      <AvatarFallback>
                        {nameFallback(userStory?.likes[1]?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {userStory?.likes[2]?.avatar && (
                    <Avatar className="w-6 h-6 -ml-2">
                      <AvatarImage src={userStory?.likes[2]?.avatar} />
                      <AvatarFallback>
                        {nameFallback(userStory?.likes[2]?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                {userStory?.seenBy.length > 0 &&
                  "Seen by " + userStory?.seenBy.length}
              </button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogTitle>Viewers</DialogTitle>
              <div className="flex flex-col gap-2 h-full">
                <ScrollArea className="h-96 sm:min-w-80 w-full px-2 pt-4">
                  {userStory?.likes.map((like, index) => (
                    <Link
                      href={`/${like.username}`}
                      key={index}
                      className="flex items-center space-x-2 w-full sm:hover:bg-stone-200 sm:hover:dark:bg-stone-800 p-2 rounded-xl"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {nameFallback(like.fullName)}
                        </AvatarFallback>
                        <AvatarImage src={like.avatar} alt={like.fullName} />
                      </Avatar>
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex flex-col leading-4">
                          <span>{like.fullName}</span>
                          <span className="text-stone-500 leading-4 text-sm">
                            @{like.username}
                          </span>
                        </div>
                        <Heart fill="rgb(244 63 94)" strokeWidth="0" />
                      </div>
                    </Link>
                  ))}
                  {userStory?.seenBy
                    .filter((user) =>
                      userStory?.likes.find((like) => like._id !== user._id)
                    )
                    .map((user, index) => (
                      <Link
                        href={`/${user.username}`}
                        key={index}
                        className="flex items-center space-x-2 w-full sm:hover:bg-stone-200 sm:hover:dark:bg-stone-800 p-2 rounded-xl"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {nameFallback(user.fullName)}
                          </AvatarFallback>
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                        </Avatar>
                        <div className="flex flex-col leading-4">
                          <span>{user.fullName}</span>
                          <span className="text-stone-500 leading-4 text-sm">
                            @{user.username}
                          </span>
                        </div>
                      </Link>
                    ))}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex max-sm:hidden items-center justify-center h-full px-4 w-16">
        <button
          disabled={index === userStory.media.length - 1}
          className={`p-1 bg-stone-200 text-black rounded-full ${
            index === userStory.media.length - 1 ? "hidden" : ""
          }`}
          ref={nextRef}
          onClick={() => {
            if (index !== userStory.media.length - 1) {
              setImageLoading(true);
              setIndex(index + 1);
            }
          }}
        >
          <ChevronRight size="20" />
        </button>
      </div>
      <AlertDialog open={deleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Story</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            story?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => {
                if (!loading) setDeleteDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/80 text-white"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Story;
