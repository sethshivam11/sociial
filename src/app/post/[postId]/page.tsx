"use client";
import MobileNav from "@/components/MobileNav";
import PostsLoading from "@/components/skeletons/PostsLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { getPost } from "@/lib/store/features/slices/postSlice";
import { notFound } from "next/navigation";
import PostItem from "@/components/PostItem";
import { Skeleton } from "@/components/ui/skeleton";

function Page({ params }: { params: { postId: string } }) {
  const dispatch = useAppDispatch();
  const { post, skeletonLoading } = useAppSelector((state) => state.post);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    dispatch(getPost(params.postId)).then((response) => {
      if (
        response.payload?.message === "Post not found" ||
        !response.payload?.success
      ) {
        setNotFoundError(true);
      }
    });
  }, [dispatch, params.postId]);

  if (notFoundError) {
    notFound();
  }

  return (
    <>
      <MobileNav />
      <div className="min-h-screen h-max xl:col-span-8 sm:col-span-9 col-span-10 flex max-lg:flex-col items-start px-4 pb-16">
        {skeletonLoading ? (
          <div className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-full mt-6 sm:mx-auto h-fit min-h-64 min-w-64">
            <PostsLoading length={1} />
          </div>
        ) : (
          <div className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-full mt-6 sm:mx-auto h-fit min-h-64 min-w-64">
            <PostItem post={post} postIndex={1} type="post" expanded />
          </div>
        )}
        <div className="flex flex-col gap-4 lg:w-1/3 md:w-2/3 sm:w-5/6 w-full sm:mx-auto lg:mx-4">
          <div className="lg:flex hidden flex-col items-center justify-start h-full mt-16 w-full bg-stone-100 dark:bg-stone-900 mx-1 rounded-xl -mb-4">
            {skeletonLoading ? (
              <div className="bg-muted size-40 -mt-12 rounded-full" />
            ) : (
              <Avatar className="w-40 h-40 -mt-12 select-none pointer-events-none">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>
                  {nameFallback(post.user.fullName)}
                </AvatarFallback>
              </Avatar>
            )}
            {skeletonLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                <Skeleton className="w-40 h-8" />
                <Skeleton className="w-24 h-5" />
              </div>
            ) : (
              <Link
                href={`/${post.user.username}`}
                className="flex flex-col items-center justify-center gap-1"
              >
                <h1 className="text-2xl tracking-tight font-bold mt-4">
                  {post.user.fullName}
                </h1>
                <p className="text-stone-500">@{post.user.username}</p>
              </Link>
            )}
            {skeletonLoading ? (
              <div className="py-4 text-center grid grid-cols-3 gap-1 w-full">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <div className="py-4 text-center grid grid-cols-3 gap-1 w-full">
                <Link
                  href={`/${post.user.username}`}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-lg">Posts</span>
                  <span>{post.user.postsCount}</span>
                </Link>
                <Link
                  href={`/${post.user.username}/followers`}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-lg">Followers</span>
                  <span>{post.user.followersCount}</span>
                </Link>
                <Link
                  href={`/${post.user.username}/following`}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-lg">Following</span>
                  <span>{post.user.followingCount}</span>
                </Link>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 bg-stone-100 dark:bg-stone-900 rounded-xl mt-4 max-md:mb-4 p-4">
            {skeletonLoading ? (
              <Skeleton className="w-48 h-5 my-3 col-span-2" />
            ) : (
              <h1 className="col-span-2 text-stone-500 mt-2 mb-4">
                {post.morePosts?.length ? "More" : "No more"} posts from @
                {post.user.username}
              </h1>
            )}
            {skeletonLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    className={`rounded-xl aspect-square ${
                      index > 3 ? "lg:hidden" : ""
                    }`}
                    key={index}
                  />
                ))
              : post.morePosts?.map((post, index) => (
                  <Link
                    href={`/post/${post._id}`}
                    key={index}
                    className="relative"
                  >
                    {post.kind === "video" && (
                      <div
                        className={`flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent/50 p-2 rounded-full text-white ${
                          index > 3 ? "lg:hidden" : ""
                        }`}
                      >
                        <Play />
                      </div>
                    )}
                    <Image
                      src={
                        post.kind === "image"
                          ? post.media[0]
                          : post.thumbnail || ""
                      }
                      className={`rounded-xl aspect-square object-cover select-none ${
                        index > 3 ? "lg:hidden" : ""
                      }`}
                      alt=""
                      width={300}
                      height={300}
                      draggable={false}
                    />
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
