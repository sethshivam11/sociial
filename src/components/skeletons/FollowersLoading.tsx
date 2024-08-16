import React from "react";
import { Skeleton } from "../ui/skeleton";

function FollowersLoading({ length = 5 }) {
  return (
    <div className="space-y-3 py-1">
      {Array.from({ length }).map((_, index) => (
        <div
          className="flex items-center justify-between w-full space-x-2"
          key={index}
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1 py-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20 opacity-40" />
            </div>
          </div>
          <Skeleton className="w-5 h-5" />
        </div>
      ))}
    </div>
  );
}

export default FollowersLoading;
