"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { nameFallback } from "@/lib/helpers";
import {
  Loader2,
  MoreVertical,
  Pause,
  Play,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import React from "react";

function Videos() {
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(true);
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
      isPremium: true,
      video: "/test-1.mp4",
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
      caption: "This is a caption",
      liked: false,
      video: "/test-2.mp4",
      likesCount: 12,
      commentsCount: 1,
    },
  ]);
  const [buffering, setBuffering] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setBuffering(false);
    }, 2000);
  });

  return (
    <main className="min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 snap-y snap-mandatory overflow-auto pt-6">
      {posts.map((post, index) => (
        <section
          className="flex items-center justify-center snap-always snap-start w-full h-full py-4 scroll-pb-2"
          key={index}
        >
          <div className="h-full aspect-9/16 bg-stone-200 dark:bg-stone-800 rounded-md relative">
            <div className="flex items-center justify-start px-3 absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-transparent/60 via-transparent/50 to-transparent">
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
                <p className="text-stone-500 text-sm">@{post.user.username}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-1 p-1 rounded-full"
              >
                <MoreVertical size="25" />
              </Button>
            </div>
            {buffering ? (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent/50 p-4 rounded-full">
                <Loader2 className="animate-spin" size="50" />
              </div>
            ) : (
              ""
            )}
            <div className="flex items-center justify-start px-3 absolute bottom-0 left-0 w-full h-20 bg-gradient-to-b from-transparent via-transparent/50 to-transparent/60">
              <Button variant="ghost" size="icon" className="rounded-full p-1">
                {isPaused ? (
                  <Pause
                    size="30"
                    strokeWidth="0"
                    fill="currentColor"
                    onClick={() => setIsPaused(!isPaused)}
                  />
                ) : (
                  <Play
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
                  <Volume2Icon size="30" strokeWidth="1.2" />
                ) : (
                  <VolumeXIcon size="30" strokeWidth="1.2" />
                )}
              </Button>
              <div className="mx-3 w-full">
                <Slider
                  defaultValue={[0]}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

export default Videos;

/* React.useEffect(() => {
        const videos = Array.from(document.querySelectorAll("video"));
        const observers: IntersectionObserver[] = [];
        let topVideo: HTMLVideoElement | undefined = undefined;

        const updateTopVideo = () => {
            const sortedVideos = [...videos].sort(
                (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
            );
            const newTopVideo = sortedVideos.find(
                (video) => video.getBoundingClientRect().top >= 0
            );

            if (newTopVideo !== topVideo) {
                if (topVideo) {
                    topVideo.pause();
                }
                topVideo = newTopVideo;
                if (topVideo) {
                    topVideo.play();
                }
            }
        };

        videos.forEach((video) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting || video === topVideo) {
                            updateTopVideo();
                        }
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
        });

        return () => {
            videos.forEach((video, index) => {
                observers[index].unobserve(video);
            });
        };
    }, [videos]);

    <div className="w-full relative">
                          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full text-white bg-transparent/20 dark:bg-transparent/35 p-3">
                            <Play size="40" fill="currentColor" />
                          </div>
                          <div className="absolute bottom-2 right-2 p-2 text-white bg-transparent/20 dark:bg-transparent/35 z-20 rounded-full">
                            {isMuted ? (
                              <VolumeX
                                size="15"
                                onClick={() => setIsMuted(!isMuted)}
                              />
                            ) : (
                              <Volume2
                                size="15"
                                onClick={() => setIsMuted(!isMuted)}
                              />
                            )}
                          </div>

                          <video
                            src={image}
                            muted={isMuted}
                            preload="auto"
                            className="max-h-[40rem] w-full object-cover rounded-sm"
                            onClick={(e) => {
                              const videoElement = e.target as HTMLVideoElement;
                              if (videoElement.paused) {
                                videoElement
                                  .play()
                                  .catch((err) => console.log(err));
                              } else {
                                videoElement.pause();
                              }
                              videoElement.defaultMuted = true;
                            }}
                            onPlay={(e) => {
                              const videos =
                                document.getElementsByTagName("video");
                              const videoElement = e.target as HTMLVideoElement;
                              const pauseIcon = videoElement.parentNode
                                ?.childNodes[0] as HTMLElement;
                              pauseIcon.classList.add("hidden");
                              for (let i = 0; i < videos.length; i++) {
                                const video = videos[i];

                                if (video !== e.target) {
                                  video.pause();
                                }
                              }
                            }}
                            onPause={(e) => {
                              const videoElement = e.target as HTMLVideoElement;
                              const pauseIcon = videoElement.parentNode
                                ?.childNodes[0] as HTMLElement;
                              pauseIcon.classList.remove("hidden");
                            }}
                          />
                        </div>
     */
