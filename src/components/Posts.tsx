"use client";
import {
  Bookmark,
  Globe,
  Heart,
  ImageIcon,
  Loader2,
  PlayIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
import { handleConsent, nameFallback } from "@/lib/helpers";
import Link from "next/link";
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
import PostCaption from "./PostCaption";
import { useRouter } from "next/navigation";
import {
  checkExistingToken,
  saveToken,
} from "@/lib/store/features/slices/notificationPreferenceSlice";
import { getBasicFollow } from "@/lib/store/features/slices/followSlice";
import { savePost, unsavePost } from "@/lib/store/features/slices/userSlice";
import PostItem from "./PostItem";

interface Props {
  feed?: boolean;
}

function Posts({ feed }: Props) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout>();
  const [savingToken, setSavingToken] = useState(false);
  const dispatch = useAppDispatch();
  const { user, profile } = useAppSelector((state) => state.user);
  const {
    skeletonLoading,
    posts,
    explorePosts,
    page,
    maxPosts,
    maxExplorePosts,
  } = useAppSelector((state) => state.post);
  const [consentDialog, setConsentDialog] = useState(false);
  const [showExplorePosts, setShowExplorePosts] = useState(true);

  async function handleSaveToken() {
    setSavingToken(true);
    const response = await handleConsent();
    if (response?.toast) {
      toast(response.toast);
    } else if (response.token) {
      await dispatch(saveToken(response.token));
      setConsentDialog(false);
    }
    setSavingToken(false);
  }

  useEffect(() => {
    if (!feed) {
      dispatch(getFeed(1));
    } else if (profile.username) {
      dispatch(getUserPosts({ username: profile.username }));
    }
    dispatch(getBasicFollow());

    const savedConsent = JSON.parse(
      localStorage.getItem("notificationConsent") ||
        `{"consent": false,"expiry": 0, "token": null, "lastChecked": null}`
    );

    if (!savedConsent?.consent && savedConsent?.expiry < Date.now()) {
      timerRef.current = setTimeout(() => setConsentDialog(true), 10000);
    } else if (savedConsent?.consent && Notification.permission !== "granted") {
      localStorage.setItem(
        "notificationConsent",
        '{"consent": false,"expiry": 0, "token": null}'
      );
      timerRef.current = setTimeout(() => setConsentDialog(true), 5000);
    } else if (
      savedConsent?.token &&
      Notification.permission === "granted" &&
      savedConsent?.lastChecked - Date.now() > 600_000
    ) {
      dispatch(checkExistingToken(savedConsent.token)).then((response) => {
        if (!response.payload?.success) {
          handleSaveToken();
        }
      });
    }

    const savedExplorePostsConsent =
      localStorage.getItem("explorePostsConsent") || "true";
    if (savedExplorePostsConsent !== "false") {
      setShowExplorePosts(true);
    } else {
      setShowExplorePosts(false);
    }

    return () => clearTimeout(timerRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.username, dispatch, feed]);
  useEffect(() => {
    if (!user._id || feed) return;
    dispatch(exploreFeed({ page: 1, userId: user._id }));
  }, [dispatch, user._id, feed]);

  return (
    <>
      {feed && !skeletonLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <ImageIcon size="80" className="my-4" />
          <h1 className="sm:text-3xl text-xl font-bold tracking-tight">
            Nothing Here
          </h1>
          <p className="sm:text-lg text-base text-stone-500">
            {user.username === profile.username
              ? "Share your first post now"
              : "No posts yet"}
          </p>
        </div>
      )}
      {posts.length > 0 && (
        <InfiniteScroll
          dataLength={posts.length}
          hasMore={posts.length < maxPosts}
          loader={<Loader2 className="animate-spin mx-auto" />}
          next={() => dispatch(getFeed(page + 1))}
          className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full sm:pb-4 max-w-xl mx-auto"
        >
          {skeletonLoading ? (
            <PostsLoading />
          ) : (
            posts.map((post, index) => (
              <PostItem post={post} postIndex={index} key={index} />
            ))
          )}
        </InfiniteScroll>
      )}
      {!skeletonLoading &&
        !feed &&
        posts.length !== 0 &&
        explorePosts.length !== 0 && (
          <div
            className={`flex flex-col items-center justify-center gap-2 sm:my-8 ${
              showExplorePosts ? "my-5" : "mt-5 mb-20"
            }`}
          >
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
          className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full sm:pb-4 pb-20 relative max-w-xl mx-auto"
        >
          {skeletonLoading ? (
            <PostsLoading />
          ) : (
            explorePosts.map((post, index) => (
              <PostItem post={post} postIndex={index} key={index} />
            ))
          )}
        </InfiniteScroll>
      )}
      <AlertDialog open={consentDialog}>
        <AlertDialogContent>
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
                  `{"consent": false,"expiry": ${
                    Date.now() + 1000 * 60 * 60 * 24 * 10
                  }}`
                );
                setConsentDialog(false);
              }}
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg"
              onClick={handleSaveToken}
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
