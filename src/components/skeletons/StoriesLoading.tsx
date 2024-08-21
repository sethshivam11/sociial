import React from "react";
import { Skeleton } from "../ui/skeleton";

function StoriesLoading({ length = 6 }) {
  return Array.from({ length }).map((_, index) => (
    <div
      className="p-1 ring-2 ring-stone-200 dark:ring-stone-800 rounded-full"
      key={index}
    >
      <Skeleton className="w-[70px] h-[70px] rounded-full" />
    </div>
  ));
}

export default StoriesLoading;
