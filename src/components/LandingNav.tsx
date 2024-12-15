import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Lobster_Two } from "next/font/google";
import { Moon, Sun } from "lucide-react";
import { useAppSelector } from "@/lib/store/store";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function LandingNav() {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.user);
  return (
    <nav className="flex gap-2 justify-between items-center w-full py-3 md:px-24 sm:px-10 px-4 border-b-[1px] bg-transparent/10 dark:bg-transparent/60 border-stone-100 dark:border-stone-900 fixed z-10 backdrop-blur-sm top-0">
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image src="/logo.svg" alt="" width="40" height="40" />
        <h1
          className={`text-2xl font-bold tracking-tight ${lobster.className}`}
        >
          Sociial
        </h1>
      </Link>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-stone-700 dark:text-stone-500"
          onClick={() => {
            if (theme === "dark") {
              setTheme("light");
            } else {
              setTheme("dark");
            }
          }}
        >
          {theme === "dark" ? <Sun size="16" /> : <Moon size="16" />}
        </Button>
        {!user._id && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="text-sm max-sm:hidden"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" className="text-sm max-sm:hidden" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default LandingNav;
