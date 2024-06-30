import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";

function Stories() {
  const stories = [
    {
      fullName: "Shivam soni",
      username: "sethshivam11",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      fullName: "Shivam",
      username: "sethshivam11",
      avatar: "https://github.com/shadcn.png",
      seen: true,
    },
    {
      fullName: "Shivam",
      username: "sethshivam11",
      avatar: "https://github.com/shadcn.png",
      seen: false,
    },
  ];
  const user = {
    fullName: "Shivam soni",
    username: "sethshivam11",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  };
  const storyAvailable = false;
  return (
    <div className="h-30 flex overflow-x-auto w-full p-4 gap-4 no-scrollbar">
      <div className="flex flex-col items-center gap-1 relative">
        <div
          className={`w-20 h-20 rounded-full p-1 ${
            storyAvailable
              ? "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500 sm:hover:scale-105"
              : ""
          }`}
        >
          <Avatar className="w-full h-full ring-2 ring-white dark:ring-black bg-white dark:bg-black">
            <AvatarImage
              src={user.avatar}
              alt=""
              className="pointer-events-none select-none"
            />
            <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
          </Avatar>
          <Link href="/">
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full bottom-0 end-0 sm:hover:scale-110">
              <Plus />
            </div>
          </Link>
        </div>
      </div>
      {stories
        .sort((a, b) => {
          const aSeen = a.seen || false;
          const bSeen = b.seen || false;

          if (aSeen === bSeen) return 0;
          return aSeen ? 1 : -1;
        })
        .map((story, index) => {
          return (
            <Link
              href={`/story/${story.username}`}
              key={index}
              className="flex flex-col items-center gap-1 sm:hover:scale-105 transition-transform"
            >
              <div
                className={`w-20 h-20 rounded-full ${
                  story.seen
                    ? "bg-stone-500"
                    : "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500"
                } p-1`}
              >
                <Avatar
                  className={`w-full h-full ring-2 ring-white dark:ring-black ${
                    story.avatar.includes("tpfx0gzsk7ywiptsb6vl.png")
                      ? "bg-[#cdd5d8]"
                      : "bg-white dark:bg-black"
                  }`}
                >
                  <AvatarImage
                    src={story.avatar}
                    alt=""
                    className={`pointer-events-none select-none ${
                      story.seen ? "opacity-70" : ""
                    }`}
                  />
                  <AvatarFallback>
                    {nameFallback(story.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
          );
        })}
    </div>
  );
}

export default Stories;
