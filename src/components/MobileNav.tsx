import { MessageCircleMore } from "lucide-react";
import Image from "next/image";
import React from "react";

function MobileNav() {
  return (
    <div className="bg-stone-200 dark:bg-stone-800 h-16 p-3 top-0 left-0 col-span-10 sticky w-full sm:hidden flex items-center justify-between border-box z-20">
      <div className="flex items-center gap-2 text-2xl tracking-tighter font-extrabold">
        <Image src="/logo.svg" alt="" height={40} width={40} />
        Sociial
      </div>
      <MessageCircleMore className="mr-2" size={28} />
    </div>
  );
}

export default MobileNav;
