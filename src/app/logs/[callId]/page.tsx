"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameFallback } from "@/lib/helpers";
import { setCall } from "@/lib/store/features/slices/callSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Clock, Mail, Phone, Video } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

function Page({ params }: { params: { callId: string } }) {
  const dispatch = useAppDispatch();
  const { call, calls } = useAppSelector((state) => state.call);
  const { callId } = params;

  function getTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    if (call._id !== params.callId) {
      dispatch(setCall(calls.find((call) => call._id === callId)));
    }
  }, [dispatch]);

  return (
    <div className="md:border-l-2 border-stone-200 dark:border-stone-800 md:flex flex flex-col items-center lg:col-span-7 md:col-span-6 col-span-10 overflow-x-hidden h-[100dvh] sm:min-h-[42rem] relative py-8">
      <h1 className="text-xl tracking-tight font-semibold mb-4 w-5/6">
        Call Details
      </h1>
      <div className="flex flex-col justify-center w-5/6 ring-1 ring-stone-500 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-32 h-32 pointer-events-none select-none">
              <AvatarImage src={call.user?.avatar} />
              <AvatarFallback>
                {nameFallback(call.user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-center">
                {call.user?.fullName}
              </h1>
              <p className="text-stone-500">@{call.user.username}</p>
            </div>
          </div>
          <div className="flex items-center justify-evenly gap-2">
            <Link href={`/call/${call.user.username}?video=false`}>
              <Button variant="ghost" size="icon">
                <Phone />
              </Button>
            </Link>
            <Link
              href={`/call/${call.user.username}?video=true`}
              className="p-2"
            >
              <Button variant="ghost" size="icon">
                <Video />
              </Button>
            </Link>
          </div>
        </div>
        <hr className="w-full my-2 rounded-full border-2 border-stone-100 dark:border-stone-900" />
        <table cellPadding="4">
          <tr>
            <td colSpan={2} className="text-stone-500">
              {new Date(call.createdAt)
                .toLocaleDateString("en-IN")
                .slice(0, 10)}
            </td>
          </tr>
          <tr>
            <td className="flex items-center">
              {call.kind === "audio" ? (
                <Phone size="18" className="mr-2" />
              ) : (
                <Video size="18" className="mr-2" />
              )}
              <span className="capitalize">{call.type}</span>&nbsp;
              {call.kind === "audio" ? "voice" : "video"} call at
            </td>
            <td>
              {new Date(call.createdAt).toLocaleString("en-IN").slice(11)}
            </td>
          </tr>
          <tr>
            <td className="flex items-center">
              <Clock size="18" className="mr-2" />
              Duration
            </td>
            <td>{getTime(call.duration)}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Page;
