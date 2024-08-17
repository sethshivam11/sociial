import React from "react";
import { Skeleton } from "../ui/skeleton";

function SearchLoading({ length = 5 }) {
  return (
    <div className="lg:w-1/2 md:w-3/5 sm:w-4/5 w-full px-2 py-4 space-y-4 mt-3">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchLoading;
