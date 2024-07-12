"use client";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const user = {
    username: "sethshivam11",
    fullName: "Shivam Soni",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  };
  const location = usePathname();
  return (
    <div className="sm:container flex flex-col items-center justify-start xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div className="h-fit lg:w-3/4 w-full rounded-xl sm:bg-stone-100 sm:dark:bg-stone-900 sm:pt-4 sm:px-6 px-0 pb-4 relative">
        <div className="sticky top-0 sm:bg-stone-100 sm:dark:bg-stone-900 bg-background w-full py-2 z-10">
          <div className="w-full flex items-center justify-start text-center pt-2 max-sm:my-4 max-sm:mx-2">
            <Link href={`/${user.username}`}>
              <ArrowLeft />
            </Link>
            <h1 className="sm:text-2xl text-lg tracking-tight font-bold text-center w-full mr-6">
              {user.fullName}
            </h1>
          </div>
          <div className="flex items-center justify-around max-md:justify-around sm:mt-8 sm:text-md text-sm w-full">
            <Link
              href={`/${user.username}/followers`}
              className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-40 after:w-32 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 sm:after:mt-1.5 after:-mt-0.5 sm:text-xl ${
                location.includes("/followers")
                  ? "after:border-2"
                  : "after:border-0"
              }`}
            >
              Followers
            </Link>
            <Link
              href={`/${user.username}/following`}
              className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-40 after:w-32 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 sm:after:mt-1.5 after:-mt-0.5 sm:text-xl ${
                location.includes("/following")
                  ? "after:border-2"
                  : "after:border-0"
              }`}
            >
              Following
            </Link>
          </div>
          <hr className="w-full bg-stone-950 mb-5 mt-3" />
          <div className="flex items-center gap-2 bg-background rounded-lg w-full mt-3 pl-3 focus-within:ring-2 focus-within:ring-stone-200 border">
            <Search />
            <Input
              placeholder="Search"
              className="focus-within:ring-offset-transparent ring-offset-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-e-lg w-full"
            />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Layout;
