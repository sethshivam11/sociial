import React from "react";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FollowersLoadingSkeleton from "@/components/skeletons/FollowersLoading";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/lib/store/store";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

function NewGroupChatDialog({ open, setOpen }: Props) {
  const defaultIcon =
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1725736840/sociial/settings/feahtus4algwiixi0zmi.png";
  const [level, setLevel] = React.useState<"1" | "2">("1");
  const [searchFollowers, setSearchFollowers] = React.useState("");
  const { followings } = useAppSelector((state) => state.follow);
  const [groupIcon, setGroupIcon] = React.useState(defaultIcon);
  const followersLoading = useAppSelector(
    (state) => state.follow.skeletonLoading
  );
  const [participants, setParticipants] = React.useState<string[]>([]);
  const [followers, setFollowers] = React.useState<typeof followings>([]);
  const formSchema = z.object({
    name: z
      .string()
      .min(3, {
        message: "Group Name must be at least 3 characters long",
      })
      .max(50, {
        message: "Group Name must be at most 50 characters long",
      }),
    description: z.string(),
  });
  const form = useForm({
    defaultValues: {
      name: "Group",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });
  const setFollowersDebounced = useDebounceCallback(setSearchFollowers, 500);
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data, participants);
    setOpen(false);
  }

  React.useEffect(() => {
    if (searchFollowers) {
      setFollowers(
        followings.filter((user) =>
          user.fullName.toLowerCase().includes(searchFollowers.toLowerCase())
        )
      );
    } else {
      setFollowers(followings);
    }
  }, [searchFollowers, followings]);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setParticipants([]);
        setLevel("1");
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-transparent hover:bg-transparent text-black dark:text-white"
          onClick={() => setOpen(true)}
        >
          <Users />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:w-2/3 sm:max-h-[83%] max-h-[100dvh] w-full flex flex-col bg-stone-100 dark:bg-stone-900`}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle>New Group Chat</DialogTitle>
        {level === "1" ? (
          <>
            <Input
              defaultValue={searchFollowers}
              name="searchFollowers"
              autoComplete="off"
              inputMode="search"
              placeholder="Search"
              onChange={(e) => setFollowersDebounced(e.target.value)}
            />
            <hr className="bg-stone-500" />
            <ScrollArea className="h-96 min-h-10 p-2">
              {followersLoading ? (
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
                        <div className="w-8 h-8">
                          <Avatar className="w-full h-full rounded-full pointer-events-none select-none">
                            <AvatarImage src={follower.avatar} />
                            <AvatarFallback>
                              {nameFallback(follower.fullName)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
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
                            ? setParticipants([...participants, follower._id])
                            : setParticipants((prevParticipants) =>
                                prevParticipants.filter(
                                  (user) => user !== follower._id
                                )
                              );
                        }}
                        defaultChecked={participants.includes(follower._id)}
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
                onClick={() => {
                  setLevel("2");
                }}
                disabled={participants.length < 1}
              >
                Next
              </Button>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 h-full w-full"
            >
              <div className="flex w-full items-center justify-center">
                <label htmlFor="group-icon" className="cursor-pointer">
                  <Image
                    src={groupIcon}
                    alt=""
                    width="100"
                    height="100"
                    className="object-cover w-24 h-24 pointer-events-none select-none rounded-full"
                  />
                </label>
                <input
                  type="file"
                  id="group-icon"
                  className="h-0 w-0"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => {
                    if (e.target.files) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setGroupIcon(e.target?.result as string);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Group Name"
                        className="focus-visible:ring-offset-0 focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Group Description (Optional)"
                        className="bg-stone-50 dark:bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="max-sm:gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => setLevel("1")}
                >
                  Back
                </Button>
                <Button type="submit" className="rounded-xl">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NewGroupChatDialog;
