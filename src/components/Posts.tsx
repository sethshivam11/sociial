"use client";
import { Globe, Heart, Loader2, PlayIcon } from "lucide-react";
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
  unlikePost,
} from "@/lib/store/features/slices/postSlice";
import SavePost from "./SavePost";
import PostCaption from "./PostCaption";
import { useRouter } from "next/navigation";

interface Props {
  feed?: boolean;
}

function Posts({ feed }: Props) {
  const router = useRouter();
  const [savingToken, setSavingToken] = React.useState(false);
  const dispatch = useAppDispatch();
  const {
    user,
    profile,
    skeletonLoading: userLoading,
  } = useAppSelector((state) => state.user);
  const {
    skeletonLoading,
    posts,
    explorePosts,
    page,
    maxPosts,
    loading,
    maxExplorePosts,
  } = useAppSelector((state) => state.post);
  const [consentDialog, setConsentDialog] = React.useState(false);
  const [showExplorePosts, setShowExplorePosts] = React.useState(true);

  async function handleConsent() {
    setSavingToken(true);
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
            setConsentDialog(false);
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
          })
          .finally(() => setSavingToken(false));
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

  function handleLike(postId: string, type: "posts" | "explore") {
    dispatch(
      likePost({
        postId: postId,
        userId: user._id,
        type,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot like post",
          description: "Please try again later.",
        });
      }
    });
  }

  function handleUnlike(postId: string, type: "posts" | "explore") {
    dispatch(
      unlikePost({
        postId: postId,
        userId: user._id,
        type,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot unlike post",
          description: "Please try again later.",
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
    const savedExplorePostsConsent =
      localStorage.getItem("explorePostsConsent") || "true";
    if (savedExplorePostsConsent !== "false") {
      setShowExplorePosts(true);
    } else {
      setShowExplorePosts(false);
    }
    if (!feed && user._id) {
      dispatch(getFeed(1));
    } else if (profile.username) {
      dispatch(getUserPosts({ username: profile.username }));
    }
  }, [profile.username, dispatch, getFeed, exploreFeed]);

  React.useEffect(() => {
    if (!userLoading) {
      dispatch(exploreFeed({ page: 1, userId: user._id }));
    }
  }, [user._id, userLoading, exploreFeed, dispatch]);

  return (
    <>
      {posts.length > 0 && (
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
                  <Carousel
                    className={`w-full my-2 mt-2 ${
                      post.kind === "video" ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      post.kind === "video"
                        ? router.push(`/video/${post._id}`)
                        : null
                    }
                  >
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
                              className="flex absolute w-full h-full items-center justify-center z-0"
                              onDoubleClick={async (e) => {
                                if (loading || post.kind === "video") return;
                                console.log(
                                  post.likes.includes(user._id),
                                  user._id
                                );
                                if (post.likes.includes(user._id)) {
                                  handleUnlike(post._id, "posts");
                                } else {
                                  handleLike(post._id, "posts");
                                }
                              }}
                            >
                              <Heart
                                size="150"
                                strokeWidth="0"
                                fill="rgb(244 63 94)"
                                className={
                                  post.likes.includes(user._id)
                                    ? "animate-like"
                                    : "hidden"
                                }
                              />
                            </div>
                            {post.kind === "video" && (
                              <PlayIcon
                                size="50"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-transparent/50 rounded-full p-2 backdrop-blur-sm"
                              />
                            )}
                            <Image
                              width="800"
                              height="800"
                              src={
                                post.kind === "image"
                                  ? image
                                  : post.thumbnail || ""
                              }
                              priority={
                                index === 0 && postIndex < 10 ? true : false
                              }
                              alt={`Photo by ${post.user.fullName} with username ${post.user.username}`}
                              className="object-cover select-none w-full h-full rounded-sm z-10 max-h-[600px]"
                            />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  <div className="flex justify-between select-none">
                    <div className="flex gap-3">
                      <button
                        title={
                          post.likes.includes(user._id) ? "Unlike" : "Like"
                        }
                        disabled={loading}
                        onClick={() => {
                          if (post.likes.includes(user._id)) {
                            handleUnlike(post._id, "posts");
                          } else {
                            handleLike(post._id, "posts");
                          }
                        }}
                      >
                        <Heart
                          size="30"
                          className={`${
                            post.likes.includes(user._id)
                              ? "text-rose-500"
                              : "sm:hover:opacity-60"
                          } transition-all active:scale-110`}
                          fill={
                            post.likes.includes(user._id)
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
                    <SavePost post={post} />
                  </div>
                  <p className="text-sm text-stone-400 mt-1 select-none">
                    <LikeDialog
                      likesCount={post.likesCount}
                      postId={post._id}
                    />
                  </p>
                  <PostCaption
                    caption={post.caption}
                    createdAt={post.createdAt}
                  />
                </div>
              );
            })
          )}
        </InfiniteScroll>
      )}
      {!skeletonLoading && !feed && posts.length !== 0 && (
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
          next={() =>
            dispatch(exploreFeed({ page: page + 1, userId: user._id }))
          }
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
                      explorePosts
                    />
                  </div>
                  <Carousel
                    className={`w-full my-2 mt-2 ${
                      post.kind === "video" ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      post.kind === "video"
                        ? router.push(`/video/${post._id}`)
                        : null
                    }
                  >
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
                              className="flex absolute w-full h-full items-center justify-center z-0"
                              onDoubleClick={async (e) => {
                                if (loading || post.kind === "video") return;
                                console.log(
                                  post.likes.includes(user._id),
                                  user._id
                                );
                                if (post.likes.includes(user._id)) {
                                  handleUnlike(post._id, "posts");
                                } else {
                                  handleLike(post._id, "posts");
                                }
                              }}
                            >
                              <Heart
                                size="150"
                                strokeWidth="0"
                                fill="rgb(244 63 94)"
                                className={
                                  post.likes.includes(user._id)
                                    ? "animate-like"
                                    : "hidden"
                                }
                              />
                            </div>
                            {post.kind === "video" && (
                              <PlayIcon
                                size="50"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-transparent/50 rounded-full p-2 backdrop-blur-sm"
                              />
                            )}
                            <Image
                              width="800"
                              height="800"
                              src={
                                post.kind === "image"
                                  ? image
                                  : post.thumbnail || ""
                              }
                              priority={
                                index === 0 && postIndex < 10 ? true : false
                              }
                              alt={`Photo by ${post.user.fullName} with username ${post.user.username}`}
                              className="object-cover select-none w-full h-full rounded-sm z-10 max-h-[600px]"
                            />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  <div className="flex justify-between select-none">
                    <div className="flex gap-3">
                      <button
                        title={
                          post.likes.includes(user._id) ? "Unlike" : "Like"
                        }
                        disabled={loading}
                        onClick={() =>
                          post.likes.includes(user._id)
                            ? handleUnlike(post._id, "explore")
                            : handleLike(post._id, "explore")
                        }
                      >
                        <Heart
                          size="30"
                          className={`${
                            post.likes.includes(user._id)
                              ? "text-rose-500"
                              : "sm:hover:opacity-60"
                          } transition-all active:scale-110`}
                          fill={
                            post.likes.includes(user._id)
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
                    <SavePost post={post} />
                  </div>
                  <p className="text-sm text-stone-400 mt-1 select-none">
                    <LikeDialog
                      likesCount={post.likesCount}
                      postId={post._id}
                    />
                  </p>
                  <PostCaption
                    caption={post.caption}
                    createdAt={post.createdAt}
                  />
                </div>
              );
            })
          )}
        </InfiniteScroll>
      )}
      <AlertDialog open={consentDialog}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle>Recieve Notifications</AlertDialogTitle>
          <p className="dark:text-stone-400">
            Do you want to recieve notifications for messages, comments, likes,
            and updates. You can unsubscribe anytime.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg"
              onClick={() => {
                localStorage.setItem(
                  "notificationConsent",
                  `{"consent": "false","expiry": "${
                    Date.now() + 1000 * 60 * 60 * 24 * 10
                  }"}`
                );
                setConsentDialog(false);
              }}
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg"
              onClick={handleConsent}
              disabled={savingToken}
            >
              {savingToken ? <Loader2 className="animate-spin" /> : "Yes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Posts;
