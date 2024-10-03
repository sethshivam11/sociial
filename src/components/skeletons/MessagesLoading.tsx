import React from "react";
import { Skeleton } from "../ui/skeleton";

function MessagesLoading() {
  return (
    <div className="flex flex-col gap-2 items-start justify-start min-h-[88dvh] w-full">
      <div className="w-full flex justify-end">
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-40 h-10 rounded-xl" />
      <div className="w-full flex justify-end">
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-40 h-10 rounded-xl" />
      <Skeleton className="w-40 h-10 rounded-xl" />
      <div className="w-full flex justify-end">
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-40 h-10 rounded-xl" />
      <div className="w-full flex justify-end">
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-40 h-10 rounded-xl" />
      <div className="w-full flex justify-end">
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-40 h-10 rounded-xl" />
      <Skeleton className="w-40 h-10 rounded-xl" />
      <div className="w-full flex justify-end">
        <Skeleton className="w-40 h-10 rounded-xl" />
      </div>
        <Skeleton className="w-40 h-10 rounded-xl" />
      <div className="w-full flex items-center justify-center gap-2 sticky bottom-0 left-0">
        <Skeleton className="w-12 h-10 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-14 h-10 rounded-xl" />
      </div>
      
    </div>
  );
}

export default MessagesLoading;
