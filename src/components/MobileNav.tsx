"use client";
import { useAppSelector } from "@/lib/store/store";
import { Bell, Mail, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lobster_Two } from "next/font/google";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

interface Props {
  hideButtons?: boolean;
}

function MobileNav({ hideButtons }: Props) {
  const unreadMessageCount = 0;
  const newNotifications = false;
  const location = usePathname();
  const { user, skeletonLoading } = useAppSelector((state) => state.user);
  return (
    <div className="bg-stone-100 dark:bg-stone-900 h-16 p-3 top-0 left-0 col-span-10 sm:static sticky w-full sm:hidden flex items-center justify-between z-20">
      <Link
        href="/"
        className={`flex items-center gap-2 text-3xl tracking-tighter font-extrabold ${lobster.className}`}
      >
        <Image
          src="/logo.svg"
          alt=""
          height={40}
          width={40}
          className="pointer-events-none select-none"
        />
        Sociial
      </Link>
      {!skeletonLoading && (
        <>
          <div className={`space-x-1 ${hideButtons ? "hidden" : ""}`}>
            <Link href="/notifications" title="Notifications">
              <span className="inline-block relative">
                <Bell className="mr-4" size="26" />
                {newNotifications && (
                  <span className="absolute -top-1 right-4 inline-block w-[10px] h-[10px] transform translate-x-1/5 translate-y-0.5 bg-red-600 rounded-full"></span>
                )}
              </span>
            </Link>
            <Link href="/messages" title="Messages">
              <span className="inline-block relative">
                <Mail className="mr-2" size="28" />
                {unreadMessageCount !== 0 && (
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500  rounded-full -top-2 -end-1 dark:border-gray-900">
                    {unreadMessageCount}
                  </div>
                )}
              </span>
            </Link>
          </div>
          <Link
            href="/settings"
            title="Settings"
            className={location === `/${user.username}` ? "mr-2" : "hidden"}
          >
            <Settings />
          </Link>
        </>
      )}
    </div>
  );
}

export default MobileNav;
