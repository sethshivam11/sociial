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
  const closeRef1 = React.useRef<HTMLButtonElement>(null);
  const closeRef2 = React.useRef<HTMLButtonElement>(null);
  const progressRef = React.useRef<HTMLSpanElement>(null);
  const [index, setIndex] = React.useState(0);
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
        }
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
        }, {
          link: "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=500&h=1200&dpr=1",
        }
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

  function report(storyId: string, username: string) {
    console.log(`Reported story ${storyId} by user ${username}`);
  }

  function onSubmit(data: { reply: string }) {
    console.log(data.reply);
  }

  // React.useEffect(() => {
  // console.log(
  //   index >= currentStory.images.length - 1 &&
  //   currentStory.index >= stories.length - 1
  // );
  // const interval = setInterval(() => {
  //    {
  //     // router.push("/");
  //     return clearInterval(interval);
  //   }
  //   nextRef.current?.click();
  // }, 1500);

  // return () => clearInterval(interval);
  // }, [nextRef.current]);

  React.useEffect(() => {
    if (videoRef) {
      if (isPaused) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    }
  }, [isPaused])

  return (
    <div className="w-full col-span-10 h-screen flex items-center justify-center bg-stone-900">
      <button
        className="text-stone-100 p-2 absolute hidden sm:inline-block right-0 top-0"
        onClick={() => router.push("/")}
        ref={closeRef2}
      >
        <X size="40" />
      </button>
      <button
        className={`absolute top-1/2 left-2 -translate-y-1/2 p-1 bg-transparent/40 rounded-full ${index === 0 && currentStory.index === 0 ? "hidden" : ""
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
      >
        <ChevronLeft size="20" />
      </button>
      <button
        className={`absolute top-1/2 right-2 -translate-y-1/2 p-1 bg-transparent/40 rounded-full ${index >= currentStory.images.length - 1 &&
          currentStory.index >= stories.length - 1
          ? "hidden"
          : ""
          }`}
        ref={nextRef}
        onClick={() => {
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
      <div className="ring-1 ring-stone-800 h-[95%] flex items-center my-2 rounded-sm bg-black min-w-96 w-fit relative">
        <div className="w-full absolute flex items-center justify-between p-4 pt-2 top-0 left-0 bg-gradient-to-b from-transparent/40 via-transparent/20 to-transparent pb-4">
          <div className="w-full flex flex-col justify-start">
            <div className="flex gap-0.5">
              {currentStory.images.map((_, i) => (
                <div
                  className="h-0.5 bg-stone-500 rounded-lg w-full mb-2 relative"
                  key={i}
                >
                  <span
                    className="h-0.5 bg-stone-100 w-0 inline-block absolute"
                    ref={progressRef}
                  ></span>
                </div>
              ))}
            </div>
            <div className="flex">
              <Link
                href={`/${currentStory.username}`}
                className="w-full flex items-center justify-start"
              >
                <Avatar className="ring-1 ring-stone-200">
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
                <button className={`${currentStory.images[index].isVideo ? "" : "hidden"}`} onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ?
                    <VolumeXIcon /> : <Volume2Icon />}
                </button>
                <button onClick={() => setIsPaused(!isPaused)}>
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
                    <Dialog>
                      <DialogTrigger>
                        <button className="text-red-500 w-full md:px-20 py-1">
                          Report
                        </button>
                      </DialogTrigger>
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
                            <Label htmlFor="report-description">
                              Description
                            </Label>
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
                            onClick={() => report(currentStory._id, currentStory.username)}
                          >
                            Report
                          </Button>
                          <DialogClose>Cancel</DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <DialogClose className="w-full md:px-20 py-1">
                      Cancel
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <button
                  className="sm:hidden"
                  onClick={() => router.push("/")}
                  ref={closeRef1}
                >
                  <X />
                </button>
              </div>
            </div>
          </div>
        </div>
        {currentStory.images[index].isVideo ?
          <video src={currentStory.images[index].link} autoPlay muted={isMuted} ref={videoRef} /> :
          <img
            src={currentStory.images[index].link}
            alt=""
            className="min-h-96 object-contain max-h-full h-fit min-w-96 aspect-9/16 select-none pointer-events-none"
          />
        }
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full absolute flex items-center justify-center bottom-0 p-2 bg-gradient-to-b from-transparent via-transparent/40 to-transparent/50 pt-7"
          >
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
                className={`active:scale-110 transition-all  ${currentStory.liked ? "text-rose-500" : ""
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
