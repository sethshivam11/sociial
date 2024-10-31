"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { useAppSelector } from "@/lib/store/store";

function Page() {
  const { user } = useAppSelector((state) => state.user);

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
    </div>
  );
}

export default Page;
