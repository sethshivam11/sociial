"use client";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

function Layout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const location = usePathname();

  useEffect(() => {
    dispatch(getProfile({ username: location.split("/")[1] }));
  }, [dispatch, location]);

  return (
    <div className="sm:container flex flex-col items-center justify-start xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div className="h-fit lg:w-3/4 w-full rounded-xl sm:bg-stone-100 sm:dark:bg-stone-900 sm:pt-4 sm:px-6 px-0 min-h-full relative">
        <div className="sm:bg-stone-100 sm:dark:bg-stone-900 bg-background w-full pt-2">
          <div className="w-full flex items-center justify-start text-center max-sm:mb-5 max-sm:px-2">
            <Link href={`/${profile.username}`}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl ml-2 max-sm:hover:bg-background"
              >
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="sm:text-2xl text-lg tracking-tight font-bold text-center w-full mr-12">
              {profile.fullName}
            </h1>
          </div>
          <div className="flex items-center justify-around max-md:justify-around sm:mt-8 sm:text-md text-sm w-full">
            <Link
              href={`/${profile.username}/followers`}
              className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-40 after:w-32 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 sm:after:mt-1.5 after:-mt-0.5 sm:text-xl ${
                location.includes("/followers")
                  ? "after:border-2"
                  : "after:border-0"
              }`}
            >
              Followers
            </Link>
            <Link
              href={`/${profile.username}/following`}
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
