"use client";
import { BadgeCheck, Ban, Bell, Lock, Shield, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Page({ children }: React.PropsWithChildren) {
  const location = usePathname();
  return (
    <div className="sm:container flex items-start justify-start max-h-[100dvh] min-h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div className="w-1/4 h-full md:max-h-full border-r-2 border-stone-200 dark:border-stone-800">
        <h1 className="text-2xl tracking-tighter font-bold text-center w-full my-6">
          Settings
        </h1>
        <hr className="w-full bg-stone-500 my-4" />
        <div className="flex flex-col px-1 overflow-y-auto gap-2">
          <Link
            href="/settings/edit-profile"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/edit-profile"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <UserCircle2 size="30" strokeWidth="1.5" /> Edit Profile
          </Link>
          <Link
            href="/settings/notifications"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/notifications"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Bell size="30" strokeWidth="1.5" /> Notifications
          </Link>
          <Link
            href="/settings/blocked"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/blocked"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Ban size="30" strokeWidth="1.5" /> Blocked
          </Link>
          <Link
            href="/settings/security"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/security"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Lock size="30" strokeWidth="1.5" /> Security
          </Link>
          <Link
            href="/premium"
            className="flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg"
          >
            <BadgeCheck size="30" strokeWidth="1.5" /> Premium
          </Link>
          <Link
            href="/settings/help"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/help"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Shield size="30" strokeWidth="1.5" /> Help
          </Link>
        </div>
      </div>
      <div className="w-3/4 h-full md:max-h-full">
        {children}
      </div>
    </div>
  );
}

export default Page;
