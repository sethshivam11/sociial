"use client";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreHorizontal,
  Pause,
  PlayIcon,
  SendHorizonal,
  Volume2Icon,
  VolumeXIcon,
  X,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
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
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import EmojiKeyboard from "@/components/EmojiKeyboard";

interface Props {
  params: {
    username: string;
  };
}

interface Story {
  _id: string;
  index: number;
  images: {
    link: string;
    isVideo?: boolean;
  }[];
  fullName: string;
  avatar: string;
  liked: boolean;
  username: string;
  isVideo?: boolean;
}

function Story({ params }: Props) {
  const form = useForm<{
    reply: string;
  }>({
    defaultValues: {
      reply: "",
    },
  });
  const router = useRouter();
  const { username } = params;
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const closeRef1 = React.useRef<HTMLButtonElement>(null);
  const closeRef2 = React.useRef<HTMLButtonElement>(null);
  const progressBarRef = React.useRef<HTMLSpanElement>(null);
  const [index, setIndex] = React.useState(0);
  const [reportDialog, setReportDialog] = React.useState(false);
  const [stories, setStories] = React.useState<Story[]>([
    {
      _id: "1",
      index: 0,
      images: [
        {
          link: "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
        },
        {
          link: "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=500&h=1200&dpr=1",
        },
      ],
      fullName: "John Doe",
      username: username,
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      liked: false,
    },
    {
      _id: "2",
      index: 1,
      images: [
        {
          link: "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
        },
        {
          link: "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=500&h=1200&dpr=1",
        },
      ],
      fullName: "John Doe",
      username: username,
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      liked: false,
    },
  ]);
  const [currentStory, setCurrentStory] = React.useState<Story>(stories[0]);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [timer, setTimer] = React.useState<Timer | null>(null);

  function report(storyId: string, username: string) {
    console.log(`Reported story ${storyId} by user ${username}`);
  }

  function onSubmit(data: { reply: string }) {
    console.log(data.reply);
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
    const timer: Timer = new Timer(function () {
      console.log("new timer");
      nextRef.current?.click();
    }, 15000);
    setTimer(timer);
  }, [currentStory]);

  React.useEffect(() => {
    if (videoRef) {
      if (isPaused) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    }
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

    const animation = progressBarRef.current?.getAnimations()[0];

    if (
      stories.length - 1 === index &&
      currentStory.index === stories.length - 1
    ) {
      if (animation) {
        animation.onfinish = () => {
          router.push("/");
        };
      }
    }
  }, [index]);

  return (
    <div className="w-full col-span-10 h-[100dvh] flex items-center justify-center bg-stone-900">
      <button
        className="text-stone-100 p-2 absolute hidden sm:inline-block right-0 top-0"
        onClick={() => router.push("/")}
        ref={closeRef2}
        title="Close"
      >
        <X size="40" />
      </button>
      <button
        className={`absolute top-1/2 left-2 -translate-y-1/2 p-1 bg-transparent/40 rounded-full ${
          index === 0 && currentStory.index === 0 ? "hidden" : ""
        }`}
        onClick={() => {
          if (index === 0 && currentStory.index > 0) {
            setCurrentStory(
              stories[
                currentStory.index > 0
                  ? currentStory.index - 1
                  : currentStory.index
              ]
            );
            setIndex(currentStory.images.length - 1);
          } else if (index > 0) {
            setIndex(index - 1);
          }
        }}
        ref={prevRef}
      >
        <ChevronLeft size="20" />
      </button>
      <button
        className={`absolute top-1/2 right-2 -translate-y-1/2 p-1 bg-transparent/40 rounded-full ${
          index >= currentStory.images.length - 1 &&
          currentStory.index >= stories.length - 1
            ? "hidden"
            : ""
        }`}
        ref={nextRef}
        onClick={() => {
          console.log("click");
          if (
            index === currentStory.images.length - 1 &&
            currentStory.index < stories.length - 1
          ) {
            setCurrentStory(
              stories[
                currentStory.index < stories.length - 1
                  ? currentStory.index + 1
                  : currentStory.index
              ]
            );
            setIndex(0);
          } else if (index >= 0 && index < currentStory.images.length - 1) {
            setIndex(index + 1);
          }
        }}
      >
        <ChevronRight size="20" />
      </button>
      <div className="ring-1 ring-stone-800 flex items-center my-2 rounded-sm bg-black min-w-72 sm:h-[50rem] max-h-full h-fit aspect-9/16 sm:w-fit w-full relative">
        <div className="w-full absolute flex items-center justify-between p-4 pt-2 top-0 left-0 bg-gradient-to-b from-transparent/40 via-transparent/20 to-transparent pb-4">
          <div className="w-full flex flex-col justify-start">
            <div className="flex gap-0.5">
              {currentStory.images.map((_, i) => (
                <div
                  className="h-[3px] bg-stone-500 rounded-lg w-full mb-2 relative"
                  key={i}
                >
                  <span
                    className={`h-[3px] bg-stone-100 w-0 inline-block absolute ${
                      index === i ? "animate-story" : ""
                    } ${index > i ? "w-full" : "w-0"}`}
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
                    {currentStory.username}
                  </span>
                </div>
                <span className="text-stone-500 text-sm">&#183; 3h</span>
              </Link>
              <div className="flex items-center justify-center gap-2">
                <button
                  className={`${
                    currentStory.images[index].isVideo ? "" : "hidden"
                  }`}
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
                </button>
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
                <Dialog open={reportDialog}>
                  <DialogContent
                    className="sm:w-2/3 w-full h-fit flex flex-col bg-stone-100 dark:bg-stone-900"
                    hideCloseIcon
                  >
                    <DialogTitle className="text-center text-2xl my-1 ">
                      Report Story
                    </DialogTitle>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="report-title">Title</Label>
                        <Input
                          id="report-title"
                          placeholder="Title for the issue"
                          className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="report-description">Description</Label>
                        <Textarea
                          id="report-description"
                          placeholder="Detailed description of the issue"
                          rows={5}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() =>
                          report(currentStory._id, currentStory.username)
                        }
                      >
                        Report
                      </Button>
                      <DialogClose onClick={() => setReportDialog(false)}>
                        Cancel
                      </DialogClose>
                    </DialogFooter>
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
        {currentStory.images[index].isVideo ? (
          <video
            src={currentStory.images[index].link}
            autoPlay
            muted={isMuted}
            ref={videoRef}
          />
        ) : (
          <Image
            src={currentStory.images[index].link}
            alt={`Story ${currentStory.index + 1} by ${currentStory.username}`}
            className="max-h-full h-fit w-full object-contain select-none pointer-events-none"
            width="768"
            height="1024"
          />
        )}
        <button
          className="w-1/2 absolute left-0 bg-transparent h-full"
          onClick={() => nextRef.current?.click()}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
        />
        <button
          className="w-1/2 absolute right-0 bg-transparent h-full"
          onClick={() => prevRef.current?.click()}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
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
                      autoComplete="off"
                      inputMode="text"
                      className="bg-transparent rounded-full placeholder:text-stone-300 border-0 ring-2 ring-stone-200 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-none focus-within:ring-offset-transparent"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="px-2 w-fit hover:bg-transparent rounded-full"
              onClick={() =>
                setCurrentStory({ ...currentStory, liked: !currentStory.liked })
              }
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
    </div>
  );
}

export default Story;
