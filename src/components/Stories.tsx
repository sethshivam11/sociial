import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Stories() {
  const stories = [
    {
      name: "Shivam",
      username: "sethshivam11",
      avatar: "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
  ];
  const storyAvailable = false;
  return (
    <div className="h-30 flex overflow-x-auto w-full p-4 gap-4 no-scrollbar">
      <div className="flex flex-col items-center gap-1 relative">
        <div
          className={`w-20 h-20 rounded-full p-1 ${
            storyAvailable
              ? "bg-gradient-to-tr from-blue-800  to-red-800 sm:hover:scale-105"
              : ""
          }`}
        >
          <Image
            src={stories[0].avatar}
            alt=""
            className="w-full h-full rounded-full ring-2 ring-white dark:ring-stone-900"
            height={96}
            width={96}
          />
          <Link href="/">
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full bottom-0 end-0 sm:hover:scale-110">
              <Plus />
            </div>
          </Link>
        </div>
      </div>
      {stories.map((story, index) => {
        return (
          <Link
            href="/"
            key={index}
            className="flex flex-col items-center gap-1 sm:hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0066FF] via-white to-[#FF5454] p-1">
              <Image
                src={story.avatar}
                alt=""
                className="w-full h-full rounded-full ring-2 ring-white dark:ring-stone-900 bg-stone-800"
                height={96}
                width={96}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Stories;
