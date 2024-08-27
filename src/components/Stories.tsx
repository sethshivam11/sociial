"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { stories } from "@/lib/storiesData";
import StoriesLoading from "./skeletons/StoriesLoading";

function Stories() {
  const user = {
    fullName: "Shivam soni",
    username: "sethshivam",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png",
  };
  const storyAvailable = false;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-30 flex overflow-x-auto w-full p-4 gap-4 no-scrollbar">
      <div className="flex flex-col items-center gap-1 relative">
        <div
          className={`w-20 h-20 rounded-full p-1 ${
            storyAvailable &&
            "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500"
          }`}
        >
          <Link
            href={storyAvailable ? `/story/${user.username}` : "/add-story"}
          >
            <Avatar
              className={`w-full h-full ring-2 ring-white dark:ring-black ${
                user.avatar.includes("r5pvoicvcxtyhjkgqk8y.png")
                  ? "bg-[#cdd5d8]"
                  : "bg-white dark:bg-black"
              }`}
            >
              <AvatarImage
                src={user.avatar}
                alt=""
                className="pointer-events-none select-none"
              />
              <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
            </Avatar>
          </Link>
          <Link href="/add-story">
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full bottom-0 end-0 sm:hover:scale-110">
              <Plus />
            </div>
          </Link>
        </div>
      </div>
      {loading ? (
        <StoriesLoading />
      ) : (
        stories.map((story, index) => {
          return (
            <Link
              href={`/story/${story.username}`}
              key={index}
              className="flex flex-col items-center gap-1 sm:hover:scale-105 transition-transform"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-bl from-red-500 via-blue-500 to-green-500 p-1">
                <Avatar
                  className={`w-full h-full ring-2 ring-white dark:ring-black ${
                    story.avatar.includes("r5pvoicvcxtyhjkgqk8y.png")
                      ? "bg-[#cdd5d8]"
                      : "bg-white dark:bg-black"
                  }`}
                >
                  <AvatarImage
                    src={story.avatar}
                    alt=""
                    className="pointer-events-none select-none"
                  />
                  <AvatarFallback>
                    {nameFallback(story.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}

export default Stories;
