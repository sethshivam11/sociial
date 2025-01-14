"use client";
import { useAppSelector } from "@/lib/store/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function Page() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <h1 className="text-lg tracking-tight font-semibold sm:w-3/4 sm:px-8 w-full text-left sm:my-4 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Security
      </h1>
      <div className="sm:w-3/4 w-full px-8 space-y-8 mt-2 max-sm:mt-4">
        <div className="flex flex-col gap-2 py-2 w-full items-center justify-start ring-1 ring-stone-200 dark:ring-stone-800 rounded-xl">
          <Link
            href="/settings/security/login-activity"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Where you&apos;re logged in <ChevronRight />
          </Link>
          {user.loginType === "local" && (
            <>
              <Link
                href="/settings/security/password"
                className="flex items-center justify-between w-full py-2 px-4"
              >
                Change Password <ChevronRight />
              </Link>
              <Link
                href="/settings/security/email"
                className="flex items-center justify-between w-full py-2 px-4"
              >
                Change Email <ChevronRight />
              </Link>
            </>
          )}
        </div>
        {user.loginType === "google" && (
          <p className="text-sm text-stone-500">
            You are logged in using Google. You can change your email and password from
            Google account settings.
          </p>
        )}
      </div>
    </div>
  );
}

export default Page;
