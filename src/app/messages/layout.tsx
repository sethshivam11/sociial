"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Circle, History, Users } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SocketProvider } from "@/context/SocketProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/lib/store/store";
import ChatsLoadingSkeleton from "@/components/skeletons/ChatsLoading";
import FollowersLoadingSkeleton from "@/components/skeletons/FollowersLoading";

function Messages({ children }: { children: React.ReactNode }) {
  const chatsLoading = useAppSelector((state) => state.chat.skeletonLoading);
  const followersLoading = useAppSelector(
    (state) => state.follow.skeletonLoading
  );
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
  const router = useRouter();
  const location = usePathname();
  const savedFollowers = [
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Jane Smith",
      username: "janesmith",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Alex Johnson",
      username: "alexjohnson",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Maria Garcia",
      username: "mariagarcia",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "James Wilson",
      username: "jameswilson",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Linda Brown",
      username: "lindabrown",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
  ];
  const savedChats = [
    {
      id: "1",
      fullName: "John Doe",
      username: "johndoe",
      message: "Hello",
      avatar: "https://github.com/shadcn.png",
      unreadMessages: true,
    },
    {
      id: "2",
      fullName: "Jane Smith",
      username: "janesmith",
      message:
        "Hi there! This is a very long message and I also don't know what I am writing",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "3",
      fullName: "Alex Johnson",
      username: "alexjohnson",
      message: "Good day!",
      avatar: "https://github.com/shadcn.png",
      unreadMessages: true,
    },
    {
      id: "4",
      fullName: "Sam Brown",
      username: "sambrown",
      message: "How's it going?",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      unreadMessages: true,
    },
    {
      id: "5",
      fullName: "Emily White",
      username: "emilywhite",
      message: "Cheers!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "6",
      fullName: "Michael Green",
      username: "michaelgreen",
      message: "Looking forward to it!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "7",
      fullName: "Linda Brown",
      username: "lindabrown",
      message: "Thank you!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "8",
      fullName: "David Wilson",
      username: "davidwilson",
      message: "See you soon!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "9",
      fullName: "Carol Harris",
      username: "carolharris",
      message: "Can't wait!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "10",
      fullName: "Mark Smith",
      username: "marksmith",
      message: "Let's do this!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "11",
      fullName: "Laura Jones",
      username: "laurajones",
      message: "Absolutely!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "12",
      fullName: "Gary White",
      username: "garywhite",
      message: "Sounds great!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "13",
      fullName: "Sarah Brown",
      username: "sarahbrown",
      message: "On my way!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "14",
      fullName: "Brian Davis",
      username: "briandavis",
      message: "What's up?",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "15",
      fullName: "Nancy Wilson",
      username: "nancywilson",
      message: "Good luck!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "16",
      fullName: "Steven Moore",
      username: "stevenmoore",
      message: "Happy Birthday!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "17",
      fullName: "Jessica Taylor",
      username: "jessicataylor",
      message: "Congratulations!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "18",
      fullName: "Daniel Anderson",
      username: "danielanderson",
      message: "Interesting...",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "19",
      fullName: "Susan Wilson",
      username: "susanwilson",
      message: "That's awesome!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "20",
      fullName: "James Johnson",
      username: "jamesjohnson",
      message: "See you later!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "21",
      fullName: "Patricia Miller",
      username: "patriciamiller",
      message: "Good morning!",
      avatar: "https://github.com/shadcn.png",
    },
  ];
  const [chats, setChats] = React.useState(savedChats);
  const [level, setLevel] = React.useState<"1" | "2">("1");
  const [participants, setParticipants] = React.useState<typeof followers>([]);
  const [searchFollowers, setSearchFollowers] = React.useState("");
  const [followers, setFollowers] = React.useState(savedFollowers);
  const setFollowersDebounced = useDebounceCallback(setSearchFollowers, 500);
  const [newChatDialog, setNewChatDialog] = React.useState(false);
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    setNewChatDialog(false);
  }

  React.useEffect(() => {
    if (searchFollowers) {
      setFollowers(
        savedFollowers.filter((follower) =>
          follower.fullName
            .toLowerCase()
            .includes(searchFollowers.toLowerCase())
        )
      );
    } else {
      setFollowers(savedFollowers);
    }
  }, [searchFollowers]);

  return (
    <SocketProvider>
      <div className="grid min-h-[100dvh] max-sm:max-h-[100dvh] xl:col-span-8 pl-8 md:pl-4 sm:col-span-9 col-span-10 sm:grid-cols-10">
        <div
          className={`lg:col-span-3 md:col-span-4 col-span-10 md:flex flex-col items-start justify-start gap-2 py-6 h-full max-h-[100dvh] sm:min-h-[42rem] md:px-0 sm:px-4 px-5 sticky top-0 ${
            location === "/messages" ? "flex" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-4 pr-2">
            <h1 className="text-2xl tracking-tight font-bold text-left p-2.5">
              Conversations
            </h1>
            <Dialog
              open={newChatDialog}
              onOpenChange={(open) => {
                setNewChatDialog(open);
                setParticipants([]);
                setLevel("1");
                form.reset();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="bg-transparent hover:bg-transparent text-black dark:text-white"
                  onClick={() => setNewChatDialog(true)}
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
                                    <AvatarFallback>{nameFallback(follower.fullName)}</AvatarFallback>
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
                                placeholder="Group Description"
                                className="bg-stone-50 dark:bg-background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter className="max-sm:gap-2">
                        <Button type="submit" className="rounded-xl">
                          Create
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="py-3 w-full p-2.5 max-sm:mb-10">
            {chatsLoading ? (
              <ChatsLoadingSkeleton />
            ) : chats.length > 1 ? (
              chats.map((chat, index) => (
                <button
                  className={`flex items-center justify-center rounded-md w-full gap-2 p-2 ${
                    location === `/messages/${chat.username}`
                      ? "bg-stone-200 dark:bg-stone-800 hover:bg-stone-100 hover:dark:bg-stone-900"
                      : "sm:hover:bg-stone-200 sm:dark:hover:bg-stone-800"
                  }`}
                  key={index}
                  title={chat.username}
                  onClick={() => {
                    router.push(`/messages/${chat.username}`);
                  }}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={chat.avatar}
                      alt=""
                      className="pointer-events-none select-none"
                    />
                    <AvatarFallback>
                      {nameFallback(chat.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center w-full">
                    <p>{chat.fullName}</p>
                    <p className="text-sm md:w-40 sm:w-80 w-40 text-left text-stone-500 text-ellipsis whitespace-nowrap overflow-x-hidden">
                      {chat.message}
                    </p>
                  </div>
                  {chat.unreadMessages ? (
                    <Circle
                      fill="rgb(14 165 233)"
                      color="rgb(14 165 233)"
                      size="16"
                      className="mr-2"
                    />
                  ) : (
                    ""
                  )}
                </button>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-full">
                <History size="60" />
                <div>
                  <h2 className="text-2xl tracking-tight font-bold">
                    No Chats yet
                  </h2>
                  <p className="text-stone-500">
                    Start a conversation with someone!
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
        {children}
      </div>
    </SocketProvider>
  );
}

export default Messages;
