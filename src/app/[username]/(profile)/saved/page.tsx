"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";
import { Heart, MessageSquareText, Image as PostImage } from "lucide-react";
import Link from "next/link";

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
      likesCount: 3,
      commentsCount: 5,
    },
    {
      _id: "2",
      link: "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
      likesCount: 3,
      commentsCount: 5,
    },
    {
      _id: "3",
      link: "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      likesCount: 3,
      commentsCount: 5,
    },
  ]);
  return (
    <div className="flex items-center justify-start flex-wrap flex-row w-full">
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => {
          return (
            <div className="lg:w-1/4 w-1/3 aspect-square p-1" key={i}>
              <Skeleton className="w-full h-full" />
            </div>
          );
        })
      ) : posts.length ? (
        posts.map((post, index) => (
          <Link
            href={`/post/${post._id}`}
            className="lg:w-1/4 w-1/3 aspect-square p-1 relative"
            key={index}
          >
            <Image
              src={post.link}
              width="300"
              height="300"
              className="w-full h-full object-cover rounded-sm select-none pointer-events-none"
              alt=""
            />
          </Link>
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
