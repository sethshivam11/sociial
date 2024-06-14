"use client";
import { X } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

function Story() {
  const router = useRouter();
  return (
    <div className="w-full col-span-10 h-screen flex items-center justify-center bg-stone-900">
      <button
        className="text-stone-100 p-2 absolute right-0 top-0"
        onClick={() => router.push("/")}
      >
        <X size="40" strokeWidth="" />
      </button>
      <div className="ring-1 ring-stone-200 h-[95%] flex items-center my-2 rounded-sm bg-black">

        <img src="https://images.pexels.com/photos/2449600/pexels-photo-2449600.png?auto=compress&cs=tinysrgb&w=500&h=1200&dpr=1" alt="" className="w-full" />
      </div>
    </div>
  );
}

export default Story;
