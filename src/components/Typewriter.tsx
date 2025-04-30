"use client";
import Link from "next/link";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { Lobster_Two } from "next/font/google";
import { useAppSelector } from "@/lib/store/store";
import Image from "next/image";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

export default function Typewriter() {
  const words = [
    {
      text: "Your",
    },
    {
      text: "community,",
    },
    {
      text: "your",
    },
    {
      text: "voice,",
    },
    {
      text: "your",
    },
    {
      text: "Sociial.",
      className: `text-blue-500 dark:text-blue-500 ${lobster.className}`,
    },
  ];
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-center h-[30rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-sm sm:text-base">
        Express yourself like never before
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        {user._id ? (
          <>
            <Link
              href="/"
              className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm flex items-center justify-center"
            >
              Home
            </Link>
            <Link
              href={`/${user.username}`}
              className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm flex items-center justify-center"
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/sign-up"
              className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm flex items-center justify-center"
            >
              Join now
            </Link>
            <Link
              href="/sign-in"
              className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm flex items-center justify-center"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
      <p className="text-neutral-600 dark:text-neutral-200 text-sm sm:text-base my-6">
        Liked what we&apos;re building
      </p>
      <a href="https://www.buymeacoffee.com/sethshivam11" target="_blank">
        <Image src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" className="max-sm:w-[150px]" height="60" width="217" />
      </a>
    </div>
  );
}
