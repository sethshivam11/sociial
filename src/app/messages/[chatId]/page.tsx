"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import {
  ArrowLeft,
  Info,
  Paperclip,
  Phone,
  SendHorizonal,
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
import MessageReacts from "@/components/MessageReacts";
import MessageOptions from "@/components/MessageOptions";
import ChatInfo from "@/components/ChatInfo";

interface Message {
  id: string;
  content: string;
  type: string;
  time: string;
  reacts?: {
    id: string;
    emoji: string;
    fullName: string;
    username: string;
    avatar: string;
  }[];
}

function Page({ params }: { params: { chatId: string } }) {
  const location = usePathname();
  const router = useRouter();
  const chatId = params.chatId;
  const messageScrollElement = React.useRef<HTMLDivElement>(null);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });
  const [recipent, setRecipent] = React.useState({
    id: "1",
    fullName: "John Doe",
    username: "johndoe",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    followersCount: 24,
    followingCount: 12,
    postsCount: 4,
  });
  const [user, setUser] = React.useState({
    id: "2",
    fullName: "John Doe",
    username: "johndoe",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  });
  const themes = [
    {
      name: "default",
      color: "bg-stone-800 dark:bg-stone-300",
      text: "white dark:text-black",
    },
    {
      name: "orange",
      color: "bg-orange-500",
      text: "white",
    },
    {
      name: "rose",
      color: "bg-rose-500",
      text: "white",
    },
    {
      name: "emerald",
      color: "bg-emerald-500",
      text: "black",
    },
    {
      name: "sky",
      color: "bg-sky-500",
      text: "black",
    },
    {
      name: "blue",
      color: "bg-blue-500",
      text: "black",
    },
    {
      name: "purple",
      color: "bg-purple-500",
      text: "white",
    },
  ];
  const [theme, setTheme] = React.useState(themes[0]);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content: "Hello, how are you?",
      type: "sent",
      time: "10:00 AM",
      reacts: [
        {
          id: "1",
          emoji: "❤️",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
        {
          id: "2",
          emoji: "🎉",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
        {
          id: "2",
          emoji: "💯",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
      ],
    },
    {
      id: "2",
      content: "I'm good, thanks! And you?",
      type: "reply",
      time: "10:05 AM",
    },
    {
      id: "3",
      content: "Great to hear! I'm doing well, too.",
      type: "sent",
      time: "10:10 AM",
    },
    {
      id: "4",
      content: "What are you up to today?",
      type: "reply",
      time: "10:15 AM",
    },
    {
      id: "5",
      content: "Just working on a project. You?",
      type: "sent",
      time: "10:20 AM",
    },
    {
      id: "6",
      content: "Same here. Need to finish up some tasks.",
      type: "reply",
      time: "10:25 AM",
    },
    {
      id: "7",
      content: "Let's catch up later then.",
      type: "sent",
      time: "10:30 AM",
    },
    {
      id: "8",
      content: "Sure, looking forward to it.",
      type: "reply",
      time: "10:35 AM",
    },
    { id: "9", content: "See you!", type: "sent", time: "10:40 AM" },
    { id: "10", content: "Bye!", type: "reply", time: "10:45 AM" },
    {
      id: "11",
      content: "How's the project going?",
      type: "sent",
      time: "10:50 AM",
    },
    {
      id: "12",
      content: "Making good progress, thanks!",
      type: "reply",
      time: "10:55 AM",
    },
    {
      id: "13",
      content: "Need any help with it?",
      type: "sent",
      time: "11:00 AM",
    },
    {
      id: "14",
      content: "I might, will let you know.",
      type: "reply",
      time: "11:05 AM",
    },
    { id: "15", content: "What's for lunch?", type: "sent", time: "11:10 AM" },
    {
      id: "16",
      content: "Thinking of ordering pizza.",
      type: "reply",
      time: "11:15 AM",
    },
    { id: "17", content: "Count me in!", type: "sent", time: "11:20 AM" },
    {
      id: "18",
      content: "Great, it's on the way.",
      type: "reply",
      time: "11:25 AM",
    },
    {
      id: "19",
      content: "Thanks! Can't wait.",
      type: "sent",
      time: "11:30 AM",
    },
    {
      id: "20",
      content: "Anytime, should be here soon.",
      type: "reply",
      time: "11:35 AM",
    },
    {
      id: "21",
      content: "Started any new series lately?",
      type: "sent",
      time: "11:40 AM",
    },
    {
      id: "22",
      content: "Yeah, watching a great one now.",
      type: "reply",
      time: "11:45 AM",
    },
    { id: "23", content: "Oh, which one?", type: "sent", time: "11:50 AM" },
    {
      id: "24",
      content: "It's called 'The Great Adventure'.",
      type: "reply",
      time: "11:55 AM",
    },
    {
      id: "25",
      content: "Sounds interesting. Good so far?",
      type: "sent",
      time: "12:00 PM",
    },
    {
      id: "26",
      content: "Really good. Highly recommend it.",
      type: "reply",
      time: "12:05 PM",
    },
    {
      id: "27",
      content: "I'll check it out. Thanks!",
      type: "sent",
      time: "12:10 PM",
    },
    {
      id: "28",
      content: "Let me know how you like it.",
      type: "reply",
      time: "12:15 PM",
    },
    {
      id: "29",
      content: "Will do. Catch up later?",
      type: "sent",
      time: "12:20 PM",
      reacts: [
        {
          id: "1",
          emoji: "❤️",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
      ],
    },
    {
      id: "30",
      content: "Sure thing. Talk later.",
      type: "reply",
      time: "12:25 PM",
      reacts: [
        {
          id: "2",
          emoji: "💯",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
        {
          id: "1",
          emoji: "❤️",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
      ],
    },
    {
      id: "31",
      content: "Sure thing. Talk later.",
      type: "reply",
      time: "12:30 PM",
      reacts: [
        {
          id: "2",
          emoji: "🎉",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
        {
          id: "3",
          emoji: "💯",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
        {
          id: "1",
          emoji: "❤️",
          username: "johndoe",
          fullName: "John Doe",
          avatar:
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        },
      ],
    },
  ]);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const message = form.watch("message");

  function onSubmit({ message }: { message: string }) {
    if (!message) return;
    const date = new Date();
    const savedMessage = {
      id: String(messages.length + 1),
      content: message,
      type: "sent",
      time: `${date.getHours()}:${date.getMinutes()} ${
        date.getHours() > 12 ? "PM" : "AM"
      }`,
    };
    setMessages([...messages, savedMessage]);
    form.setValue("message", "");
    setTimeout(
      () => lastMessageRef.current?.scrollIntoView({ behavior: "smooth" }),
      1
    );
  }

  function reactMessage(message: (typeof messages)[0], emoji: string) {
    const savedReact = {
      id: String(parseInt(message.id) + 1),
      emoji,
      fullName: user.fullName,
      username: user.username,
      avatar: user.avatar,
    };
    let messageReacts = message.reacts;
    if (message.reacts) {
      messageReacts = [...message.reacts, savedReact];
    } else {
      messageReacts = [savedReact];
    }
    setMessages(
      messages.map((msg) =>
        msg.id === message.id ? { ...msg, reacts: messageReacts } : msg
      )
    );
  }

  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [infoOpen]);

  React.useEffect(() => {
    const savedMessageTheme = JSON.parse(
      localStorage.getItem("message-theme") || "{}"
    );
    if (savedMessageTheme.name) {
      setTheme(savedMessageTheme as (typeof themes)[0]);
    } else {
      setTheme(themes[0]);
    }
  }, []);

  return (
    <div
      className={`md:border-l-2 border-stone-200 dark:border-stone-800 md:ml-3 md:flex flex flex-col items-start justify-start gap-1 relative lg:col-span-7 md:col-span-6 col-span-10 overflow-y-auto overflow-x-clip sm:min-h-[42rem] max-h-[100dvh] ${
        location !== "/messages" ? "" : "hidden"
      } `}
    >
      <div className="flex gap-2 items-center justify-between sm:absolute fixed top-0 bottom-auto left-0 w-full md:h-20 h-16 md:ml-3 border-b-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-black md:px-4 pl-1 pr-0 z-20">
        <div className="flex items-center justify-center">
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
          <Avatar
            className="w-12 h-12 ml-0.5 mr-2"
            onClick={() => router.push(`/${recipent.username}`)}
          >
            <AvatarImage
              src={recipent.avatar}
              alt=""
              className="pointer-events-none select-none"
            />
            <AvatarFallback>{nameFallback(recipent.fullName)}</AvatarFallback>
          </Avatar>
          <button className="flex flex-col items-start justify-start">
            <h1 className="text-xl tracking-tight font-bold leading-4">
              {recipent.fullName}
            </h1>
            <p className="text-stone-500 text-sm">@{recipent.username}</p>
          </button>
        </div>
        <div className="px-4 space-x-4">
          <button
            onClick={() => router.push(`/call/audio/${recipent.username}`)}
          >
            <Phone size="20" />
          </button>
          <button
            onClick={() => router.push(`/call/video/${recipent.username}`)}
          >
            <Video />
          </button>
          <button onClick={() => setInfoOpen(!infoOpen)}>
            <Info strokeWidth={infoOpen ? "3" : "2"} />
          </button>
        </div>
      </div>
      <div
        className="max-h-full overflow-y-auto overflow-x-auto md:mt-20 mt-16 md:mb-16 flex flex-col items-start justify-start w-full mr-0 py-2 px-3"
        ref={messageScrollElement}
      >
        {infoOpen ? (
          <ChatInfo
            recipents={[
              {
                ...recipent,
                username: "shadcn",
                avatar: "https://github.com/shadcn.png",
              },
            ]}
            user={user}
            chatId={chatId}
            themes={themes}
            theme={theme}
            setTheme={(newTheme) => setTheme(newTheme)}
            setInfoOpen={(open) => setInfoOpen(open)}
          />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center w-full py-2 gap-2 mb-8">
              <Avatar className="w-28 h-28 select-none pointer-events-none">
                <AvatarImage src={recipent.avatar} alt="" />
                <AvatarFallback>
                  {nameFallback(recipent.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid place-items-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  {recipent.fullName}
                </h1>
                <p className="text-sm text-stone-500">@{recipent.username}</p>
                <p>
                  {recipent.followersCount}
                  &nbsp;Followers &#183; {recipent.postsCount}
                  &nbsp;Posts
                </p>
              </div>
              <Button
                variant="outline"
                className="my-2 rounded-xl"
                onClick={() => router.push(`/${recipent.username}`)}
              >
                View profile
              </Button>
            </div>
            {messages.map((message, index) => (
              <div
                className={`group flex items-center justify-start w-full ${
                  message.type === "reply"
                    ? "flex-row"
                    : "flex-row-reverse ml-auto"
                }`}
                key={index}
              >
                <div
                  className={`py-2 px-4 rounded-[50px] relative ${
                    message.type === "reply"
                      ? `${theme.color} text-${theme.text} max-w-3/4`
                      : "bg-stone-300 dark:bg-stone-800 max-w-3/4"
                  } ${
                    messages[index - 1]?.type === message.type ? "mb-1" : "mb-3"
                  }
              ${message.reacts ? "mb-4" : "mb-1"}`}
                  ref={
                    messages[messages.length - 1] === message
                      ? lastMessageRef
                      : null
                  }
                >
                  {message.content}
                  {message.reacts && (
                    <MessageReacts
                      reacts={message.reacts}
                      type={message.type}
                    />
                  )}
                </div>
                <div
                  className={`reactions flex group-hover:visible invisible w-fit mb-2 mx-0.5 gap-0 ${
                    message.type === "reply" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <MessageOptions
                    message={message.content}
                    type={message.type}
                    id={message.id}
                    reactMessage={(emoji) => reactMessage(message, emoji)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {infoOpen ? (
        ""
      ) : (
        <div className="sm:absolute fixed bg-white dark:bg-black bottom-0 left-0 w-full px-2.5 flex items-center justify-center h-16 py-2 z-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center w-full justify-center gap-2"
            >
              <EmojiKeyboard
                setMessage={(emoji: string): void =>
                  form.setValue("message", emoji)
                }
                message={message}
              />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="rounded-xl px-2"
                type="button"
                size="icon"
                variant="ghost"
              >
                <Paperclip />
              </Button>
              <Button
                type="submit"
                disabled={!message.length}
                className="rounded-xl"
              >
                <SendHorizonal />
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default Page;
