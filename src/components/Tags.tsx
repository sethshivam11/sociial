import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Link from "next/link";

interface Props {
  tags?: {
    avatar: string;
    fullName: string;
    username: string;
  }[];
}

function Tags({ tags }: Props) {
  return (
    <Dialog>
      <DialogTrigger className="absolute left-6 bottom-2 bg-transparent/60 p-1 rounded-full text-sm">
        {tags ? <User2 size="15" /> : ""}
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-80"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-xl tracking-tight font-semibold w-full text-center mb-4">
            Tags
          </h1>
          {tags?.map((tag, index) => (
            <Link
              href={`/${tag.username}`}
              key={index}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage src={tag.avatar} />
                <AvatarFallback>{nameFallback(tag.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-0">
                <span className="text-lg">{tag.fullName}</span>
                <span className="text-sm text-stone-500">@{tag.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Tags;
