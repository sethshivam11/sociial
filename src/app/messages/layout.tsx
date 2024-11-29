"use client";
import { useEffect, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkForAssets, nameFallback } from "@/lib/helpers";
import { History, PhoneCall } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import ChatsLoadingSkeleton from "@/components/skeletons/ChatsLoading";
import {
  getChats,
  setCurrentChat,
} from "@/lib/store/features/slices/chatSlice";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import NewGroupChatDialog from "@/components/NewGroupChatDialog";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Messages({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chats, skeletonLoading } = useAppSelector((state) => state.chat);
  const location = usePathname();

  useEffect(() => {
    dispatch(getChats()).then((response) => {
      if (
        !response.payload?.success &&
        response.payload?.message !== "No chats found"
      ) {
        return toast({
          title: "Error",
          description: "Something went wrong, while fetching chats",
          variant: "destructive",
        });
      }
    });
  }, [dispatch]);

  return (
    <div className="grid h-[100dvh] sm:min-h-[42rem] max-sm:max-h-[100dvh] xl:col-span-8 pl-8 md:pl-4 max-sm:pl-0 sm:col-span-9 col-span-10 sm:grid-cols-10">
      <div
        className={`lg:col-span-3 md:col-span-4 col-span-10 md:flex flex-col items-start justify-start gap-2 py-6 h-full max-h-[100dvh] sm:min-h-[42rem] md:px-0 px-4 sticky top-0 ${
          location === "/messages" ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between w-full mb-4 pr-2">
          <Select
            defaultValue="messages"
            onValueChange={(value) => {
              if (value === "confessions") {
                router.push("/confessions");
              }
            }}
          >
            <SelectTrigger className="text-2xl tracking-tight font-bold text-left p-2.5 pl-0 border-0 w-fit gap-2 focus:ring-0 shadow-none">
              <SelectValue placeholder="Conversations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="messages" className="px-3 py-2">
                Conversations
              </SelectItem>
              <SelectItem value="confessions" className="px-3 py-2">
                Confessions
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden items-center justify-center gap-1">
            <Link href="call-logs" className="p-2" title="Call Logs">
              <PhoneCall />
            </Link>
            <NewGroupChatDialog />
          </div>
        </div>
        <ScrollArea className="py-3 w-full h-full p-2.5 max-sm:hidden min-h-96">
          {skeletonLoading ? (
            <ChatsLoadingSkeleton />
          ) : chats.length > 0 ? (
            chats.map((chat, index) => (
              <Link
                className={`flex items-center justify-center rounded-md w-full gap-2 p-2 mb-1 ${
                  location === `/messages/${chat._id}`
                    ? "bg-stone-200 dark:bg-stone-800 hover:bg-stone-100 hover:dark:bg-stone-900"
                    : "sm:hover:bg-stone-200 sm:dark:hover:bg-stone-800"
                }`}
                key={index}
                title={
                  chat.isGroupChat ? chat.groupName : chat?.users[0]?.fullName
                }
                onClick={() => dispatch(setCurrentChat(chat._id))}
                href={`/messages/${chat._id}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={
                      chat.isGroupChat ? chat.groupIcon : chat?.users[0]?.avatar
                    }
                    alt=""
                    className="pointer-events-none select-none object-contain"
                  />
                  <AvatarFallback>
                    {nameFallback(
                      chat.isGroupChat
                        ? chat.groupName
                        : chat?.users[0]?.fullName
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full">
                  <p>
                    {chat.isGroupChat
                      ? chat.groupName
                      : chat?.users[0]?.fullName}
                  </p>
                  <p className="text-sm md:w-40 sm:w-80 w-40 text-left text-stone-500 text-ellipsis whitespace-nowrap overflow-x-hidden">
                    {chat?.lastMessage
                      ? checkForAssets(
                          chat.lastMessage.content,
                          chat.lastMessage.kind
                        )
                      : ""}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-[80dvh]">
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
        <div className="sm:hidden pb-16 w-full h-full">
          {skeletonLoading ? (
            <ChatsLoadingSkeleton />
          ) : chats.length > 0 ? (
            chats.map((chat, index) => (
              <Link
                className={`flex items-center justify-center rounded-md w-full gap-2 p-2 ${
                  location === `/messages/${chat._id}`
                    ? "bg-stone-200 dark:bg-stone-800 hover:bg-stone-100 hover:dark:bg-stone-900"
                    : "sm:hover:bg-stone-200 sm:dark:hover:bg-stone-800"
                }`}
                key={index}
                title={chat?.users[0]?.username}
                href={`/messages/${chat._id}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={
                      chat.isGroupChat ? chat.groupIcon : chat?.users[0]?.avatar
                    }
                    alt=""
                    className="pointer-events-none select-none"
                  />
                  <AvatarFallback>
                    {nameFallback(chat?.users[0]?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full">
                  <p>
                    {chat.isGroupChat
                      ? chat.groupName
                      : chat?.users[0]?.fullName}
                  </p>
                  <p className="text-sm md:w-40 sm:w-80 w-40 text-left text-stone-500 text-ellipsis whitespace-nowrap overflow-x-hidden">
                    {chat?.lastMessage
                      ? checkForAssets(
                          chat.lastMessage.content,
                          chat.lastMessage.kind
                        )
                      : ""}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-full">
              <History size="60" />
              <div>
                <h2 className="text-xl tracking-tight font-bold">
                  No Chats yet
                </h2>
                <p className="text-stone-500 text-sm">
                  Start a conversation with someone!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Messages;
