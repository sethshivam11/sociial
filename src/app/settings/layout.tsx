"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserProvider";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Bell,
  KeySquare,
  Lock,
  Palette,
  Shield,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Page({ children }: React.PropsWithChildren) {
  const { user } = useUser();
  const location = usePathname();
  const router = useRouter();
  const username = "sethshivam11";

  React.useEffect(() => {
    const checkScreenWidthAndRedirect = () => {
      const screenWidth = window.innerWidth;
      const targetWidth = 768;

      if (screenWidth > targetWidth) {
        router.push("/settings/edit-profile");
      }
    };

    if (location === "/settings") {
      checkScreenWidthAndRedirect();
    }
  }, [router, location]);

  return (
    <div className="sm:container flex items-start justify-start max-h-[100dvh] min-h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div
        className={`lg:w-1/4 w-full h-full lg:max-h-full lg:border-r-2 border-stone-200 dark:border-stone-800 ${
          location === "/settings" ? "block" : "max-lg:hidden"
        }`}
      >
        <h1 className="sm:text-3xl text-xl tracking-tighter font-bold text-center w-full sm:py-6 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden mx-4"
            onClick={() => router.push(`/${username}`)}
          >
            <ArrowLeft />
          </Button>
          Settings
        </h1>
        <hr className="w-full bg-stone-500 mb-4" />
        <div className="flex flex-col sm:px-1 px-4 overflow-y-auto gap-2">
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
            <KeySquare size="30" strokeWidth="1.5" /> Security
          </Link>
          <Link
            href="/settings/theme"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/theme"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Palette size="30" strokeWidth="1.5" /> Theme
          </Link>
          <Link
            href={user.isPremium ? "/settings/premium" : "/get-premium"}
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
      <div
        className={`h-full md:max-h-full ${
          location === "/settings" ? "lg:w-3/4 w-0" : "lg:w-3/4 w-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Page;
