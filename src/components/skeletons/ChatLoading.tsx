import React from "react";
import { Skeleton } from "../ui/skeleton";

function ChatLoading() {
  return (
    <div className="flex gap-2 items-center justify-between py-2 sticky top-0 left-0 w-full md:h-20 border-b-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-black md:px-4 pl-1 pr-0 z-20">
      <div className="flex items-center justify-center">
        <Skeleton className="rounded-xl hover:bg-transparent w-8 sm:hidden" />
        <Skeleton className="rounded-full w-12 h-12 ml-0.5 mr-2" />
        <div className="flex flex-col items-start justify-start gap-1">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mr-2">
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-9 h-9" />
      </div>
    </div>
  );
}

export default ChatLoading;
