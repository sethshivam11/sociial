"use client";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import React from "react";
import Comment from "./Comment";
import More from "./More";
import Share from "./Share";

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
      comments: [
        {
          user: {
            fullName: "Shad",
            username: "shadcn",
            avatar:
              "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
          },
          comment: "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
        },
      ],

      images: [
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1715866646/cld-sample-4.jpg",
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1715866646/cld-sample-4.jpg",
      ],
      likes: 12,
      commentsCount: 1,
    },
  ]);
  return (
    <div className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full pb-24">
      {posts.map((post, index) => {
        return (
          <div
            key={index}
            className="rounded-xl bg-stone-100 dark:bg-stone-800 p-4 w-full sm:w-[85%] mx-auto h-fit max-h- min-h-64 min-w-64"
          >
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 w-full">
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
                  <p>{post.user.fullName}</p>
                  <p className="text-sm text-gray-500 leading-3">
                    @{post.user.username}
                  </p>
                </div>
              </div>
              <More />
            </div>
            <div className="py-2 mt-2 relative">
              <button className="right-2 top-1/2 py-4 px-1 -translate-y-1/2 absolute">
                <ChevronRight className="bg-transparent/30 text-white/90 rounded-full pl-1 p-0.5 w-6 h-6" />
              </button>
              <button className="left-2 top-1/2 py-4 px-1 -translate-y-1/2 absolute">
                <ChevronLeft className="bg-transparent/30 text-white/90 rounded-full pr-1 p-0.5 w-6 h-6" />
              </button>
              <div className="w-full h-full rounded-sm overflow-x-auto flex flex-row no-scrollbar snap-x snap-mandatory">
                {post.images.map((image, index) => {
                  return (
                    <Image
                      key={index}
                      width={400}
                      height={320}
                      src={image}
                      alt=""
                      className="w-full dark:bg-stone-900 snap-center"
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <Heart size="26" className="sm:hover:opacity-60" fill="" />
              <Comment
                comments={post.comments}
                user={post.user}
                commentsCount={post.commentsCount}
              />
              <Share />
            </div>
            <p className="text-sm text-stone-400 mt-1">
              {post.likes} likes & {post.commentsCount} comments
            </p>
            <p className="py-1 text-sm">{post.caption}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
