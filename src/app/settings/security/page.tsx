import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <div className="sm:w-3/4 w-full px-8 space-y-8 mt-8">
        <h1 className="text-2xl tracking-tight font-bold relative gap-3 flex items-center">
          <Link href="/settings" className="sm:hidden">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft />
            </Button>
          </Link>
          Passwords & Security
        </h1>
        <div className="flex flex-col gap-2 py-2 w-full items-center justify-start ring-1 ring-stone-200 dark:ring-stone-800 rounded-xl">
          <Link
            href="/settings/security/password"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Change Password <ChevronRight />
          </Link>
          <Link
            href="/settings/security/email"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Change Email <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
