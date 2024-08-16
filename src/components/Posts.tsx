"use client";
import { Bookmark, Heart, Loader2, PlayIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import Comment from "./Comment";
import PostOptions from "./PostOptions";
import Share from "./Share";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PostsLoading from "./skeletons/PostsLoading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Link from "next/link";
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";
import { useAppSelector } from "@/lib/store/store";
import LikeDialog from "./LikeDialog";
import InfiniteScroll from "react-infinite-scroll-component";

interface Post {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
  };
  caption: string;
  liked: boolean;
  images: string[];
  video?: {
    link: string;
  };
  likesCount: number;
  commentsCount: number;
}

function Posts() {
  const { loading } = useAppSelector((state) => state.post);
  const [posts, setPosts] = React.useState<Post[]>([
    {
      _id: "1",
      user: {
        _id: "0",
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption:
        "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
      liked: false,
      images: [
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
        "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      ],
      likesCount: 12,
      commentsCount: 1,
    },
    {
      _id: "4",
      user: {
        _id: "1",
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption:
        "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
      liked: false,
      images: [
        "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      ],
      likesCount: 12,
      commentsCount: 1,
    },
    {
      _id: "7",
      user: {
        _id: "2",
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption:
        "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
      liked: false,
      images: [],
      video: {
        link: "https://res.cloudinary.com/dv3qbj0bn/video/upload/f_auto:video,q_auto/v1/samples/dance-2",
      },
      likesCount: 12,
      commentsCount: 1,
    },
  ]);
  const [consentDialog, setConsentDialog] = React.useState(false);
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

  async function handleConsent() {
    await Notification.requestPermission().then(async (result) => {
      if (result === "granted") {
        await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })
          .then(() => {
            localStorage.setItem(
              "notificationConsent",
              `{"consent": "true","expiry": "null"}`
            );
          })
          .catch((err) => {
            console.log(err);
            toast({
              title: "Something went wrong",
              description: "Please try again later.",
            });
            localStorage.setItem(
              "notificationConsent",
              `{"consent": "false","expiry": "${Date.now()}"}`
            );
          });
      } else {
        localStorage.setItem(
          "notificationConsent",
          `{"consent": "false","expiry": "null"}`
        );
        toast({
          title: "Notification Permission Denied",
          description: "Please allow it in order to recieve notifications.",
          variant: "destructive",
        });
      }
    });
  }

  React.useEffect(() => {
    const savedConsent = JSON.parse(
      localStorage.getItem("notificationConsent") || "{}"
    );
    if (!savedConsent.consent || savedConsent.expiry < Date.now()) {
      setConsentDialog(true);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full sm:pb-4 pb-20">
        {/* <InfiniteScroll
        dataLength={posts.length}
        hasMore
        > */}
          {loading ? (
            <PostsLoading />
          ) : (
            posts.map((post, postIndex) => {
              return (
                <div
                  key={postIndex}
                  className="rounded-xl bg-stone-100 dark:bg-stone-900 p-4 w-full sm:w-[85%] mx-auto min-h-64 min-w-64"
                >
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2 w-full">
                      <Link className="w-8 h-8" href={`/${post.user.username}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={post.user.avatar}
                            alt=""
                            className="pointer-events-none select-none"
                          />
                          <AvatarFallback>
                            {nameFallback(post.user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <Link href={`/${post.user.username}`}>
                        <p className="flex items-center justify-start gap-0.5">
                          <span>{post.user.fullName}</span>
                        </p>
                        <p className="text-sm text-gray-500 leading-3">
                          @{post.user.username}
                        </p>
                      </Link>
                    </div>
                    <PostOptions
                      user={post.user}
                      postId={post._id}
                      isVideo={post.video ? true : false}
                    />
                  </div>
                  {post.video ? (
                    <Link href={`/video/${post._id}`} className="relative">
                      <PlayIcon
                        size="50"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-transparent/50 rounded-full p-2"
                      />
                      <video
                        preload="metadata"
                        className="w-full my-2 object-contain rounded-sm"
                        playsInline
                      >
                        <source src={post.video.link} />
                      </video>
                    </Link>
                  ) : (
                    <Carousel className="w-full my-2 mt-2">
                      <CarouselContent>
                        {post.images.map((image, index) => {
                          return (
                            <CarouselItem key={index} className="relative">
                              <div className="absolute right-2 top-2 bg-transparent/60 text-white px-2 py-0.5 rounded-2xl text-sm select-none">
                                {post.images.length > 1
                                  ? `${index + 1}/${post.images.length}`
                                  : ""}
                              </div>
                              <div
                                className={`absolute w-full h-full items-center justify-center ${
                                  post.liked ? "flex" : "hidden"
                                }`}
                              >
                                <Heart
                                  size="150"
                                  strokeWidth="0"
                                  fill="rgb(244 63 94)"
                                  className="animate-like"
                                />
                              </div>
                              <Image
                                width={700}
                                height={320}
                                src={image}
                                priority={
                                  index === 0 && postIndex < 10 ? true : false
                                }
                                onDoubleClick={(e) => {
                                  likePost(post._id);
                                  const heartContainer = (
                                    e.target as HTMLElement
                                  ).parentElement?.parentElement?.childNodes;
                                  setTimeout(
                                    () =>
                                      heartContainer?.forEach((child) => {
                                        (
                                          child.childNodes[0] as HTMLElement
                                        ).classList.add("hidden");
                                      }),
                                    500
                                  );
                                }}
                                alt={`Photo by ${post.user.fullName} with username ${post.user.username}`}
                                className="object-cover select-none w-full h-full rounded-sm"
                              />
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                  <div className="flex justify-between select-none">
                    <div className="flex gap-3">
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
                      </button>
                      <Comment
                        user={post.user}
                        commentsCount={post.commentsCount}
                      />
                      <Share _id={post._id} />
                    </div>
                    <button
                      className="mr-1"
                      onClick={(e) => {
                        const icon = e.target as HTMLElement;
                        if (icon.getAttribute("fill") === "currentColor") {
                          icon.setAttribute("fill", "none");
                        } else {
                          (e.target as HTMLElement).setAttribute(
                            "fill",
                            "currentColor"
                          );
                        }
                      }}
                    >
                      <Bookmark size="30" className="w-full h-full" />
                    </button>
                  </div>
                  <p className="text-sm text-stone-400 mt-1 select-none">
                    <LikeDialog
                      likesCount={post.likesCount}
                      postId={post._id}
                    />
                  </p>
                  <p className="py-1 text-sm">
                    <span>{post.caption.slice(0, 30)}&nbsp;</span>
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
                          span.innerHTML = post.caption.slice(0, 30);
                          btn.innerHTML = "&nbsp;more";
                        }
                      }}
                    >
                      more
                    </button>
                  </p>
                </div>
              );
            })
          )}
        {/* </InfiniteScroll> */}
      </div>

      <AlertDialog
        open={consentDialog}
        onOpenChange={(open) => {
          if (!loading) {
            setConsentDialog(open);
          }
        }}
      >
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle>Recieve Notifications</AlertDialogTitle>
          <p className="dark:text-stone-400">
            Do you want to recieve notifications for messages, comments, likes,
            and updates. You can unsubscribe anytime.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg"
              onClick={() =>
                localStorage.setItem(
                  "notificationConsent",
                  `{"consent": "false","expiry": "${
                    Date.now() + 1000 * 60 * 60 * 24 * 10
                  }"}`
                )
              }
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg"
              onClick={handleConsent}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Yes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Posts;
