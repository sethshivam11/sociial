"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { nameFallback } from "@/lib/helpers";
import { getCall } from "@/lib/store/features/slices/callSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Clock, Phone, Video } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

function Page({ params }: { params: { callId: string } }) {
  const dispatch = useAppDispatch();
  const { call, loading } = useAppSelector((state) => state.call);
  const { user } = useAppSelector((state) => state.user);
  const { callId } = params;

  function formatDuration(acceptedAt: string, endedAt: string): string {
    const start = new Date(acceptedAt);
    const end = new Date(endedAt);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Not available";
    }

    const durationInSeconds = Math.floor(
      (end.getTime() - start.getTime()) / 1000
    );

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    let durationParts: string[] = [];
    if (hours > 0) {
      durationParts.push(`${hours}h`);
    }
    if (minutes > 0 || hours > 0) {
      durationParts.push(`${minutes}m`);
    }

    durationParts.push(`${seconds}s`);
    return durationParts.join(" ");
  }

  useEffect(() => {
    if (call._id !== callId) {
      dispatch(getCall(callId));
    }
  }, [dispatch, params.callId, callId, call._id]);

  return (
    <div className="md:border-l-2 border-stone-200 dark:border-stone-800 md:flex flex flex-col items-center lg:col-span-7 md:col-span-6 col-span-10 overflow-x-hidden h-[100dvh] sm:min-h-[42rem] relative py-8">
      <h1 className="text-xl tracking-tight font-semibold mb-4 w-5/6">
        Call Details
      </h1>
      <div className="flex flex-col justify-center w-5/6 ring-1 ring-stone-300 dark:ring-stone-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-32 h-32 pointer-events-none select-none">
              <AvatarImage
                src={
                  user._id === call.callee._id
                    ? call.callee?.avatar
                    : call.caller.avatar
                }
              />
              <AvatarFallback>
                {nameFallback(
                  user._id === call.callee._id
                    ? call.callee?.fullName
                    : call.caller.fullName
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              {loading ? (
                <Skeleton className="w-40 h-5" />
              ) : (
                <h1 className="text-2xl font-bold text-center">
                  {user._id === call.callee._id
                    ? call.callee?.fullName
                    : call.caller.fullName}
                </h1>
              )}
              {loading ? (
                <Skeleton className="w-20 h-4 mt-2" />
              ) : (
                <p className="text-stone-500">
                  @
                  {user._id === call.callee._id
                    ? call.callee?.username
                    : call.caller.username}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-evenly gap-2">
            {loading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <Button size="icon" asChild>
                <Link
                  href={`/call?username=${
                    user._id === call.callee._id
                      ? call.callee?.username
                      : call.caller.username
                  }&video=false`}
                >
                  <Phone />
                </Link>
              </Button>
            )}
            {loading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <Button variant="secondary" size="icon" asChild>
                <Link
                  href={`/call?username=${
                    user._id === call.callee._id
                      ? call.callee?.username
                      : call.caller.username
                  }&video=true`}
                  className="p-2"
                >
                  <Video />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <hr className="w-full my-2 rounded-full border-2 border-stone-100 dark:border-stone-900" />
        <table cellPadding="4">
          <tr>
            <td colSpan={2} className="text-stone-500">
              {loading ? (
                <Skeleton className="w-32 h-4" />
              ) : (
                new Date(call.createdAt).toLocaleDateString("en-IN")
              )}
            </td>
          </tr>
          <tr>
            <td className="flex items-center">
              {loading ? (
                <Skeleton className="w-60 h-5" />
              ) : (
                <>
                  {call.type === "audio" ? (
                    <Phone size="18" className="mr-2" />
                  ) : (
                    <Video size="18" className="mr-2" />
                  )}
                  {user._id === call.callee._id ? "Incoming" : "Outgoing"}
                  &nbsp;
                  {call.type === "audio" ? "voice" : "video"} call at
                </>
              )}
            </td>
            <td>
              {loading ? (
                <Skeleton className="w-20 h-5" />
              ) : (
                new Date(call.createdAt).toLocaleString("en-IN").slice(11)
              )}
            </td>
          </tr>
          <tr>
            <td className="flex items-center">
              {loading ? (
                <Skeleton className="w-32 h-5" />
              ) : (
                <>
                  <Clock size="18" className="mr-2" />
                  Duration
                </>
              )}
            </td>
            <td>
              {loading ? (
                <Skeleton className="w-20 h-5" />
              ) : (
                formatDuration(call.acceptedAt, call.endedAt)
              )}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Page;
