"use client";
import { Bell, Mail, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useUser } from "@/context/UserProvider";

interface Props {
  unreadMessageCount: number;
  newNotifications: boolean;
  hideButtons?: boolean;
}

function MobileNav({
  unreadMessageCount,
  newNotifications,
  hideButtons,
}: Props) {
  return (
    <div className="bg-stone-200 dark:bg-stone-800 h-16 p-3 top-0 left-0 col-span-10 sm:static sticky w-full sm:hidden flex items-center justify-between z-20">
      <div className="flex items-center gap-2 text-2xl tracking-tighter font-extrabold">
        <Image
          src="/logo.svg"
          alt=""
          height={40}
          width={40}
          className="pointer-events-none select-none"
        />
        Sociial
      </div>
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
    </div>
  );
}

export default MobileNav;
