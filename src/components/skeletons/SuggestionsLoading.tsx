import React from "react";
import { Skeleton } from "../ui/skeleton";

function SuggestionsLoading({ length = 5 }) {
  return Array.from({ length }).map((_, index) => (
    <div className="flex items-center justify-between gap-3" key={index}>
      <div className="w-1/2 flex items-center gap-3">
        <Skeleton className="min-w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
      <Skeleton className="w-20 h-7 rounded-full" />
    </div>
  ));
}

export default SuggestionsLoading;
