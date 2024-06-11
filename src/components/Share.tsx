import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, SendHorizonal } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";

export default function Share() {
  const followers = [
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Send size="26" className="sm:hover:opacity-60 rotate-12" />
      </DialogTrigger>
      <DialogContent className="sm:w-2/3 w-full h-3/4 flex flex-col bg-stone-100 dark:bg-stone-900">
        <h1 className="text-xl">Share post</h1>
        <Input inputMode="search" placeholder="Search for users" />
        <hr className="bg-stone-500 my-2" />
        <div className="flex flex-col justify-start items-start gap-4 overflow-y-auto h-full">
          {followers.map((follower, index) => {
            return (
              <div className="flex items-center gap-3 rounded-lg" key={index}>
                <div className="w-8 h-8">
                  <Image
                    width={32}
                    height={32}
                    src={follower.avatar}
                    alt=""
                    className="w-full h-full rounded-full pointer-events-none select-none"
                  />
                </div>
                <div>
                  <p>{follower.fullName}</p>
                  <p className="text-sm text-gray-500 leading-3">
                    @{follower.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <div className="flex items-center justify-center w-full gap-2">
            <Input
              autoComplete="off"
              type="text"
              name="send"
              inputMode="text"
              placeholder="Add a message"
            />
            <Button size="sm">
              <SendHorizonal />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
