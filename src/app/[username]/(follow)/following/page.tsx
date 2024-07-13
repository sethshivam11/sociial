import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Users2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function Page() {
  const user = {
    username: "sethshivam11",
    fullName: "Shivam Soni",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  };
  const followers = [
    {
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      isFollowing: false,
    },
    {
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      isFollowing: true,
    },
    {
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      isFollowing: true,
      isPremium: true
    },
    
  ];
  return (
    <>
      {followers.length ? (
        <div className="flex flex-col gap-3 px-3 h-fit overflow-y-auto overflow-x-hidden pb-2">
          {followers.map((follower, index) => (
            <div
              className="flex items-start justify-start hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg p-2"
              key={index}
            >
              <Link
                href={`/${follower.username}`}
                className="flex items-start justify-start w-full"
              >
                <Avatar className="mx-2">
                  <AvatarImage src={follower.avatar} alt="" />
                  <AvatarFallback>
                    {nameFallback(follower.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full h-full">
                <div className="flex gap-0.5 items-center">
                  <h2 className="flex items-center justify-between w-full text-base font-semibold">
                    {follower.fullName}
                  </h2>
                  {follower.isPremium && (
                      <Image
                        src="/icons/premium.svg"
                        alt=""
                        width="20"
                        height="20"
                      />
                    )}
                  </div>
                  <p className="text-stone-500 text-sm">@{follower.username}</p>
                </div>
                  </Link>
                <div className="flex items-center justify-center bg-primary-500 text-white rounded-full w-fit h-full my-auto">
                  {follower.isFollowing ? (
                    <button className="bg-stone-500 w-20 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-stone-600 disabled:bg-stone-400 ml-4">
                      Following
                    </button>
                  ) : (
                    <button className="bg-blue-500 w-16 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-blue-700 disabled:bg-blue-400 ml-4">
                      Follow
                    </button>
                  )}
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full gap-6">
          <Users2 size="80" />
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="text-3xl tracking-tight font-bold">No Followers</h1>
            <p className="text-stone-500">
              Start connecting with others to see followers here
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
