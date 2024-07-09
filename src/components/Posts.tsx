"use client";
import { Bookmark, Heart } from "lucide-react";
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
import PostsLoading from "./PostsLoading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Tags from "./Tags";
import Link from "next/link";

interface Post {
  _id: string;
  user: {
    fullName: string;
    username: string;
    avatar: string;
    isPremium?: boolean;
  };
  caption: string;
  liked: boolean;
  images: string[];
  likesCount: number;
  commentsCount: number;
  tags?: Post["user"][];
}

function Posts() {
  const [posts, setPosts] = React.useState<Post[]>([
    {
      _id: "1",
      user: {
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        isPremium: true,
      },
      caption:
        "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
      liked: false,
      images: [
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_90/v1715866646/cld-sample-4.jpg",
        "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      ],
      tags: [
        {
          avatar: "https://github.com/shadcn.png",
          fullName: "John Doe",
          username: "johndoe",
        },
      ],
      likesCount: 12,
      commentsCount: 1,
    },
    {
      _id: "4",
      user: {
        fullName: "Shivam",
        username: "sethshivam11",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      caption:
        "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
      liked: false,
      images: [
        "https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      ],
      tags: [
        {
          avatar: "https://github.com/shadcn.png",
          fullName: "John Doe",
          username: "johndoe",
        },
      ],
      likesCount: 12,
      commentsCount: 1,
    },
  ]);
  const [loading, setLoading] = React.useState(false);
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
    {
      _id: "13",
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
  function addComment(content: string, postId: string) {
    setComments([
      {
        _id: `${Math.floor(Math.random() * 100)}`,
        postId: comments[0].postId,
        content,
        user: comments[0].user,
        liked: false,
        likesCount: 0,
      },
      ...comments,
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
    <div className="flex flex-col py-2 sm:px-4 px-2 gap-4 w-full pb-4">
      {loading ? (
        <PostsLoading />
      ) : (
        posts.map((post, postIndex) => {
          return (
            <div
              key={postIndex}
              className="rounded-xl bg-stone-100 dark:bg-stone-900 p-4 w-full sm:w-[85%] mx-auto min-h-64 min-w-64"
            >
              <div className="flex justify-between w-full">
                <Link
                  href={`/${post.user.username}`}
                  className="flex items-center gap-2 w-full group"
                >
                  <div className="w-8 h-8">
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
                  </div>
                  <div>
                    <p className="flex items-center justify-start gap-0.5">
                      <span className="group-hover:underline underline-offset-2">
                        {post.user.fullName}
                      </span>
                      {post.user.isPremium ? (
                        <Image
                          src="/icons/premium.svg"
                          width="20"
                          height="20"
                          alt=""
                          className="w-5"
                        />
                      ) : (
                        ""
                      )}
                    </p>
                    <p className="text-sm text-gray-500 leading-3">
                      @{post.user.username}
                    </p>
                  </div>
                </Link>
                <More user={post.user} postId={post._id} />
              </div>
              <Carousel className="w-full my-2 mt-2">
                <CarouselContent>
                  {post.images.map((image, index) => {
                    return (
                      <CarouselItem key={index} className="relative">
                        <div className="absolute right-2 top-2 bg-transparent/60 text-white px-2 py-0.5 rounded-2xl text-sm">
                          {post.images.length > 1
                            ? `${index + 1}/${post.images.length}`
                            : ""}
                        </div>
                        <Tags tags={post.tags} />
                        <div
                          className={`absolute w-full h-full items-center justify-center ${
                            post.liked ? "flex" : "hidden"
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
                          width={700}
                          height={320}
                          src={image}
                          priority={
                            index === 0 && postIndex < 10 ? true : false
                          }
                          onDoubleClick={(e) => {
                            likePost(post._id);
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
                    title={post.liked ? "Unlike" : "Like"}
                    onClick={() => {
                      likePost(post._id);
                    }}
                  >
                    <Heart
                      size="30"
                      className={`${
                        post.liked ? "text-rose-500" : "sm:hover:opacity-60"
                      } transition-all active:scale-110`}
                      fill={post.liked ? "rgb(244 63 94)" : "none"}
                    />
                  </button>
                  <Comment
                    comments={comments}
                    user={post.user}
                    commentsCount={post.commentsCount}
                    likeComment={likeComment}
                    addComment={addComment}
                  />
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
                <span>{post.caption.slice(0, 30)}&nbsp;</span>
                <button
                  className="text-stone-500"
                  onClick={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    const span = btn.parentElement
                      ?.childNodes[0] as HTMLElement;
                    if (span.innerHTML !== post.caption) {
                      span.innerHTML = post.caption;
                      btn.innerHTML = "&nbsp;less";
                    } else {
                      span.innerHTML = post.caption.slice(0, 30);
                      btn.innerHTML = "&nbsp;more";
                    }
                  }}
                >
                  more
                </button>
              </p>
            </div>
          );
        })
      )}
      <div className="text-center sm:mb-4 mb-20 mt-3 relative">
        <span className="bg-white dark:bg-black px-2">No more posts</span>
        <hr className="-mt-3 bg-stone-500 border-stone-500" />
      </div>
    </div>
  );
}

export default Posts;
