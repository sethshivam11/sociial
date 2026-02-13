import { Lobster_Two } from "next/font/google";
import Link from "next/link";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function Footer() {
  return (
    <div className="border-t-[1px] border-stone-200 dark:border-stone-800 w-full col-span-10">
      <div className="flex max-sm:flex-col max-sm:text-center justify-between sm:gap-4 gap-2 max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-stone-500 text-sm">
        <p>
          © {new Date().getFullYear()}
          <span className={lobster.className}> Sociial</span>. All rights
          reserved.
        </p>
        <div className="flex max-sm:justify-center gap-4 items-center">
          <Link href="/terms" className="hover:underline underline-offset-2">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-2">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
