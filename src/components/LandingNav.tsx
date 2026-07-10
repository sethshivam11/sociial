import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Lobster_Two } from "next/font/google";
import { cookies } from "next/headers";
import ThemeToggle from "./ThemeToggle";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function LandingNav() {
  const cookieStore = cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;

  return (
    <nav className="flex gap-2 justify-between items-center w-full py-3 md:px-24 sm:px-10 px-4 border-b-[1px] bg-transparent/10 dark:bg-transparent/60 border-stone-100 dark:border-stone-900 fixed z-10 backdrop-blur-sm top-0">
      <Link
        href={isLoggedIn ? "/" : "/home"}
        className="flex items-center justify-center gap-2"
      >
        <Image src="/logo.svg" alt="" width="40" height="40" />
        <h1
          className={`text-2xl font-bold tracking-tight ${lobster.className}`}
        >
          Sociial
        </h1>
      </Link>
      <div className="flex items-center justify-center gap-2">
        <ThemeToggle />
        {!isLoggedIn && (
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
