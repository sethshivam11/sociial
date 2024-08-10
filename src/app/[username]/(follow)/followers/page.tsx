"use client";
import React from "react";
import { Search, Users2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { useAppSelector } from "@/lib/store/store";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

function Page() {
  const { followers, followings } = useAppSelector((state) => state.follow);
  const followersDemo = [
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      _id: "2",
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
  ];
  const [searchResults, setSearchResults] = React.useState(followers);
  const [search, setSearch] = React.useState("");

  const query = useSearchParams();

  React.useEffect(() => {
    if (search) {
      setSearchResults(
        followers.filter((follower) => {
          if (
            follower.username.includes(search) ||
            follower.fullName.includes(search)
          )
            return follower;
        })
      );
    }
  }, [search]);

  return (
    <>
      <div className="w-full bg-stone-100 dark:bg-stone-900 py-2 top-0 sticky z-10">
        <div className="flex items-center gap-2 bg-background rounded-lg w-full pl-3 focus-within:ring-2 focus-within:ring-stone-200 border">
          <Search />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputMode="text"
            autoComplete="off"
            className="focus-within:ring-offset-transparent ring-offset-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-e-lg w-full"
          />
        </div>
      </div>
      {searchResults.length ? (
        <div className="flex flex-col gap-3 px-3 h-fit overflow-y-auto overflow-x-hidden pb-2">
          {searchResults.map((follower, index) => (
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
                  <h2 className="flex items-center justify-between w-full text-base font-semibold">
                    {follower.fullName}
                  </h2>
                  <p className="text-stone-500 text-sm">@{follower.username}</p>
                </div>
              </Link>
              <div className="flex items-center justify-center bg-primary-500 text-white rounded-full w-fit h-full my-auto">
                {followings.includes(follower) ? (
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
        <div className="flex flex-col items-center justify-center h-[60vh] min-h-[28rem] px-2 w-full gap-6">
          <Users2 size="80" />
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="text-3xl tracking-tight font-bold">No Followers</h1>
            <p className="text-stone-500">
              Ask people to follow you to see them here
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
