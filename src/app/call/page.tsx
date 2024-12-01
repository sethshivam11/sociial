"use client";
import PermissionsRequired from "@/components/PermissionsRequired";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { nameFallback } from "@/lib/helpers";
import { getCall, startCall } from "@/lib/store/features/slices/callSlice";
import { getProfile } from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

function Page() {
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { profile, skeletonLoading } = useAppSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [permissions, setPermissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [call, setCall] = useState("");

  const getPermissions = useCallback((video?: boolean) => {
    navigator.mediaDevices
      .getUserMedia({ video, audio: true })
      .then((stream) => {
        setPermissions(true);
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      })
      .catch((err) => {
        setPermissions(false);
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);
  function handleCall() {
    dispatch(
      startCall({
        callee: profile._id,
        type: query.get("video") ? "video" : "audio",
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot start call",
          description: response.payload?.message || "Something went wrong!",
          variant: "destructive",
        });
      } else {
        router.push(
          `/call/${username}?video=${videoEnabled}&profile=${profile._id}`
        );
      }
    });
  }

  useEffect(() => {
    const video = query.get("video");
    const callId = query.get("call");
    setUsername(query.get("username") || "");
    getPermissions(video === "true");
    setVideoEnabled(video === "true");
    if (callId) {
      dispatch(getCall(callId)).then((response) => {
        if (response.payload?.success) {
          setCall(callId);
        }
      });
    }
  }, [getPermissions, query, dispatch]);
  useEffect(() => {
    if (!profile?._id) {
      dispatch(getProfile({ username: query.get("username") || "" })).then(
        (response) => {
          if (!response.payload?.success) {
            setNotFoundError(true);
          }
        }
      );
    }
  }, [dispatch, profile?._id, query]);

  if (notFoundError) {
    notFound();
  }

  if (permissions || loading) {
    return (
      <div className="col-span-10 flex flex-col items-center justify-center gap-4 h-[100dvh] overflow-hidden bg-stone-950 text-white container relative">
        {skeletonLoading ? (
          <>
            <Skeleton className="sm:w-40 w-32 sm:h-40 h-32 rounded-full" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-32 rounded-full" />
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
            {!call && (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                onClick={handleCall}
              >
                Start Call
              </Button>
            )}
          </>
        )}
      </div>
    );
  } else {
    return <PermissionsRequired />;
  }
}

export default Page;
