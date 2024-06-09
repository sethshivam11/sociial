import { Mail } from "lucide-react";
import Image from "next/image";
import React from "react";

function MobileNav() {
  const unreadMessageCount = "0";
  return (
    <div className="bg-stone-200 dark:bg-stone-800 h-16 p-3 top-0 left-0 col-span-10 sticky w-full sm:hidden flex items-center justify-between border-box z-20">
      <div className="flex items-center gap-2 text-2xl tracking-tighter font-extrabold">
        <Image src="/logo.svg" alt="" height={40} width={40} />
        Sociial
      </div>
      <span className="inline-block relative">
        <Mail className="mr-2" size={28} />
        {unreadMessageCount !== "0" && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
            {unreadMessageCount}
          </div>
        )}
      </span>
    </div>
  );
}

export default MobileNav;
