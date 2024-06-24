"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import {
  ArrowLeft,
  MoreHorizontal,
  Paperclip,
  Phone,
  SendHorizonal,
  Smile,
  Video,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import EmojiKeyboard from "@/components/EmojiKeyboard";

function Page({ params }: { params: { chatId: string } }) {
  const location = usePathname();
  const router = useRouter();
  const chatId = params.chatId;
  const unreadMessageRef = React.useRef<HTMLDivElement>(null);
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });
  const [recipent, setRecipent] = React.useState({
    fullName: "John Doe",
    username: "johndoe",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  });
  const [messages, setMessages] = React.useState([
    { id: "1", content: "Hello, how are you?", type: "sent" },
    { id: "2", content: "I'm good, thanks! And you?", type: "reply" },
    { id: "3", content: "Great to hear! I'm doing well, too.", type: "sent" },
    { id: "4", content: "What are you up to today?", type: "reply" },
    { id: "5", content: "Just working on a project. You?", type: "sent" },
    {
      id: "6",
      content: "Same here. Need to finish up some tasks.",
      type: "reply",
    },
    { id: "7", content: "Let's catch up later then.", type: "sent" },
    { id: "8", content: "Sure, looking forward to it.", type: "reply" },
    { id: "9", content: "See you!", type: "sent" },
    { id: "10", content: "Bye!", type: "reply" },
    { id: "11", content: "How's the project going?", type: "sent" },
    { id: "12", content: "Making good progress, thanks!", type: "reply" },
    { id: "13", content: "Need any help with it?", type: "sent" },
    { id: "14", content: "I might, will let you know.", type: "reply" },
    { id: "15", content: "What's for lunch?", type: "sent" },
    { id: "16", content: "Thinking of ordering pizza.", type: "reply" },
    { id: "17", content: "Count me in!", type: "sent" },
    { id: "18", content: "Great, it's on the way.", type: "reply" },
    { id: "19", content: "Thanks! Can't wait.", type: "sent" },
    { id: "20", content: "Anytime, should be here soon.", type: "reply" },
    { id: "21", content: "Started any new series lately?", type: "sent" },
    { id: "22", content: "Yeah, watching a great one now.", type: "reply" },
    { id: "23", content: "Oh, which one?", type: "sent" },
    { id: "24", content: "It's called 'The Great Adventure'.", type: "reply" },
    { id: "25", content: "Sounds interesting. Good so far?", type: "sent" },
    { id: "26", content: "Really good. Highly recommend it.", type: "reply" },
    { id: "27", content: "I'll check it out. Thanks!", type: "sent" },
    { id: "28", content: "Let me know how you like it.", type: "reply" },
    { id: "29", content: "Will do. Catch up later?", type: "sent" },
    { id: "30", content: "Sure thing. Talk later.", type: "reply" },
  ]);
  const [unreadMessages, setUnreadMessages] = React.useState<typeof messages>(
    []
  );
  const message = form.watch("message");

  function onSubmit({ message }: { message: string }) {
    if (!message) return;
    const savedMessage = {
      id: String(messages.length + 1),
      content: message,
      type: "sent",
    };
    setMessages([...messages, savedMessage]);
    form.setValue("message", "");
    setUnreadMessages([...unreadMessages, savedMessage]);
    console.log(unreadMessages[0]);
    unreadMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    if (unreadMessageRef.current) {
      unreadMessageRef.current.scrollIntoView();
    } else {
      // unreadMessageRef.current.scrollIntoView();
    }
  }, []);

  return (
    <div
      className={`md:border-l-2 border-stone-200 dark:border-stone-800 md:ml-3 min-h-screen md:flex flex flex-col items-start justify-start gap-1 relative lg:col-span-7 md:col-span-6 col-span-10 max-h-screen 
        overflow-y-auto overflow-x-clip sm:min-h-[42rem] ${
          location !== "/messages" ? "" : "hidden"
        } `}
    >
      <div className="flex gap-2 items-center justify-between absolute top-0 left-0 w-full h-20 md:ml-3 border-b-2 border-stone-200 dark:border-stone-800 md:px-4 px-3">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`px-2 rounded-xl ${
              location.includes("/messages/") ? "sm:hidden" : ""
            }`}
            onClick={() => router.push("/messages")}
          >
            <ArrowLeft />
          </Button>
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={recipent.avatar}
              alt=""
              className="pointer-events-none select-none"
            />
            <AvatarFallback>{nameFallback(recipent.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl tracking-tight font-bold">
              {recipent.fullName}
            </h1>
            <p className="text-stone-500 text-sm">@{recipent.username}</p>
          </div>
        </div>
        <div className="px-4 space-x-4">
          <button>
            <Phone size="20" />
          </button>
          <button>
            <Video />
          </button>
          <button>
            <MoreHorizontal />
          </button>
        </div>
      </div>
      <div className="max-h-full overflow-y-auto overflow-x-auto flex flex-col items-start justify-start w-full mt-20 mb-16 mr-0 py-2 gap-1 px-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`py-2 px-4 rounded-full ${
              message.type === "reply"
                ? "bg-stone-200 text-black"
                : "bg-stone-800 ml-auto max-w-3/4"
            }`}
            ref={
              unreadMessages[index] ===
              unreadMessages[0]
                ? unreadMessageRef
                : null
            }
          >
            {message.content || ""}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full px-2.5 flex items-center justify-center h-16 py-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center w-full justify-center gap-1"
          >
            <EmojiKeyboard
              setMessage={(emoji: string): void =>
                form.setValue("message", emoji)
              }
              message={message}
            />
            <Button
              variant="ghost"
              size="icon"
              className="px-2 mr-1 rounded-xl"
              type="button"
            >
              <Paperclip />
            </Button>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      {...field}
                      className="rounded-xl"
                      autoComplete="off"
                      inputMode="text"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-1 rounded-xl">
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
