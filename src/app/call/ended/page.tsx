"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { nameFallback } from "@/lib/helpers";
import { getProfile } from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const { profile, skeletonLoading } = useAppSelector((state) => state.user);
  const username = query.get("username");
  const isVideoCall = query.get("video");

  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (username)
      dispatch(getProfile({ username })).then((response) => {
        if (response.payload?.message === "User not found") {
          setNotFoundError(true);
        }
      });
    else setNotFoundError(true);
    navigator.mediaDevices
      .getUserMedia({
        video: isVideoCall === "true",
        audio: true,
      })
      .then((mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      })
      .catch((err) => console.log(err));
  }, [dispatch, setNotFoundError, username]);

  if (notFoundError) {
    notFound();
  }

  return (
    <div className="col-span-10 flex flex-col items-center justify-center gap-4 h-[100dvh] overflow-hidden bg-black text-white container relative">
      {skeletonLoading ? (
        <>
          <Skeleton className="sm:w-40 w-32 sm:h-40 h-32 rounded-full" />
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-36 mt-10" />
        </>
      ) : (
        <>
          <Avatar className="sm:w-40 w-32 sm:h-40 h-32 object-contain select-none pointer-events-none">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-stone-800">
              {nameFallback(profile.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center gap-0">
            <h1 className="text-2xl tracking-tight font-bold">
              {profile.fullName}
            </h1>
            <h6 className="text-stone-500 text-lg">@{profile.username}</h6>
          </div>
          <p className="text-sm">Call Ended</p>
          <Link
            href="/"
            className="text-blue-500 underline underline-offset-2 mt-10"
          >
            Go back to Home
          </Link>
        </>
      )}
    </div>
  );
}

export default Page;
