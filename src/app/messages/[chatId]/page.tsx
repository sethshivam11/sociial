"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import {
  ChevronLeft,
  CameraIcon,
  DownloadIcon,
  FileIcon,
  ImageIcon,
  Info,
  MapPin,
  MicIcon,
  Paperclip,
  Phone,
  SendHorizonal,
  Video,
  X,
  PlayIcon,
  MapPinnedIcon,
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
import NextImage from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CameraDialog from "@/components/CameraDialog";
import MediaDialog from "@/components/MediaDialog";
import AudioDialog from "@/components/AudioDialog";
import Link from "next/link";
import DocumentDialog from "@/components/DocumentDialog";

interface Message {
  id: string;
  content: string;
  type: "sent" | "reply";
  kind?: "message" | "location" | "image" | "video" | "audio" | "document";
  time: string;
  reply?: {
    username: string;
    content: string;
  };
  reacts?: {
    id: string;
    emoji: string;
    fullName: string;
    username: string;
    avatar: string;
  }[];
}

function Page({ params }: { params: { chatId: string } }) {
  const formSchema = z.object({
    message: z.string(),
  });
  const location = usePathname();
  const router = useRouter();
  const chatId = params.chatId;
  const messageScrollElement = React.useRef<HTMLDivElement>(null);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = React.useState(false);
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [mediaOpen, setMediaOpen] = React.useState(false);
  const [audioOpen, setAudioOpen] = React.useState(false);
  const [documentOpen, setDocumentOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      reply: {
        username: recipent.username,
        content:
          "This is a very long reply and I also don't know what I am writing so this is to test the UI. Go test it and make it fast as soon as possible",
      },
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
    {
      id: "32",
      content: "https://google.com/maps?q=26.8756,80.9115",
      type: "reply",
      time: "12:45 PM",
      kind: "location",
    },
    {
      id: "33",
      content:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      type: "sent",
      time: "12:45 PM",
      kind: "image",
    },
    {
      id: "34",
      content:
        "https://res.cloudinary.com/dv3qbj0bn/video/upload/f_auto:video,q_auto/v1/samples/dance-2",
      type: "reply",
      time: "12:45 PM",
      kind: "video",
    },
    {
      id: "35",
      content:
        "https://res.cloudinary.com/dv3qbj0bn/video/upload/v1721891990/sociial/audio/wt9znh9o5jbe6cuso7ye.mp3",
      type: "sent",
      time: "12:45 PM",
      kind: "audio",
    },
    {
      id: "36",
      content:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      type: "sent",
      time: "12:45 PM",
      kind: "document",
    },
    {
      id: "37",
      content:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      type: "reply",
      time: "12:45 PM",
      kind: "document",
    },
  ]);
  const [reply, setReply] = React.useState({
    username: "",
    content: "",
  });
  const [infoOpen, setInfoOpen] = React.useState(false);
  const message = form.watch("message");

  function handleDownload(content: string) {
    const fileURL = content.replace("/upload", "/upload/fl_attachment");
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `Document-${content}`;
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
  }

  function onSubmit({ message }: z.infer<typeof formSchema>) {
    if (!message) return;
    const date = new Date();
    const savedMessage: Message = {
      id: String(messages.length + 1),
      content: message,
      type: "sent",
      time: `${date.getHours()}:${date.getMinutes()} ${
        date.getHours() > 12 ? "PM" : "AM"
      }`,
      reply,
    };
    setMessages([...messages, savedMessage]);
    form.setValue("message", "");
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      setReply({
        username: "",
        content: "",
      });
    }, 1);
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

  function shareLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const content = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
        const date = new Date();
        const savedMessage: Message = {
          id: String(messages.length + 1),
          content,
          type: "sent",
          kind: "location",
          time: `${date.getHours()}:${date.getMinutes()} ${
            date.getHours() > 12 ? "PM" : "AM"
          }`,
        };
        setMessages([...messages, savedMessage]);
        setTimeout(() => {
          lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
          setReply({
            username: "",
            content: "",
          });
        }, 1);
      },
      (err) => {
        console.log(err);
        const description =
          err.message === "User denied Geolocation"
            ? "Please provide location permisions"
            : "Something went wrong, while fetching location";
        toast({
          title: "Error",
          description,
          variant: "destructive",
        });
      }
    );
  }

  function checkForAssets(message: string, kind: string): string {
    switch (kind) {
      case "location":
        return `📍 Location`;
      case "image":
        return `📷 Image`;
      case "video":
        return `🎥 Video`;
      case "audio":
        return `🔊 Audio`;
      case "document":
        return `📄 Document`;
      default:
        return message;
    }
  }

  function giveAssets(content: string, kind: string): React.ReactNode {
    switch (kind) {
      case "location":
        return (
          <Link href={content} target="_blank">
            <MapPinnedIcon strokeWidth="1.5" size="80" />
          </Link>
        );
      case "image":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-40 min-h-20 max-h-40 rounded-sm">
                <NextImage
                  src={content}
                  alt=""
                  width="160"
                  height="160"
                  className="w-full h-full"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="h-full w-full">
              <DialogTitle></DialogTitle>
              <NextImage
                src={content}
                width="160"
                height="160"
                alt=""
                className="h-full w-full object-contain m-auto"
                onError={() => (
                  <span className="text-black dark:text-white">
                    Something went wrong
                  </span>
                )}
              />
              <DialogFooter className="max-sm:items-end items-end">
                <Button
                  size="icon"
                  className="rounded-xl"
                  onClick={() => handleDownload(content)}
                >
                  <DownloadIcon />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      case "video":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-40 min-h-20 max-h-40 rounded-sm relative">
                <span className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-transparent/50 rounded-full p-2">
                  <PlayIcon fill="white" color="white" />
                </span>
                <video
                  src={content}
                  width="160"
                  height="160"
                  className="w-full object-contain rounded-lg"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="h-full w-full">
              <DialogTitle></DialogTitle>
              <video
                src={content}
                className="w-full object-contain m-auto"
                onError={() => (
                  <span className="text-black dark:text-white">
                    Something went wrong
                  </span>
                )}
                controls
                controlsList="nodownload"
              />
              <DialogFooter className="max-sm:items-end items-end">
                <Button
                  size="icon"
                  className="rounded-xl"
                  onClick={() => handleDownload(content)}
                >
                  <DownloadIcon />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      case "audio":
        return (
          <div className="py-2">
            <audio src={content} controls />
          </div>
        );
      default:
        return (
          <div
            className={`flex items-center justify-between gap-4 rounded-full py-2 w-fit`}
          >
            <FileIcon size="40" />
            <p className="">
              ...{content.slice(content.length - 10, content.length)}
            </p>
            <Button
              size="icon"
              variant="secondary"
              className="bg-transparent hover:bg-transparent/50 text-white rounded-xl"
              onClick={() => handleDownload(content)}
            >
              <DownloadIcon />
            </Button>
          </div>
        );
    }
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

    function handleTyping(e: KeyboardEvent) {
      if (e.target === inputRef.current && e.code === "Enter") {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
        return form.reset();
      }
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }

    document.addEventListener("keydown", handleTyping);

    return () => {
      document.removeEventListener("keydown", handleTyping);
    };
  }, []);

  return (
    <div
      className={`md:border-l-2 border-stone-200 dark:border-stone-800 md:flex flex flex-col items-start justify-start gap-1 lg:col-span-7 md:col-span-6 col-span-10 ${
        location !== "/messages" ? "" : "hidden"
      } `}
    >
      <div className="flex gap-2 items-center justify-between py-2 sticky top-0 left-0 w-full md:h-20 border-b-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-black md:px-4 pl-1 pr-0 z-20">
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-xl hover:bg-transparent w-8 ${
              location.includes("/messages/") ? "sm:hidden" : ""
            }`}
            onClick={() => router.push("/messages")}
          >
            <ChevronLeft />
          </Button>
          <Link href={`/${recipent.username}`}>
            <Avatar className="w-12 h-12 ml-0.5 mr-2 cursor-pointer">
              <AvatarImage
                src={recipent.avatar}
                alt=""
                className="pointer-events-none select-none"
              />
              <AvatarFallback>{nameFallback(recipent.fullName)}</AvatarFallback>
            </Avatar>
          </Link>
          <Link
            className="flex flex-col items-start justify-start"
            href={`/${recipent.username}`}
          >
            <h1 className="text-xl tracking-tight font-bold leading-4 flex items-center justify-start gap-1">
              {recipent.fullName}
            </h1>
            <p className="text-stone-500 text-sm">@{recipent.username}</p>
          </Link>
        </div>
        <div className="flex items-center justify-center px-4 gap-0.5">
          <Link
            href={`/call?username=${recipent.username}&video=false`}
            target="_blank"
            className="inline-block p-2"
          >
            <Phone size="20" />
          </Link>
          <Link
            href={`/call?username=${recipent.username}&video=true`}
            target="_blank"
            className="inline-block p-2"
          >
            <Video />
          </Link>
          <button
            onClick={() => {
              if (infoOpen) {
                document.body.classList.remove("sm:overflow-y-scroll");
              } else {
                document.body.classList.add("sm:overflow-y-scroll");
              }
              setInfoOpen(!infoOpen);
            }}
            className="p-2"
          >
            <Info strokeWidth={infoOpen ? "3" : "2"} />
          </button>
        </div>
      </div>
      <div
        className="flex flex-col items-start justify-start w-full mr-0 py-2 px-3"
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
                <h1 className="text-2xl font-bold tracking-tight flex items-center justify-start gap-1">
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
            {messages.map((message, index) =>
              !message.kind || message.kind === "message" ? (
                <div
                  className={`group flex items-center justify-start w-full ${
                    message.type === "reply"
                      ? "flex-row"
                      : "flex-row-reverse ml-auto"
                  }`}
                  key={index}
                  onDoubleClick={() => {
                    const filteredReply = checkForAssets(
                      message.content,
                      message.kind || "message"
                    );
                    setReply({
                      username: recipent.username,
                      content: filteredReply,
                    });
                    inputRef.current?.focus();
                  }}
                >
                  <div
                    className={`flex flex-col gap-0 ${
                      message.type === "reply" ? "items-start" : "items-end"
                    }`}
                  >
                    <span
                      className={`py-1 rounded-xl -mb-1 px-3 opacity-70 ${
                        message.type === "sent"
                          ? `${theme.color} text-${theme.text}`
                          : "bg-stone-300 dark:bg-stone-800"
                      } ${
                        message.reply && message.reply.content ? "" : "hidden"
                      }`}
                    >
                      {message.reply && message.reply.content
                        ? message.reply.content.length > 100
                          ? `${message.reply.content.slice(0, 100)}...`
                          : message.reply.content
                        : ""}
                    </span>
                    <div
                      className={`py-2 px-4 rounded-2xl w-fit relative ${
                        message.type === "reply"
                          ? `${theme.color} text-${theme.text} max-w-3/4`
                          : "bg-stone-300 dark:bg-stone-800 max-w-3/4"
                      } ${
                        messages[index - 1]?.type === message.type
                          ? "mb-1"
                          : "mb-3"
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
                  </div>
                  <div
                    className={`reactions flex group-hover:visible invisible w-fit mb-2 mx-0.5 gap-0 ${
                      message.type === "reply" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <MessageOptions
                      username={recipent.username}
                      setReply={(reply) => {
                        const filteredReply = checkForAssets(
                          reply.content,
                          reply.kind
                        );
                        console.log(filteredReply);
                        setReply({
                          username: reply.username,
                          content: filteredReply,
                        });
                        inputRef.current?.focus();
                      }}
                      message={message.content}
                      type={message.type}
                      kind={message.kind || "message"}
                      id={message.id}
                      reactMessage={(emoji) => reactMessage(message, emoji)}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`group flex items-center justify-start w-full relative ${
                    message.type === "reply"
                      ? "flex-row"
                      : "flex-row-reverse ml-auto"
                  }`}
                  key={index}
                  onDoubleClick={() => {
                    const filteredReply = checkForAssets(
                      message.content,
                      message.kind || "message"
                    );
                    setReply({
                      username: recipent.username,
                      content: filteredReply,
                    });
                    inputRef.current?.focus();
                  }}
                >
                  <div
                    className={`flex flex-col2 gap-0 ${
                      message.type === "reply" ? "items-start" : "items-end"
                    }`}
                  >
                    <span
                      className={`py-1 rounded-xl -mb-1 px-3 opacity-70 ${
                        message.type === "sent"
                          ? `${theme.color} text-${theme.text}`
                          : "bg-stone-300 dark:bg-stone-800"
                      } ${
                        message.reply && message.reply.content ? "" : "hidden"
                      }`}
                    >
                      {message.reply && message.reply.content
                        ? message.reply.content.length > 100
                          ? `${message.reply.content.slice(0, 100)}...`
                          : message.reply.content
                        : ""}
                    </span>
                    <div
                      className={`py-2 px-4 rounded-2xl w-fit max-w-3/4 relative ${
                        message.type === "reply"
                          ? `${theme.color} text-${theme.text}`
                          : "bg-stone-300 dark:bg-stone-800"
                      } ${
                        messages[index - 1]?.type === message.type
                          ? "mb-1"
                          : "mb-3"
                      } 
                      ${message.reacts ? "mb-4" : "mb-1"}`}
                      ref={
                        messages[messages.length - 1] === message
                          ? lastMessageRef
                          : null
                      }
                    >
                      {giveAssets(message.content, message.kind)}
                    </div>
                  </div>
                  <div
                    className={`reactions flex group-hover:visible invisible w-fit mb-2 mx-0.5 gap-0 ${
                      message.type === "reply" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <MessageOptions
                      username={recipent.username}
                      setReply={(reply) => {
                        const filteredReply = checkForAssets(
                          reply.content,
                          reply.kind
                        );
                        console.log(filteredReply);
                        setReply({
                          username: reply.username,
                          content: filteredReply,
                        });
                        inputRef.current?.focus();
                      }}
                      message={message.content}
                      type={message.type}
                      id={message.id}
                      kind={message.kind || "message"}
                      reactMessage={(emoji) => reactMessage(message, emoji)}
                    />
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
      {infoOpen ? (
        ""
      ) : (
        <div className="sticky bg-white dark:bg-black bottom-0 left-0 w-full px-2.5 flex items-center justify-center z-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center w-full justify-center gap-2"
            >
              <div
                className={`flex items-center justify-between gap-0 px-3 py-1 w-full border-t-2 leading-5 overflow-hidden ${
                  reply.content ? "" : "hidden"
                }`}
              >
                <div className="flex flex-col">
                  {reply.username}
                  <span className="text-stone-500 text-sm">
                    {reply.content.slice(0, 100)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="top-1 right-1 h-fit w-fit hover:bg-white dark:hover:bg-black"
                  onClick={() =>
                    setReply({
                      username: "",
                      content: "",
                    })
                  }
                >
                  <X size="30" />
                </Button>
              </div>
              <div className="flex items-end w-full justify-center gap-2 py-2">
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
                    <FormItem className="w-full relative flex flex-col bg-white dark:bg-black">
                      <FormControl>
                        <Textarea
                          placeholder="Type a message..."
                          {...field}
                          className="rounded-xl resize-none min-h-10 h-11"
                          autoComplete="off"
                          inputMode="text"
                          ref={inputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Menubar className="border-0 p-0">
                  <MenubarMenu>
                    <MenubarTrigger asChild>
                      <Button
                        className="rounded-xl px-2"
                        type="button"
                        size="icon"
                        variant="ghost"
                      >
                        <Paperclip />
                      </Button>
                    </MenubarTrigger>
                    <MenubarContent align="center" className="rounded-xl">
                      <MenubarItem
                        className="rounded-lg py-2"
                        onClick={() => setMediaOpen(true)}
                      >
                        <ImageIcon />
                        &nbsp;Photos & Videos
                      </MenubarItem>
                      <MenubarItem
                        className="rounded-lg py-2"
                        onClick={() => setCameraOpen(true)}
                      >
                        <CameraIcon />
                        &nbsp;Camera
                      </MenubarItem>
                      <MenubarItem
                        className="rounded-lg py-2"
                        onClick={() => setAudioOpen(true)}
                      >
                        <MicIcon />
                        &nbsp;Audio
                      </MenubarItem>
                      <MenubarItem
                        className="rounded-lg py-2"
                        onClick={() => setDocumentOpen(true)}
                      >
                        <FileIcon />
                        &nbsp;Document
                      </MenubarItem>
                      <MenubarItem
                        className="rounded-lg py-2"
                        onClick={shareLocation}
                      >
                        <MapPin />
                        &nbsp;Location
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
                <Button
                  type="submit"
                  disabled={!message.length}
                  className={`rounded-xl ${theme.color} hover:${theme.color} hover:opacity-80 transition-opacity text-${theme.text}`}
                >
                  <SendHorizonal />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      <CameraDialog open={cameraOpen} setOpen={setCameraOpen} />
      <MediaDialog open={mediaOpen} setOpen={setMediaOpen} />
      <AudioDialog open={audioOpen} setOpen={setAudioOpen} />
      <DocumentDialog open={documentOpen} setOpen={setDocumentOpen} />
    </div>
  );
}

export default Page;
