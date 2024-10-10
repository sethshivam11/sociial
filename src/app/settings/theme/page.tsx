"use client";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

function Page() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-2 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Select Theme
      </h1>
      <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5 mt-6">
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <Label
            htmlFor="theme-system"
            className="font-light cursor-pointer flex gap-2 items-center justify-start w-full"
          >
            <input
              type="radio"
              id="theme-system"
              name="theme"
              checked={theme === "system"}
              onChange={() => setTheme("system")}
              className="w-6 h-6 accent-black dark:accent-white"
            />
            System
          </Label>
          <Label
            htmlFor="theme-light"
            className="font-light cursor-pointer flex gap-2 items-center justify-start w-full"
          >
            <input
              type="radio"
              id="theme-light"
              name="theme"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Light
          </Label>
          <Label
            htmlFor="theme-dark"
            className="font-light cursor-pointer flex gap-2 items-center justify-start w-full"
          >
            <input
              type="radio"
              id="theme-dark"
              name="theme"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Dark
          </Label>
        </div>
      </div>
    </div>
  );
}

export default Page;
