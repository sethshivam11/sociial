import React from "react";
import { Skeleton } from "../ui/skeleton";

function CallsLoading({ length = 10 }) {
  return (
    <div className="space-y-5 p-1">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-52" />
              </div>
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CallsLoading;
