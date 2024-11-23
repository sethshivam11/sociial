import { MicOff, VideoOff } from "lucide-react";
import React from "react";

function PermissionsRequired() {
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
          Please allow Sociial to access your camera and microphone.
          <br className="max-sm:hidden" />
          You can turn this off later.
        </h6>
      </div>
    </div>
  );
}

export default PermissionsRequired;
