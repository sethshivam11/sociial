"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";
import { Heart, MessageSquareText, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { getUserPosts } from "@/lib/store/features/slices/postSlice";

function Page() {
  const dispatch = useAppDispatch();
  const {
    user,
    profile,
    skeletonLoading: userLoading,
  } = useAppSelector((state) => state.user);
  const { posts, skeletonLoading: postLoading } = useAppSelector(
    (state) => state.post
  );

  React.useEffect(() => {
    if (!profile.username) return;
    dispatch(getUserPosts({ username: profile.username }));
  }, [dispatch, getUserPosts, profile.username]);
  return (
    <div className="flex items-center justify-start flex-wrap flex-row w-full">
      {userLoading || postLoading ? (
        Array.from({ length: 6 }).map((_, i) => {
          return (
            <div className="lg:w-1/4 w-1/3 aspect-square p-1" key={i}>
              <Skeleton className="h-full w-full" />
            </div>
          );
        })
      ) : posts.length ? (
        posts.map((post, index) => (
          <Link
            href={`/post/${post._id}`}
            className="lg:w-1/4 w-1/3 p-1 aspect-square relative select-none"
            key={index}
          >
            <Image
              src={post.media[0]}
              width="300"
              height="300"
              className="w-full h-full object-cover rounded-sm select-none pointer-events-none"
              alt=""
            />
            <div className="p-1 absolute w-full h-8 bottom-0 left-0 text-xs text-white">
              <div className="flex items-center md:justify-start gap-1 w-full h-full bg-gradient-to-b from-transparent rounded-sm via-transparent/30 to-transparent/80 px-2">
                <span>
                  <Heart className="inline" fill="currentColor" size="12" />
                  &nbsp;{post.likesCount}
                </span>
                <span>
                  <MessageSquareText
                    className="inline"
                    fill="currentColor"
                    size="12"
                  />
                  &nbsp;{post.commentsCount}
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-96 h-full">
          <ImageIcon size="100" className="my-4" />
          <span className="sm:text-3xl text-xl font-bold tracking-tight">
            Nothing Here
          </span>
          <span className="sm:text-lg text-base text-stone-500">
            {user.username === profile.username
              ? "Share your first post now"
              : "No posts yet"}
          </span>
        </div>
      )}
    </div>
  );
}

export default Page;
