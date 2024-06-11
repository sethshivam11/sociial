"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Custom404() {
  const router = useRouter();
  useEffect(() => {
    document.title = "404 - Not Found";
    setTimeout(() => {
      document.title = "Sociial";
    }, 5000);
  }, []);
  return (
    <div className="col-span-10 flex flex-col text-center px-2 gap-3 w-screen h-screen z-20 bg-white dark:bg-black fixed top-0 left-0 items-center justify-center">
      <span className="text-8xl">404</span>
      <span className="text-xl">not found</span>
      <span className="text-stone-500">
        The page you are looking for was not found
      </span>
      <div className="flex items-center justify-evenly">
        <Button onClick={() => router.push("/")} variant="link">Go to homepage</Button>
      </div>
    </div>
  );
}

export default Custom404;
