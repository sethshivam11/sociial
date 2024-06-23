"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";
import { Heart, MessageSquareText, Image as PostImage } from "lucide-react";

function Page() {
  const [loading, setLoading] = React.useState(false);
  const [posts, setPosts] = React.useState([
    {
      _id: "0",
      link: "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
      likesCount: 3,
      commentsCount: 5,
    },
    {
      _id: "1",
      link: "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      likesCount: 4,
      commentsCount: 1,
    },
    {
      _id: "2",
      link: "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
      likesCount: 12,
      commentsCount: 5,
    },
    {
      _id: "3",
      link: "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      likesCount: 20,
      commentsCount: 10,
    },
  ]);
  return (
    <div className="flex items-center justify-start flex-wrap flex-row w-full">
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => {
          return (
            <div className="lg:w-1/4 w-1/3 p-1" key={i}>
              <Skeleton className="h-full w-full" />
            </div>
          );
        })
      ) : posts.length ? (
        posts.map((post, index) => (
          <div
            className="lg:w-1/4 w-1/3 p-1 aspect-square relative"
            key={index}
          >
            <Image
              src={post.link}
              width="300"
              height="300"
              className="w-full h-full object-cover rounded-sm select-none pointer-events-none"
              alt=""
            />
            <div className="flex items-center justify-start px-2 gap-1 absolute w-full h-8 bottom-0 bg-gradient-to-b from-transparent via-transparent/30 to-transparent/80 text-xs">
              <span>
                <Heart className="inline" fill="currentColor" size="12" />{" "}
                {post.likesCount}
              </span>
              <span>
                <MessageSquareText
                  className="inline"
                  fill="currentColor"
                  size="12"
                />{" "}
                {post.commentsCount}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-96 h-full">
          <PostImage size="100" className="my-4" />
          <span className="sm:text-3xl text-xl font-bold tracking-tight">
            Nothing Here
          </span>
          <span className="sm:text-lg text-base text-stone-500">
            Share your first post now
          </span>
        </div>
      )}
    </div>
  );
}

export default Page;
