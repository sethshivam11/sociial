import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Bell, MoreVertical, Palette, UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ReportDialog from "./ReportDialog";
import { ScrollArea } from "./ui/scroll-area";
import { useAppSelector } from "@/lib/store/store";
import { Checkbox } from "./ui/checkbox";
import FollowersLoadingSkeleton from "./skeletons/FollowersLoading";

interface Theme {
  name: string;
  color: string;
  text: string;
}

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
  theme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
  setInfoOpen: (open: boolean) => void;
}

function ChatInfo({
  recipents,
  user,
  chatId,
  themes,
  setTheme,
  theme,
  setInfoOpen,
}: Props) {
  const { skeletonLoading, followers } = useAppSelector(
    (state) => state.follow
  );
  const [participants, setParticipants] = React.useState<typeof followers>([]);
  const [switchLoading, setSwitchLoading] = React.useState(false);
  const form = useForm({
    defaultValues: {
      muteNotifications: false,
    },
  });
  const { register, watch, setValue } = form;
  const muteNotifications = watch("muteNotifications");
  const [reportDialog, setReportDialog] = React.useState(false);
  const [removeDialog, setRemoveDialog] = React.useState({
    open: false,
    username: "",
  });
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
  return (
    <div className="flex flex-col items-start justify-start w-full max-h-[100svh] gap-2">
      {recipents.length === 1 && (
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
        </>
      )}
      <hr className="bg-stone-500 w-full" />
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
          className="rounded-xl"
        >
          <div className="flex flex-col py-2 items-center justify-center">
            <h1 className="text-xl tracking-tight font-semibold mt-2 mb-4">
              Themes
            </h1>
            {themes.map((theme, index) => (
              <DialogClose
                className="px-4 py-3 hover:bg-stone-100 hover:dark:bg-stone-900 flex items-center justify-start w-full rounded-xl gap-2 capitalize"
                onClick={() => {
                  setTheme(theme);
                  localStorage.setItem("message-theme", JSON.stringify(theme));
                  setInfoOpen(false);
                }}
                key={index}
              >
                <div className={`rounded-full ${theme.color} w-8 h-8`} />
                &nbsp;{theme.name}
              </DialogClose>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {recipents.length !== 1 && (
        <Dialog>
          <DialogTrigger className="flex items-center justify-start text-base gap-4 py-3 px-4 w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-sm">
            <Users /> Members
          </DialogTrigger>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="rounded-xl"
          >
            <div className="flex flex-col py-4 items-center justify-center">
              <h3 className="text-lg font-semibold mb-2">Members</h3>
              <div className="px-4 w-full my-2">
                <Dialog>
                  <DialogTrigger className="flex items-center justify-between w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-lg">
                    <div className="flex items-center justify-start gap-3 w-full h-full px-5 py-3">
                      <UserPlus size="30" />
                      <h3 className="text-lg font-medium leading-4">
                        Add Members
                      </h3>
                    </div>
                  </DialogTrigger>
                  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogTitle>Add Members</DialogTitle>
                    <ScrollArea className="h-96 min-h-10 p-2">
                      {skeletonLoading ? (
                        <FollowersLoadingSkeleton />
                      ) : (
                        followers.map((follower, index) => {
                          return (
                            <div
                              className="flex items-center justify-between w-full px-2 mb-3 gap-3 rounded-lg"
                              key={index}
                            >
                              <Label
                                htmlFor={`follower-${index}`}
                                className="flex items-center gap-3 rounded-lg w-full cursor-pointer"
                              >
                                <Avatar className="w-full h-full rounded-full pointer-events-none select-none">
                                  <AvatarImage src={follower.avatar} />
                                  <AvatarFallback>
                                    {nameFallback(follower.fullName)}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <p className="text-lg leading-5">
                                    {follower.fullName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    @{follower.username}
                                  </p>
                                </div>
                              </Label>
                              <Checkbox
                                id={`follower-${index}`}
                                className="rounded-full w-5 h-5 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 data-[state=checked]:border-0"
                                onCheckedChange={(checked) => {
                                  checked
                                    ? setParticipants([
                                        ...participants,
                                        follower,
                                      ])
                                    : setParticipants((prevParticipants) =>
                                        prevParticipants.filter(
                                          (user) =>
                                            user.username !== follower.username
                                        )
                                      );
                                }}
                              />
                            </div>
                          );
                        })
                      )}
                    </ScrollArea>
                    <DialogFooter className="max-sm:gap-2">
                      <Button
                        type="submit"
                        className="rounded-xl"
                        disabled={participants.length < 1}
                      >
                        Add
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
        className="p-2 w-full bg-transparent
       flex flex-col gap-2"
      >
        {recipents.length === 1 && (
          <Button variant="ghost" className="w-full">
            Block @{recipents[0].username}
          </Button>
        )}
        <Button
          className="w-full text-red-600  hover:text-red-600"
          variant="ghost"
          onClick={() => setReportDialog(true)}
        >
          Report Conversation
        </Button>
        <ReportDialog
          open={reportDialog}
          setOpen={setReportDialog}
          type="chat"
          entityId={chatId}
        />
        <Button
          className="w-full text-red-600 hover:text-red-600"
          variant="ghost"
        >
          Leave Conversation
        </Button>
      </div>
    </div>
  );
}

export default ChatInfo;
