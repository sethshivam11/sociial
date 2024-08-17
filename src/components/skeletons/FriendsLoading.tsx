import React from "react";
import { Skeleton } from "../ui/skeleton";

function FriendsLoading({ length = 5 }) {
  return (
    <div className="space-y-3 py-3 px-5">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-full"/>
        </div>
      ))}
    </div>
  );
}

export default FriendsLoading;
