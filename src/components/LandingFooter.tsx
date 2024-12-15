import Link from "next/link";
import React from "react";

function LandingFooter() {
  return (
    <div className="border-t-[1px] border-stone-200 dark:border-stone-800 w-full">
      <div className="flex justify-between gap-4 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-stone-500 text-sm">
        <p>© 2024 Sociial. All rights reserved.</p>
        <div className="flex gap-4 items-center">
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

export default LandingFooter;
