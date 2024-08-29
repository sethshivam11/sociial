import React from "react";
import { Skeleton } from "../ui/skeleton";

function NotificationLoading({ length = 6 }) {
  return (
    <div className="flex flex-col gap-3 px-3">
      {Array.from({ length }).map((_, index) => (
        <div
          className="flex items-center justify-start rounded-lg p-2"
          key={index}
        >
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-1 ml-2 w-full">
            <Skeleton className="w-40 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <Skeleton
            className={`w-3 h-3 rounded-full ${
              [1, 4].includes(index) ? "" : "hidden"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default NotificationLoading;
