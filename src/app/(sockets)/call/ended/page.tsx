"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameFallback } from "@/lib/helpers";
import { useAppSelector } from "@/lib/store/store";
import { useState, useEffect } from "react";

function Page() {
  const { user } = useAppSelector((state) => state.user);
  const [timer, setTimer] = useState<{
    timeout: NodeJS.Timeout | null;
    left: number;
  }>({
    timeout: null,
    left: 30,
  });
  const [cannotClose, setCannotClose] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer.left > 0)
        setTimer((prev) => ({ ...prev, left: prev.left - 1 }));
      else if (timer.timeout) clearInterval(timer.timeout);
    }, 1000);

    setTimer((prev) => ({ ...prev, timeout: interval }));
    setTimeout(() => {
      window.close();
      setCannotClose(true);
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTimer]);

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
      <p className="text-stone-500 text-sm">
        {cannotClose
          ? "This window cannot be closed, Please close it manually."
          : `This window will close automatically in ${timer.left}s`}
      </p>
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
