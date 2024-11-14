import React from "react";
import { Skeleton } from "../ui/skeleton";

function MessageCardLoading({ length = 6 }) {
  return Array.from({ length }).map((_, index) => (
    <div
      className="flex justify-between gap-2 rounded-xl p-4 ring-1 ring-stone-200 dark:ring-stone-800"
      key={index}
    >
      <div className="flex flex-col justify-between w-full">
        <Skeleton className="w-full h-40" />
        <div className="flex items-center mt-2 gap-1 text-stone-500 text-xs">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-9" />
    </div>
  ));
}

export default MessageCardLoading;
