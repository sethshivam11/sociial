import React from "react";
import { Skeleton } from "../ui/skeleton";

function MessageCardLoading({ length = 6 }) {
  return Array.from({ length }).map((_, index) => (
    <div
      className="flex justify-between gap-2 rounded-xl p-4 ring-1 ring-stone-200 dark:ring-stone-800"
      key={index}
    >
      <div className="flex flex-col justify-between w-full">
        {[0, 3, 5].includes(index) && <Skeleton className="w-full h-40 mb-2" />}
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-5 rounded" />
          <Skeleton className="w-full h-5 rounded" />
          <Skeleton className="w-full h-5 rounded" />
          <Skeleton className="w-1/4 h-5 rounded" />
        </div>
        <div className="flex items-center mt-2 gap-1">
          <Skeleton className="h-5 w-32 rounded" />
        </div>
      </div>
      <Skeleton className="h-10 w-9" />
    </div>
  ));
}

export default MessageCardLoading;
