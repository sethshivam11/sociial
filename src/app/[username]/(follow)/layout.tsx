"use client";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  // const { user } = useAppSelector((state) => state.user);
  const user = {
    username: "sethshivam",
    fullName: "Shivam",
    avatar: "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  }
  const location = usePathname();

  return (
    <div className="sm:container flex flex-col items-center justify-start xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div className="h-fit lg:w-3/4 w-full rounded-xl sm:bg-stone-100 sm:dark:bg-stone-900 sm:pt-4 sm:px-6 px-0 min-h-full relative">
        <div className="sm:bg-stone-100 sm:dark:bg-stone-900 bg-background w-full pt-2">
          <div className="w-full flex items-center justify-start text-center max-sm:mb-5 max-sm:px-2">
            <Link href={`/${user.username}`}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl ml-2 max-sm:hover:bg-background"
              >
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="sm:text-2xl text-lg tracking-tight font-bold text-center w-full mr-12">
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
          <hr className="w-full bg-stone-950 mb-1 mt-3" />
        </div>
        {children}
      </div>
    </div>
  );
}

export default Layout;
