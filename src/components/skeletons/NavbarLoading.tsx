import React from "react";
import { Skeleton } from "../ui/skeleton";

function NavbarLoading({ length = 6 }) {
  return (
    <div className="flex sm:flex-col flex-row w-full md:items-start items-center sm:justify-start justify-evenly p-2 gap-4 h-fit">
      {Array.from({ length }).map((_, index) => (
        <Skeleton className="w-full h-12" key={index} />
      ))}
    </div>
  );
}

export default NavbarLoading;
