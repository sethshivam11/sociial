"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

function Suggestions() {
  const [users, setUsers] = React.useState([
    {
      name: "Shad",
      username: "shadcn",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      loading: false,
    },
    {
      name: "Shad",
      username: "shadcn",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      loading: false,
    },
    {
      name: "Shad",
      username: "shadcn",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      loading: false,
    },
    {
      name: "Shad",
      username: "shadcn",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      loading: false,
    },
  ]);
  return (
    <div className="py-8 px-2 lg:flex hidden flex-col gap-4 lg:col-span-3">
       <div className="bg-stone-100 dark:bg-stone-800 pt-4 p-6 rounded-2xl">
        <h1 className="text-xl">Suggestions</h1>
        <div className="flex flex-col w-full p-1 mt-4 gap-5">
          {users.length ? (
            users.map((user, index) => {
              return (
                <div
                  className="flex items-center justify-between gap-3"
                  key={index}
                >
                  <Link href="/">
                    <div className="w-1/2 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt="" />
                        <AvatarFallback>SN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0 leading-3">
                        <span className="text-md font-semibold">
                          {user.name}
                        </span>
                        <span className="text-sm text-stone-400">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="bg-blue-500 w-16 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={user.loading}
                  >
                    {user.loading ? (
                      <Loader2 className="animate-spin w-full" />
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <span className="text-center text-sm text-stone-400">
              No suggestions for now
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
