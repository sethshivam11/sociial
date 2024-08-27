"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserPosts } from "@/lib/store/features/slices/postSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Page() {
  const dispatch = useAppDispatch();
  const { skeletonLoading, posts } = useAppSelector((state) => state.post);
  const { profile } = useAppSelector((state) => state.user);

  React.useEffect(() => {
    dispatch(getUserPosts({ username: profile.username }));
  }, [dispatch]);
  return (
    <div className="flex items-center justify-start flex-wrap flex-row w-full">
      {skeletonLoading ? (
        Array.from({ length: 6 }).map((_, i) => {
          return (
            <div className="lg:w-1/4 w-1/3 aspect-square p-1" key={i}>
              <Skeleton className="w-full h-full" />
            </div>
          );
        })
      ) : posts.filter((post) => post.kind === "video").length ? (
        posts
          .filter((post) => post.kind === "video")
          .map((post, index) => (
            <Link
              href={`/post/${post._id}`}
              className="lg:w-1/4 w-1/3 aspect-square p-1 relative"
              key={index}
            >
              <Image
                src={post.thumbnail || ""}
                width="300"
                height="300"
                className="w-full h-full object-cover rounded-sm select-none pointer-events-none"
                alt=""
              />
            </Link>
          ))
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-96 h-full">
          <Tv size="100" className="my-4" />
          <span className="sm:text-3xl text-xl font-bold tracking-tight">
            Nothing Here
          </span>
          <span className="sm:text-lg text-base text-stone-500">
            Share your first video post now
          </span>
        </div>
      )}
    </div>
  );
}

export default Page;
