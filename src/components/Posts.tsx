"use client";
import { Bookmark, Globe, Heart, Loader2, PlayIcon } from "lucide-react";
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
  AlertDialogTrigger,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import LikeDialog from "./LikeDialog";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  exploreFeed,
  getFeed,
  getUserPosts,
  likePost,
} from "@/lib/store/features/slices/postSlice";
import { savePost } from "@/lib/store/features/slices/userSlice";

interface Props {
  feed?: boolean;
}

function Posts({ feed }: Props) {
  const dispatch = useAppDispatch();
  const { user, loading, profile, savedPosts } = useAppSelector(
    (state) => state.user
  );
  const {
    skeletonLoading,
    posts,
    explorePosts,
    page,
    maxPosts,
    maxExplorePosts,
  } = useAppSelector((state) => state.post);
  const [consentDialog, setConsentDialog] = React.useState(false);
  const [showExplorePosts, setShowExplorePosts] = React.useState(false);

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

  async function handleDoubleTap(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    postId: string
  ) {
    const heartContainer = (e.target as HTMLElement).parentElement
      ?.parentElement?.childNodes;
    setTimeout(
      () =>
        heartContainer?.forEach((child) => {
          (child.childNodes[0] as HTMLElement).classList.add("hidden");
        }),
      500
    );
    dispatch(
      likePost({
        postId: postId,
        userId: user._id,
      })
    ).then((response) => {
      if (response.payload?.success) {
        return;
      } else {
        toast({
          title: "Cannot like post",
          description: "Please try again later.",
        });
      }
    });
  }

  function handleSave(postId: string) {
    dispatch(savePost(postId)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Post saved",
          description: "You can view it later in your saved posts.",
        });
      } else {
        toast({
          title: "Cannot save post",
          description: "Please try again later.",
        });
      }
    });
  }
  function handleUnsave (postId: string) {
    
  }

  function checkSavedPost(postId: string) {
    if (savedPosts.length === 0) return false;
    savedPosts.forEach((post) => {
      if (
        typeof post === "string"
          ? post === postId
          : post.hasOwnProperty("_id") && post._id === postId
      )
        return true;
    });
    return false;
  }

  React.useEffect(() => {
    const savedConsent = JSON.parse(
      localStorage.getItem("notificationConsent") || "{}"
    );
    if (!savedConsent.consent || savedConsent.expiry < Date.now()) {
      setConsentDialog(true);
    }
    const savedExplorePostsConsent =
      localStorage.getItem("explorePostsConsent") || "false";
    if (savedExplorePostsConsent !== "false") {
      setShowExplorePosts(true);
    } else {
      setShowExplorePosts(false);
    }
    if (!feed) {
      dispatch(getFeed(1)).then(() => dispatch(exploreFeed(1)));
    } else if (profile.username) {
      dispatch(getUserPosts({ username: profile.username }));
    }
  }, [profile.username, dispatch, getFeed, exploreFeed]);

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={posts.length < maxPosts}
        loader={<Loader2 className="animate-spin mx-auto" />}
        next={() => dispatch(getFeed(page + 1))}
        className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full sm:pb-4 pb-20"
      >
        {skeletonLoading ? (
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
                    isVideo={post.kind === "video"}
                  />
                </div>
                {post.kind === "video" ? (
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
                      <source src={post.media[0]} />
                    </video>
                  </Link>
                ) : (
                  <Carousel className="w-full my-2 mt-2">
                    <CarouselContent>
                      {post.media.map((image, index) => {
                        return (
                          <CarouselItem key={index} className="relative">
                            {post.media?.length < 1 && (
                              <div className="absolute right-2 top-2 bg-transparent/60 text-white px-2 py-0.5 rounded-2xl text-sm select-none">
                                {index + 1}/{post.media.length}
                              </div>
                            )}
                            <div
                              className={`absolute w-full h-full items-center justify-center ${
                                post.likes?.includes(user._id)
                                  ? "flex"
                                  : "hidden"
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
                              width="800"
                              height="800"
                              src={image}
                              priority={
                                index === 0 && postIndex < 10 ? true : false
                              }
                              onDoubleClick={(e) =>
                                handleDoubleTap(e, post._id)
                              }
                              alt={`Photo by ${post.user.fullName} with username ${post.user.username}`}
                              className="object-cover select-none w-full h-full rounded-sm max-h-[600px]"
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
                      title={post.likes?.includes(user._id) ? "Unlike" : "Like"}
                      onClick={() =>
                        dispatch(
                          likePost({ postId: post._id, userId: user._id })
                        )
                      }
                    >
                      <Heart
                        size="30"
                        className={`${
                          post.likes?.includes(user._id)
                            ? "text-rose-500"
                            : "sm:hover:opacity-60"
                        } transition-all active:scale-110`}
                        fill={
                          post.likes?.includes(user._id)
                            ? "rgb(244 63 94)"
                            : "none"
                        }
                      />
                    </button>
                    <Comment
                      user={post.user}
                      commentsCount={post.commentsCount}
                    />
                    <Share _id={post._id} />
                  </div>
                  <button className="mr-1">
                    <Bookmark
                      size="30"
                      className="w-full h-full"
                      fill={checkSavedPost(post._id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <p className="text-sm text-stone-400 mt-1 select-none">
                  <LikeDialog likesCount={post.likesCount} postId={post._id} />
                </p>
                {post.caption && (
                  <p className="py-1 text-sm">
                    <span>{post.caption.slice(0, 30)}&nbsp;</span>
                    {post?.caption?.length > 30 && (
                      <button
                        className="text-stone-500 select-none"
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
                    )}
                  </p>
                )}
              </div>
            );
          })
        )}
      </InfiniteScroll>
      {!skeletonLoading && !feed && (
        <div className="flex flex-col items-center justify-center gap-2 my-8">
          <Globe size="60" />
          <h2 className="text-xl font-bold tracking-tight">
            You&apos;ve got to the end of your scroll
          </h2>
          <p>
            <span className="text-stone-500">
              {showExplorePosts ? (
                "Now showing Explore posts"
              ) : (
                <>You&apos;re missing out many posts you may like</>
              )}
            </span>
            &nbsp;
            {showExplorePosts ? (
              <AlertDialog>
                <AlertDialogTrigger className="text-blue-500">
                  Turn off
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>
                    You&apos;re missing out many posts you may like
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You can turn on Explore posts to see more posts from other
                    users.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        localStorage.setItem("explorePostsConsent", "false");
                        setShowExplorePosts(false);
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <button
                className="text-blue-500"
                onClick={() => {
                  setShowExplorePosts(!showExplorePosts);
                  localStorage.setItem("explorePostsConsent", "true");
                }}
              >
                Turn on
              </button>
            )}
          </p>
        </div>
      )}
      {showExplorePosts && !feed && (
        <InfiniteScroll
          dataLength={explorePosts.length}
          hasMore={explorePosts.length < maxExplorePosts}
          loader={<Loader2 className="animate-spin mx-auto" />}
          next={() => dispatch(exploreFeed(page + 1))}
          className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full sm:pb-4 pb-20"
        >
          {skeletonLoading ? (
            <PostsLoading />
          ) : (
            explorePosts.map((post, postIndex) => {
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
                      isVideo={post.kind === "video"}
                    />
                  </div>
                  {post.kind === "video" ? (
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
                        <source src={post.media[0]} />
                      </video>
                    </Link>
                  ) : (
                    <Carousel className="w-full my-2 mt-2">
                      <CarouselContent>
                        {post.media.map((image, index) => {
                          return (
                            <CarouselItem key={index} className="relative">
                              <div className="absolute right-2 top-2 bg-transparent/60 text-white px-2 py-0.5 rounded-2xl text-sm select-none">
                                {post.media.length > 1
                                  ? `${index + 1}/${post.media.length}`
                                  : ""}
                              </div>
                              <div
                                className={`absolute w-full h-full items-center justify-center ${
                                  post.likes?.includes(user._id)
                                    ? "flex"
                                    : "hidden"
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
                                  likePost({
                                    postId: post._id,
                                    userId: user._id,
                                  });
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
                                className="object-cover select-none w-full max-h-[600px] rounded-sm"
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
                        title={
                          post.likes?.includes(user._id) ? "Unlike" : "Like"
                        }
                        onClick={() =>
                          dispatch(
                            likePost({ postId: post._id, userId: user._id })
                          )
                        }
                      >
                        <Heart
                          size="30"
                          className={`${
                            post.likes?.includes(user._id)
                              ? "text-rose-500"
                              : "sm:hover:opacity-60"
                          } transition-all active:scale-110`}
                          fill={
                            post.likes?.includes(user._id)
                              ? "rgb(244 63 94)"
                              : "none"
                          }
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
                      onClick={() => handleSave(post._id)}
                    >
                      <Bookmark
                        size="30"
                        className="w-full h-full"
                        fill={
                          checkSavedPost(post._id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>
                  <p className="text-sm text-stone-400 mt-1 select-none">
                    <LikeDialog
                      likesCount={post.likesCount}
                      postId={post._id}
                    />
                  </p>
                  {post.caption && (
                    <p className="py-1 text-sm">
                      <span>{post.caption.slice(0, 30)}&nbsp;</span>
                      {post?.caption?.length > 30 && (
                        <button
                          className="text-stone-500"
                          onClick={(e) => {
                            const btn = e.target as HTMLButtonElement;
                            const span = btn.parentElement
                              ?.childNodes[0] as HTMLElement;
                            if (span.innerHTML !== post.caption) {
                              span.innerHTML = post.caption || "";
                              btn.innerHTML = "&nbsp;less";
                            } else {
                              span.innerHTML = post.caption.slice(0, 30);
                              btn.innerHTML = "&nbsp;more";
                            }
                          }}
                        >
                          more
                        </button>
                      )}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </InfiniteScroll>
      )}
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
