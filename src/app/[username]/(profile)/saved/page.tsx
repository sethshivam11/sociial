"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect } from "react";
import { ImageIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { getSavedPosts } from "@/lib/store/features/slices/userSlice";

function Page() {
  const dispatch = useAppDispatch();
  const { user, skeletonLoading, savedPosts } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!user._id) return;
    dispatch(getSavedPosts());
  }, [dispatch, user._id]);

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
      ) : savedPosts.length ? (
        savedPosts.map((post, index) => (
          <Link
            href={
              post.kind === "image" ? `/post/${post._id}` : `/video/${post._id}`
            }
            className="lg:w-1/4 w-1/3 aspect-square p-1 relative"
            key={index}
          >
            {post.kind === "video" && (
              <div className="bg-transparent/50 text-sm text-white backdrop-blur-sm rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2">
                <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              </div>
            )}
            <Image
              src={post.kind === "image" ? post.media[0] : post.thumbnail || ""}
              width="300"
              height="300"
              className="w-full h-full object-cover rounded-sm select-none pointer-events-none"
              alt=""
            />
          </Link>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-96 h-full">
          <ImageIcon size="100" className="my-4" />
          <span className="sm:text-3xl text-xl font-bold tracking-tight">
            Nothing Here
          </span>
          <span className="sm:text-lg text-base text-stone-500">
            Save posts now
          </span>
        </div>
      )}
    </div>
  );
}

export default Page;
