import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Bell, MoreVertical, Palette, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface Props {
  recipents: {
    id: string;
    fullName: string;
    username: string;
    avatar: string;
    followersCount: number;
    postsCount: number;
    followingCount: number;
  }[];
  user: {
    id: string;
    fullName: string;
    username: string;
    avatar: string;
  };
  chatId: string;
}

function ChatInfo({ recipents, user, chatId }: Props) {
  const [switchLoading, setSwitchLoading] = React.useState(false);
  const form = useForm({
    defaultValues: {
      muteNotifications: false,
    },
  });
  const { register, watch, setValue } = form;
  const muteNotifications = watch("muteNotifications");
  function handleSwitchChange() {
    setSwitchLoading(true);
    setTimeout(() => {
      setValue("muteNotifications", !muteNotifications);
      setSwitchLoading(false);
      toast({
        title: !muteNotifications ? "Muted" : "Unmuted",
        description: !muteNotifications
          ? "Messages are now muted"
          : "Messages are now unmuted",
      });
    }, 1000);
  }
  const themes = [
    {
      primary: "",
      secondary: ""
    }
  ]
  return (
    <div className="flex flex-col items-start justify-start w-full max-h-[100svh] gap-2">
      <h1 className="text-2xl font-semibold tracking-tight my-4 w-full h-full text-center">
        Details
      </h1>
      {recipents.length === 1 ? (
        <>
          <h3 className="text-lg mx-3">Members</h3>
          <Link
            href={`/${recipents[0].username}`}
            className="flex items-center justify-start gap-2 w-full h-full px-3 py-3 hover:bg-stone-100 hover:dark:bg-stone-900"
          >
            <Avatar className="pointer-events-none select-none">
              <AvatarImage src={recipents[0].avatar} />
              <AvatarFallback>
                {nameFallback(recipents[0].fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-start gap-0">
              <span className="text-lg font-medium leading-4">
                {recipents[0].fullName}
              </span>
              <span className="text-sm text-stone-500">
                @{recipents[0].username}
              </span>
            </div>
          </Link>
          <hr className="bg-stone-500 w-full" />
        </>
      ) : (
        ""
      )}
      <div className="flex items-center justify-between text-lg w-full py-3 gap-4 px-4 hover:bg-stone-100 hover:dark:bg-stone-900 rounded-sm">
        <Label
          htmlFor="mute-notifications"
          className="flex items-center justify-start gap-4 w-full text-base cursor-pointer"
        >
          <Bell />
          Mute Messages
        </Label>
        <Switch
          id="mute-notifications"
          {...register("muteNotifications")}
          checked={muteNotifications}
          onCheckedChange={handleSwitchChange}
          disabled={switchLoading}
        />
      </div>
      <Dialog>
        <DialogTrigger className="flex items-center justify-start text-base gap-4 py-3 px-4 w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-sm">
          <Palette /> Themes
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col p-2 items-center justify-center">
            
          </div>
        </DialogContent>
      </Dialog>
      {recipents.length === 1 ? (
        ""
      ) : (
        <Dialog>
          <DialogTrigger className="flex items-center justify-start text-base gap-4 py-3 px-4 w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-sm">
            <Users /> Members
          </DialogTrigger>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="rounded-xl"
          >
            <div className="flex flex-col py-4 items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">Members</h3>
              <div className="px-4 w-full my-2">
                <div className="flex items-center justify-between">
                  {recipents.length > 1 ? (
                    <button className="text-blue-500">Add People</button>
                  ) : (
                    ""
                  )}
                </div>
                <div className={`w-full`}>
                  {recipents.map((recipent, index) => (
                    <div
                      className="flex items-center justify-between w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-lg"
                      key={index}
                    >
                      <Link
                        href={`/${recipent.username}`}
                        className="flex items-center justify-start gap-2 w-full h-full px-3 py-2"
                      >
                        <Avatar className="pointer-events-none select-none">
                          <AvatarImage src={recipent.avatar} />
                          <AvatarFallback>
                            {nameFallback(recipent.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start justify-start gap-0">
                          <span className="text-lg font-medium leading-4">
                            {recipent.fullName}
                          </span>
                          <span className="text-sm text-stone-500">
                            @{recipent.username}
                          </span>
                        </div>
                      </Link>
                      <MoreVertical
                        size="20"
                        className="h-full w-fit rounded-lg cursor-pointer px-3 py-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <hr className="bg-stone-500 w-full" />

      <div
        className="mt-24 p-2 w-full bg-transparent
       flex flex-col gap-2"
      >
        {recipents.length === 1 ? (
          <Button variant="ghost" className="w-full">
            Block @{recipents[0].username}
          </Button>
        ) : (
          ""
        )}
        <Button
          className="w-full text-red-600  hover:text-red-600"
          variant="ghost"
        >
          Report Conversation
        </Button>
        <Button
          className="w-full text-red-600 hover:text-red-600"
          variant="ghost"
        >
          Delete Conversation
        </Button>
      </div>
    </div>
  );
}

export default ChatInfo;