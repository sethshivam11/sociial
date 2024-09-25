import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <h1 className="text-lg sm:text-xl tracking-tight font-semibold sm:w-3/4 sm:px-8 w-full text-left sm:my-4 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Notifications
      </h1>
      <div className="sm:w-3/4 w-full px-8 space-y-8 mt-4">
        <div className="flex flex-col gap-2 py-2 w-full items-center justify-start ring-1 ring-stone-200 dark:ring-stone-800 rounded-xl">
          <Link
            href="/settings/notifications/push"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Push notifications <ChevronRight />
          </Link>
          <Link
            href="/settings/notifications/email"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Email notifications <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
