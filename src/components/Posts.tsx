"use client";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import React from "react";

function Posts() {
  const [posts, setPosts] = React.useState([
    {
      user: {
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption: "This is a caption",

      image:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1715866646/cld-sample-4.jpg",
    },
  ]);
  return (
    <div className="flex flex-col py-2 px-4 gap-4 w-full pb-24">
      {posts.map((post, index) => {
        return (
          <div
            key={index}
            className="rounded-xl dark:bg-stone-800 p-4 w-full sm:w-[85%] mx-auto h-fit max-h- min-h-96 min-w-96"
          >
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8">
                  <Image
                    width={32}
                    height={32}
                    src={post.user.avatar}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold ">{post.user.fullName}</p>
                  <p className="text-sm text-gray-500 leading-3">
                    @{post.user.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal />
            </div>
            <div className="py-2 mt-2">
              <Image
                width={400}
                height={320}
                src={post.image}
                alt=""
                className="w-full dark:bg-stone-900"
              />
            </div>
            <div className="flex gap-3">
              <Heart />
              <MessageCircle />
              <ArrowUpRight />
            </div>
            <p className="py-3">{post.caption}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
