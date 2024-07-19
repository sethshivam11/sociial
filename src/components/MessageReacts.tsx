import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";

interface Props {
  reacts: {
    emoji: string;
    fullName: string;
    username: string;
    avatar: string;
  }[];
  type: string;
}

function MessageReacts({ reacts, type }: Props) {
  function getUniqueEmojis(reacts: Props["reacts"]): string {
    let threeEmojis = new Set<string>();
    reacts.map((react) => {
      if (threeEmojis.size < 3) {
        threeEmojis.add(react.emoji);
      }
    });
    return Array.from(threeEmojis).join("");
  }

  return (
    <Dialog>
      <DialogTrigger
        className={`absolute rounded-full text-xs px-1 py-0.5 z-10 ring-1 -bottom-3 ring-white dark:ring-black text-white dark:text-black ${
          reacts && type === "reply"
            ? "left-3 mr-auto bg-stone-800 dark:bg-stone-300 text-white dark:text-black"
            : "right-3 ml-auto bg-stone-300 dark:bg-stone-800 text-black dark:text-white"
        }`}
      >
        {getUniqueEmojis(reacts)}
        {reacts.length === 1 ? "" : reacts.length}
      </DialogTrigger>
      <DialogContent
        className="py-5 flex flex-col items-center justify-center max-w-96"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <h1 className="text-xl font-semibold tracking-tight">Reactions</h1>
        {reacts.map((react, index) => (
          <div
            className="flex items-center space-x-1 justify-between w-full"
            key={index}
          >
            <div className="flex flex-row">
              <Avatar className="mx-2">
                <AvatarImage src={react.avatar} />
                <AvatarFallback>{nameFallback(react.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p>{react.fullName}</p>
                <p className="text-stone-500 text-sm">@{react.username}</p>
              </div>
            </div>
            <p className="w-5 h-5 text-xl">{react.emoji}</p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default MessageReacts;
