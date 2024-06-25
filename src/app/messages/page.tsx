import { Mail } from "lucide-react";
import React from "react";

function Page() {
  return (
    <div className="md:flex hidden flex-col items-center justify-center lg:col-span-7 md:col-span-6 col-span-10 gap-2">
        <Mail size="80" />
        <div>
            <h1 className="text-2xl font-bold">Your Messages</h1>
            <p className="text-stone-500">Start a conversation now! </p>
        </div>
    </div>
  );
}

export default Page;
