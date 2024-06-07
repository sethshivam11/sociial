"use client";
import React from "react";
import { Input } from "./ui/input";
import { Loader2, Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

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
  const [searchOpen, setSearchOpen] = React.useState(false);
  function handleClear() {
    console.log("Clear all");
  }
  return (
    <div className="py-8 px-2 xl:flex hidden flex-col gap-4 xl:col-span-3">
      <div className="rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 px-3 focus-within:ring-2 focus-within:ring-stone-700 dark:focus-within:ring-stone-300 peer">
        <Search className="inline bg-stone-100 dark:bg-stone-800" />
        <Input
          placeholder="Search"
          inputMode="search"
          className="bg-stone-100 dark:bg-stone-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onFocus={() => setSearchOpen(true)}
        />
      </div>
      <div
        className={`bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-500 py-3 px-2 rounded-2xl ${
          searchOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="flex flex-col w-full p-3 pt-2 gap-5"
          onMouseEnter={() => setSearchOpen(true)}
        >
          {users.length ? (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 dark:text-stone-400">
                  Recent Searches
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-blue-500">Clear all</button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Clear all recent searches?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This can&apos;t be undone and you&apos;ll remove all 
                        your recent searches.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="p-0">
                        <Button variant="destructive">Clear</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {users.map((user, index) => {
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
                      className="rounded-full text-sm disabled:bg-blue-400 p-1"
                      disabled={user.loading}
                    >
                      <X size="20" />
                    </button>
                  </div>
                );
              })}
            </>
          ) : (
            <span className="text-center text-sm text-stone-400">
              Discover your loved ones
            </span>
          )}
        </div>
      </div>

      <div className="bg-stone-100 dark:bg-stone-800 pt-4 pb-6 px-6 rounded-2xl">
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
                    className="bg-blue-500 w-16 h-7 text-center text-white rounded-lg text-sm transition-colors hover:bg-blue-700 disabled:bg-blue-400"
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
