"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameFallback } from "@/lib/helpers";
import { MicOff, VideoOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const query = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [videoEnabled, setVideoEnabled] = React.useState(false);
  const [permissions, setPermissions] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const getPermissions = React.useCallback((video?: boolean) => {
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

  const user = {
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    fullName: "Shivam Soni",
    username: "sethshivam",
    isPremium: false,
  };

  React.useEffect(() => {
    const username = query.get("username");
    const video = query.get("video");
    console.log(username, video);
    setUsername(query.get("username") || "");
    getPermissions(video === "true");
    setVideoEnabled(video === "true");
  }, []);

  if (permissions || loading) {
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
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          onClick={() => router.push(`/call/${username}?video=${videoEnabled}`)}
        >
          Start Call
        </Button>
      </div>
    );
  } else {
    return (
      <div className="col-span-10 flex flex-col items-center justify-center gap-6 container">
        <div className="flex gap-8 text-stone-500">
          <VideoOff size="50" />
          <MicOff size="50" />
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <h1 className="text-2xl tracking-tight font-bold">
            Permissions Required
          </h1>
          <h6 className="text-stone-400">
            Please allow Sociial to access your camera and microphone. <br className="max-sm:hidden" />
            You can turn this off later.
          </h6>
        </div>
      </div>
    );
  }
}

export default Page;
