import React from "react";
import { Skeleton } from "../ui/skeleton";

function VideoLoading({ length = 1 }) {
  return Array.from({ length }).map((_, index) => (
    <section
      className="flex items-center justify-center snap-always snap-end w-full h-full py-2 "
      key={index}
    >
      <div className="flex items-center justify-center h-full max-sm:w-full sm:aspect-9/16 sm:border relative">
        <div className="flex items-center justify-start px-3 absolute top-0 left-0 w-full h-16">
          <Skeleton className="w-[30px] h-[30px] ml-1 mr-2 sm:hidden" />
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
        </div>
        <Skeleton className="w-5 h-10 rounded-full absolute top-2 right-2" />
        <div className="flex flex-col absolute bottom-0 left-0 w-full">
          <div className="absolute bottom-10 right-0 max-sm:flex hidden flex-col items-center justify-start gap-4 px-3 pb-10">
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-10 h-10" />
          </div>
          <div className="space-y-2 mx-5">
            <Skeleton className="w-1/2 h-5" />
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="flex gap-2 items-center mx-4 my-1">
            <Skeleton className="w-10 h-8" />
            <Skeleton className="w-10 h-8" />
            <Skeleton className="w-full h-2" />
          </div>
        </div>
      </div>
      <div className="sm:flex hidden flex-col items-center justify-end gap-4 px-3 pb-12 h-full">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="w-10 h-10" />
        <Skeleton className="w-10 h-10" />
      </div>
    </section>
  ));
}

export default VideoLoading;
