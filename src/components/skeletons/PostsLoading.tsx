import React from "react";
import { Skeleton } from "../ui/skeleton";

function PostsLoading({ length = 5 }: { length?: number }) {
  return Array.from({ length }).map((_, index) => (
    <div
      key={index}
      className="dark:bg-stone-900 p-4 bg-stone-100 rounded-sm min-h-64 w-full sm:w-[85%] min-w-64 mx-auto flex flex-col gap-2"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 my-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="w-full h-96" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-10" />
        <Skeleton className="h-9 w-10" />
        <Skeleton className="h-9 w-10" />
      </div>
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-5 w-52" />
    </div>
  ));
}

export default PostsLoading;
