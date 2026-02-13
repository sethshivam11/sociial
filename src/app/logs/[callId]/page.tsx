"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { nameFallback } from "@/lib/helpers";
import { getCall } from "@/lib/store/features/slices/callSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Clock, Phone, Video } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { formatDate, intervalToDuration, parseISO } from "date-fns";

function Page({ params }: { params: { callId: string } }) {
  const dispatch = useAppDispatch();
  const { call, loading } = useAppSelector((state) => state.call);
  const { user } = useAppSelector((state) => state.user);
  const { callId } = params;

  const isOutgoing = useMemo(() => {
    if (call?.caller?._id === user?._id) return true;
    else return false;
  }, [call, user]);

  const otherUser = useMemo(() => {
    if (call?.caller?._id === user?._id) return call.callee;
    else return call.caller;
  }, [call, user]);

  function formatDuration(acceptedAt: string, endedAt: string) {
    const start = new Date(acceptedAt);
    const end = new Date(endedAt);

    const interval = intervalToDuration({ start, end });
    let duration = `${interval.seconds}s`;

    if (interval.minutes) duration = `${interval.minutes}m ${duration}`;
    if (interval.hours) duration = `${interval.hours}h ${duration}`;
    if (interval.days) duration = `${interval.days}d ${duration}`;
    if (interval.months) duration = `${interval.months}mo ${duration}`;
    if (interval.years) duration = `${interval.years}y ${duration}`;

    return duration;
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
              <AvatarImage src={otherUser?.avatar} />
              <AvatarFallback>
                {nameFallback(otherUser?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              {loading ? (
                <Skeleton className="w-40 h-5" />
              ) : (
                <h1 className="text-2xl font-bold text-center">
                  {otherUser?.fullName}
                </h1>
              )}
              {loading ? (
                <Skeleton className="w-20 h-4 mt-2" />
              ) : (
                <p className="text-stone-500">
                  {otherUser?.username && "@"}
                  {otherUser?.username}
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
                  href={`/call?username=${otherUser?.username}&video=false`}
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
                  href={`/call?username=${otherUser?.username}&video=true`}
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
              ) : call.createdAt ? (
                formatDate(parseISO(call.createdAt), "MMMM d, yyyy")
              ) : null}
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
                  {isOutgoing ? "Outgoing" : "Incoming"}
                  &nbsp;
                  {call.type === "audio" ? "voice" : "video"} call at
                </>
              )}
            </td>
            <td>
              {loading ? (
                <Skeleton className="w-20 h-5" />
              ) : call.createdAt ? (
                formatDate(parseISO(call.createdAt), "hh:mm a")
              ) : null}
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
              ) : call.acceptedAt ? (
                formatDuration(call.acceptedAt, call.endedAt)
              ) : (
                "Not accepted"
              )}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Page;
