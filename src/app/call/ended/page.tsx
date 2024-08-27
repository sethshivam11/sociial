"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameFallback } from "@/lib/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const query = useSearchParams();
  const router = useRouter();
  const user = {
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png",
    fullName: "Shivam Soni",
    username: "sethshivam",
    isPremium: false,
  };

  React.useEffect(() => {
    const username = query.get("username");
    console.log(username);
  }, []);
  return (
    <div className="col-span-10 flex flex-col items-center justify-center gap-4 h-[100dvh] overflow-hidden bg-black text-white container relative">
      <Avatar className="sm:w-40 w-32 sm:h-40 h-32 object-contain select-none pointer-events-none">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-stone-800">
          {nameFallback(user.fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center justify-center gap-0">
        <h1 className="text-2xl tracking-tight font-bold">{user.fullName}</h1>
        <h6 className="text-stone-500 text-lg">@{user.username}</h6>
      </div>
      <h1 className="text-lg mt-10">Call Ended</h1>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
        onClick={() => window.close()}
      >
        Close Tab
      </Button>
    </div>
  );
}

export default Page;
