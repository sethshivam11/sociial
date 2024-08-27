import React from "react";
import { Skeleton } from "../ui/skeleton";

function ProfileLoading() {
  return (
    <>
      <div className="flex md:flex-row flex-col md:items-center items-start justify-evenly w-full">
        <div className="flex items-center justify-center max-sm:justify-start gap-6 mt-4 px-4 max-sm:w-full">
          <Skeleton className="lg:w-[180px] sm:w-[150px] w-[100px] aspect-square rounded-full" />
          <div className="flex flex-col items-start justify-center gap-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-7" />
            <div className="flex items-center justify-center gap-2 max-sm:gap-4">
              <Skeleton className="w-24 h-9 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
        <div className="lg:py-16 sm:py-10 py-4 text-center grid grid-cols-3 sm:gap-4 gap-3 md:w-1/3 w-full">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
      <div className="sm:w-3/4 md:w-1/2 w-full lg:ml-36 md:ml-20 my-4 max-sm:px-6">
        <Skeleton className="w-full h-6" />
      </div>
      <div className="flex items-center justify-evenly max-md:justify-around mt-8 sm:text-md text-sm">
        <Skeleton className="sm:w-28 w-8 h-8 rounded-xl" />
        <Skeleton className="sm:w-28 w-8 h-8 rounded-xl" />
      </div>
      <hr className="my-2 md:w-10/12 w-full mx-auto bg-stone-500 border-2 rounded-sm" />
    </>
  );
}

export default ProfileLoading;
