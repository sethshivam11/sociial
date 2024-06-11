"use client";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import React from "react";
import Comment from "./Comment";
import More from "./More";
import Share from "./Share";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Posts() {
  const [posts, setPosts] = React.useState([
    {
      _id: "1",
      user: {
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption: "This is a caption",
      liked: false,
      images: [
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
        "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      ],
      likesCount: 12,
      commentsCount: 1,
    },
  ]);
  const [comments, setComments] = React.useState([
    {
      _id: "12",
      postId: "1",
      user: {
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
  ]);
  const [comment, setComment] = React.useState("");
  function addComment(content: string, postId: string) {
    setComments([
      ...comments,
      {
        _id: `${Math.floor(Math.random() * 100)}`,
        postId: comments[0].postId,
        content,
        user: comments[0].user,
        liked: false,
        likesCount: 0,
      },
    ]);
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
            }
          : post
      )
    );
    setComment("");
  }
  function likePost(_id: string) {
    setPosts(
      posts.map((post) =>
        post._id === _id
          ? {
              ...post,
              liked: !post.liked,
              likesCount: post.liked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  }
  function likeComment(_id: string, postId: string) {
    setComments(
      comments.map((comment) =>
        comment._id === _id
          ? {
              ...comment,
              liked: !comment.liked,
              likesCount: comment.liked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            }
          : comment
      )
    );
  }
  return (
    <div className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full pb-24">
      {posts.map((post, postIndex) => {
        return (
          <div
            key={postIndex}
            className="rounded-xl bg-stone-100 dark:bg-stone-800 p-4 w-full sm:w-[85%] mx-auto h-fit max-h- min-h-64 min-w-64"
          >
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8">
                  <Image
                    width={32}
                    height={32}
                    src={post.user.avatar}
                    priority={postIndex < 10 ? true : false}
                    alt={`Photo by ${post.user.fullName} with username ${post.user.username}`}
                    className="w-full h-full rounded-full select-none pointer-events-none"
                  />
                </div>
                <div>
                  <p>{post.user.fullName}</p>
                  <p className="text-sm text-gray-500 leading-3">
                    @{post.user.username}
                  </p>
                </div>
              </div>
              <More user={post.user} postId={post._id} />
            </div>
            <Carousel className="w-full my-2 mt-2">
              <CarouselContent>
                {post.images.map((image, index) => {
                  return (
                    <CarouselItem key={index}>
                      <Image
                        width={700}
                        height={320}
                        src={image}
                        priority={index === 0 && postIndex < 10 ? true : false}
                        alt=""
                        className="object-cover select-none h-full"
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex gap-3">
              <Heart
                size="26"
                className={`${
                  post.liked ? "text-rose-500" : "sm:hover:opacity-60"
                } transition-all active:scale-110`}
                onClick={() => {
                  likePost(post._id);
                }}
                fill={post.liked ? "rgb(244 63 94)" : "none"}
              />
              <Comment
                comments={comments}
                user={post.user}
                commentsCount={post.commentsCount}
                likeComment={likeComment}
                addComment={addComment}
                comment={comment}
                setComment={setComment}
              />
              <Share />
            </div>
            <p className="text-sm text-stone-400 mt-1">
              {post.likesCount <= 1 ? "1 like" : `${post.likesCount} likes`}
              &nbsp; and&nbsp;
              {post.commentsCount <= 1
                ? "1 comment"
                : `${post.commentsCount} comments`}
            </p>
            <p className="py-1 text-sm">{post.caption}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
