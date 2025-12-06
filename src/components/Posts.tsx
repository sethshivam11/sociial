"use client";
import { Globe, ImageIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PostsLoading from "./skeletons/PostsLoading";
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
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  exploreFeed,
  getFeed,
  getUserPosts,
} from "@/lib/store/features/slices/postSlice";
import { getBasicFollow } from "@/lib/store/features/slices/followSlice";
import PostItem from "./PostItem";

interface Props {
  feed?: boolean;
}

function Posts({ feed }: Props) {
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
  const [showExplorePosts, setShowExplorePosts] = useState(true);

  useEffect(() => {
    if (!feed) {
      dispatch(getFeed(1));
    } else if (profile.username) {
      dispatch(getUserPosts({ username: profile.username }));
    }
    dispatch(getBasicFollow());

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
              <PostItem
                post={post}
                postIndex={index}
                type="posts"
                key={index}
              />
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
              <PostItem
                post={post}
                postIndex={index}
                type="explore"
                key={index}
              />
            ))
          )}
        </InfiniteScroll>
      )}
    </>
  );
}

export default Posts;
