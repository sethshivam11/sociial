"use client";
import Comment from "@/components/Comment";
import MobileNav from "@/components/MobileNav";
import PostOptions from "@/components/PostOptions";
import PostsLoading from "@/components/skeletons/PostsLoading";
import Share from "@/components/Share";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { nameFallback } from "@/lib/helpers";
import { Bookmark, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { getPost } from "@/lib/store/features/slices/postSlice";

function Page({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { post, skeletonLoading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.user);

  React.useEffect(() => {
    dispatch(getPost(params.postId));
  }, []);
  return (
    <>
      <MobileNav />
      <div className="min-h-screen h-max xl:col-span-8 sm:col-span-9 col-span-10 flex max-lg:flex-col items-start justify-center px-4">
        {skeletonLoading ? (
          <div className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-full mt-6 sm:mx-auto h-fit min-h-64 min-w-64">
            <PostsLoading length={1} />
          </div>
        ) : (
          <main className="rounded-xl bg-stone-100 dark:bg-stone-900 p-4 lg:w-1/2 md:w-2/3 sm:w-5/6 w-full mt-6 sm:mx-auto h-fit min-h-64 min-w-64">
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 w-full">
                <Link href={`/${post.user.username}`} className="w-8 h-8">
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
                  <p>{post.user.fullName}</p>
                  <p className="text-sm text-gray-500 leading-3">
                    @{post.user.username}
                  </p>
                </Link>
              </div>
              <PostOptions
                user={post.user}
                postId={post._id}
                isVideo={post.kind === "video" ? true : false}
              />
            </div>
            <Carousel className="w-full my-2">
              <CarouselContent>
                {post.media.map((image, index) => {
                  return (
                    <CarouselItem key={index} className="relative">
                      <div
                        className={`absolute w-full h-full items-center justify-center ${
                          post.likes?.includes(user._id) ? "flex" : "hidden"
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
                        width={500}
                        height={500}
                        src={image}
                        priority={index === 0 ? true : false}
                        onDoubleClick={(e) => {
                          const heartContainer = (e.target as HTMLElement)
                            .parentElement?.parentElement?.childNodes;
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
            <div className="flex justify-between select-none">
              <div className="flex gap-3">
                <button
                  title={post.likes?.includes(user._id) ? "Unlike" : "Like"}
                >
                  <Heart
                    size="30"
                    className={`${
                      post.likes?.includes(user._id)
                        ? "text-rose-500"
                        : "sm:hover:opacity-60"
                    } transition-all active:scale-110`}
                    fill={
                      post.likes?.includes(user._id) ? "rgb(244 63 94)" : "none"
                    }
                  />
                </button>
                <Comment user={post.user} commentsCount={post.commentsCount} />
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
              {post.likesCount <= 1 ? "1 like" : `${post.likesCount} likes`}
            </p>
            <p className="py-1 text-sm">
              <span>{post.caption}</span>
            </p>
          </main>
        )}
        <div className="flex flex-col gap-4 lg:w-1/3 md:w-2/3 sm:w-5/6 w-full sm:mx-auto lg:mx-4">
          <div className="lg:flex hidden flex-col items-center justify-start h-full mt-16 w-full bg-stone-100 dark:bg-stone-900 mx-1 rounded-xl -mb-4">
            <Avatar className="w-40 h-40 -mt-12 select-none pointer-events-none">
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>
                {nameFallback(post.user.fullName)}
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/${post.user.username}`}
              className="flex flex-col items-center justify-center gap-1"
            >
              <h1 className="text-2xl tracking-tight font-bold mt-4">
                {post.user.fullName}
              </h1>
              <p className="text-stone-500">@{post.user.username}</p>
            </Link>
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
          </div>
          <div className="grid grid-cols-2 gap-3 bg-stone-100 dark:bg-stone-900 rounded-xl mt-4 max-md:mb-4 p-4">
            <h1 className="col-span-2 text-stone-500 mt-2 mb-4">
              {post.morePosts?.length ? "More" : "No more"} posts from @
              {post.user.username}
            </h1>
            {post.morePosts?.map((post, index) => (
              <Link href={`/post/${post._id}`} key={index}>
                <Image
                  src={post.media[0]}
                  alt=""
                  width={300}
                  height={300}
                  className={`rounded-xl aspect-square object-cover ${
                    index > 3 ? "lg:hidden" : ""
                  }`}
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
