import { TriangleAlert } from "lucide-react";
import { Lobster_Two } from "next/font/google";
import Link from "next/link";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function Custom404() {
  return (
    <div className="col-span-10 flex flex-col text-center px-2 gap-3 w-screen h-screen z-20 bg-white dark:bg-black fixed top-0 left-0 items-center justify-center">
      <TriangleAlert size="100" />
      <span className="text-3xl font-bold tracking-tighter">
        Page not found
      </span>
      <span className="text-stone-500">
        The page you are looking for was not found
      </span>
      <div className="flex items-center justify-evenly">
        <Link href="/" className="text-blue-600">
          Go back to <span className={lobster.className}>Sociial</span>
        </Link>
      </div>
    </div>
  );
}

export default Custom404;
