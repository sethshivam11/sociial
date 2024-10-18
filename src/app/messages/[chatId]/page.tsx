"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback, themes } from "@/lib/helpers";
import {
  ChevronLeft,
  DownloadIcon,
  FileIcon,
  Phone,
  SendHorizonal,
  Video,
  X,
  PlayIcon,
  Info,
  ArrowDown,
} from "lucide-react";
import { usePathname } from "next/navigation";
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
import NextImage from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  getMessages,
  sendMessage,
} from "@/lib/store/features/slices/messageSlice";
import {
  getChats,
  setCurrentChat,
} from "@/lib/store/features/slices/chatSlice";
import MessagesLoading from "@/components/skeletons/MessagesLoading";
import ChatLoading from "@/components/skeletons/ChatLoading";
import Link from "next/link";
import MessageActions from "@/components/MessageActions";
import { checkForAssets } from "@/lib/helpers";
import ScrollableFeed from "react-scrollable-feed";
import { useDebounceCallback } from "usehooks-ts";
import { ToastAction, ToastClose, ToastProvider } from "@/components/ui/toast";

function Page({ params }: { params: { chatId: string } }) {
  const dispatch = useAppDispatch();
  const location = usePathname();
  const { toast, dismiss } = useToast();

  const { user } = useAppSelector((state) => state.user);
  const {
    chat,
    chats,
    skeletonLoading: isChatLoading,
  } = useAppSelector((state) => state.chat);
  const { messages, skeletonLoading, typing } = useAppSelector(
    (state) => state.message
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<ScrollableFeed>(null);
  const firstMessageRef = useRef<HTMLDivElement>(null);
  const ringtoneRef = useRef<HTMLAudioElement>(null);

  const formSchema = z.object({
    message: z.string(),
    reply: z
      .object({
        username: z.string(),
        content: z.string(),
      })
      .optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const [theme, setTheme] = useState(themes[0]);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const chatId = params.chatId;
  const message = form.watch("message");
  const setDebouncedBottom = useDebounceCallback(setIsAtBottom, 200);

  function handleDownload(content: string) {
    const fileURL = content.replace("/upload", "/upload/fl_attachment");
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `Document-${content}`;
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
  }
  function onSubmit({ message, reply }: z.infer<typeof formSchema>) {
    if (!message) return;
    dispatch(
      sendMessage({ content: message, chatId, reply: reply?.content })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Error",
          description: "Something went wrong, while sending message",
          variant: "destructive",
        });
      } else {
        form.reset();
        containerRef.current?.scrollToBottom();
      }
    });
  }
  function giveAssets(content: string, kind: string): ReactNode {
    switch (kind) {
      case "location":
        return (
          <Link href={content} target="_blank">
            <NextImage
              src={`https://maps.gomaps.pro/maps/api/staticmap?center=${
                content.split("?q=")[1]
              }&zoom=15&size=240x240&markers=${content.split("?q=")[1]}&key=${
                process.env.NEXT_PUBLIC_MAPS_API_KEY
              }`}
              alt=""
              className="rounded-xl w-60 aspect-square"
              width="240"
              height="240"
            />
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
      case "document":
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
      default:
        if (content?.includes("https://")) {
          const urlIdx = content.indexOf("https://");
          const url = content.slice(urlIdx).split(" ")[0];
          return (
            <>
              {content.slice(0, urlIdx)}
              <Link
                href={url}
                target="_blank"
                className="text-blue-500 hover:underline underline-offset-2"
              >
                {url}
              </Link>
              &nbsp;
              {content.slice(urlIdx).split(" ")[1]}
            </>
          );
        } else return <>{content}</>;
    }
  }
  function handleSilence() {
    if (!ringtoneRef.current) return;
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
  }

  useEffect(() => {
    const savedMessageTheme = JSON.parse(
      localStorage.getItem("message-theme") || "{}"
    );
    if (savedMessageTheme.name) {
      setTheme(savedMessageTheme as (typeof themes)[0]);
    } else {
      setTheme(themes[0]);
    }

    dispatch(getMessages({ chatId, page: 1 }));
    if (!chats.length) {
      dispatch(getChats()).then((response) => {
        if (response.payload?.success) dispatch(setCurrentChat(chatId));
      });
    } else if (chat._id !== chatId) {
      dispatch(setCurrentChat(chatId));
    }

    function handleTyping(e: KeyboardEvent) {
      if (e.target === inputRef.current && e.code === "Enter") {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
        return form.reset();
      }
    }

    window.addEventListener("keydown", handleTyping);

    return () => {
      window.removeEventListener("keydown", handleTyping);
    };
  }, [dispatch, chatId, setCurrentChat]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document?.hidden) {
        ringtoneRef.current?.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className={`md:border-l-2 border-stone-200 dark:border-stone-800 md:flex flex flex-col items-start justify-between lg:col-span-7 md:col-span-6 col-span-10 overflow-x-hidden h-[100dvh] sm:min-h-[42rem] relative ${
        location !== "/messages" ? "" : "hidden"
      }`}
    >
      <audio src="/ringtone.mp3" ref={ringtoneRef} />
      <ToastProvider>
      </ToastProvider>
      {isAtBottom && (
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-stone-500 rounded-full absolute z-30 bottom-20 left-1/2 -translate-x-1/2 "
          onClick={() => containerRef.current?.scrollToBottom()}
        >
          <ArrowDown />
        </Button>
      )}
      {isChatLoading ? (
        <ChatLoading />
      ) : (
        <div className="flex gap-2 items-center justify-between py-2 sticky top-0 left-0 w-full md:h-20 border-b-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-black md:px-4 pl-1 pr-0 z-20">
          <div className="flex items-center justify-center">
            <Link
              href="/messages"
              className={`rounded-xl hover:bg-transparent w-8 ${
                location.includes("/messages/") ? "md:hidden" : ""
              }`}
            >
              <ChevronLeft />
            </Link>
            <Link href={chat.isGroupChat ? "" : `/${chat.users[0]?.username}`}>
              <Avatar className="w-12 h-12 ml-0.5 mr-2 cursor-pointer">
                <AvatarImage
                  src={
                    chat.isGroupChat ? chat.groupIcon : chat.users[0]?.avatar
                  }
                  alt=""
                  className="pointer-events-none select-none"
                />
                <AvatarFallback>{nameFallback(chat.groupName)}</AvatarFallback>
              </Avatar>
            </Link>
            <Link
              className="flex flex-col items-start justify-start"
              href={chat.isGroupChat ? "" : `/${chat.users[0]?.username}`}
            >
              <h1 className="text-xl tracking-tight font-bold leading-4 flex items-center justify-start gap-1 truncate py-1">
                {chat.groupName || chat.users[0]?.fullName}
              </h1>
              {!chat.isGroupChat && !typing && (
                <p className="text-stone-500 text-sm">
                  @{chat.users[0]?.username}
                </p>
              )}
              {typing && <p className="text-stone-500 text-sm">Typing...</p>}
            </Link>
          </div>
          <div className="flex items-center justify-center px-4 gap-0.5">
            {!chat.isGroupChat && (
              <>
                {/* <Link
                  href={`/call?username=${chat.users[0]?.username}&video=false`}
                  target="_blank"
                  className="inline-block p-2"
                >
                  <Phone size="20" />
                </Link>
                <Link
                  href={`/call?username=${chat.users[0]?.username}&video=true`}
                  target="_blank"
                  className="inline-block p-2"
                >
                  <Video />
                </Link> */}
                <button
                  className="inline-block p-2"
                  onClick={() => {
                    if ("vibrate" in navigator) {
                      navigator.vibrate([200, 50, 200]);
                    }
                    if (!document?.hidden) ringtoneRef.current?.play();
                    toast({
                      title: "ABC is calling...",
                      description: "Swipe right to silence ringer",
                      action: (
                        <div className="flex gap-2 items-center justify-center">
                          <ToastAction
                            altText="Pick up"
                            className="bg-primary hover:bg-primary/80 text-white dark:text-black"
                            onClick={handleSilence}
                          >
                            <Phone />
                          </ToastAction>
                          <ToastAction
                            altText="Decline"
                            onClick={handleSilence}
                          >
                            <Phone className="rotate-[135deg]" />
                          </ToastAction>
                        </div>
                      ),
                      duration: 30000,
                      onSwipeEnd: handleSilence,
                      onEscapeKeyDown: handleSilence,
                      onOpenChange: (open) => console.log(open),
                    });
                  }}
                >
                  <Phone size="20" />
                </button>
                <button
                  className="inline-block p-2"
                  onClick={() => {
                    if ("vibrate" in navigator) {
                      navigator.vibrate([200, 50, 200]);
                    }
                    if (!document?.hidden) ringtoneRef.current?.play();
                    toast({
                      title: "ABC is calling...",
                      description: "Swipe right to silence ringer",
                      action: (
                        <div className="flex gap-2 items-center justify-center">
                          <ToastAction
                            altText="Pick up"
                            className="bg-primary hover:bg-primary/80 text-white dark:text-black"
                            onClick={handleSilence}
                          >
                            <Video />
                          </ToastAction>
                          <ToastAction
                            altText="Decline"
                            onClick={handleSilence}
                          >
                            <Phone className="rotate-[135deg]" />
                          </ToastAction>
                          <ToastClose />
                        </div>
                      ),
                      duration: 30000,
                      onSwipeEnd: handleSilence,
                      onEscapeKeyDown: handleSilence,
                    });
                  }}
                >
                  <Video />
                </button>
              </>
            )}
            <Link href={`/messages/${chatId}/info`} className="p-2">
              <Info />
            </Link>
          </div>
        </div>
      )}
      <ScrollableFeed
        ref={containerRef}
        className="w-full flex flex-col gap-1 p-2"
        onScroll={(isAtBottom) => setDebouncedBottom(!isAtBottom)}
      >
        <div className="flex flex-col items-center justify-center w-full py-2 gap-2 mb-8">
          <Avatar className="w-28 h-28 select-none pointer-events-none">
            <AvatarImage src={chat.groupIcon || chat.users[0]?.avatar} alt="" />
            <AvatarFallback>
              {nameFallback(chat.groupName || chat.users[0]?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="grid place-items-center">
            <h1 className="text-2xl font-bold tracking-tight flex items-center justify-start">
              {chat.groupName || chat.users[0]?.fullName}
            </h1>
            <p className="text-sm text-stone-500">
              {chat.isGroupChat
                ? `Created on ${new Date(chat.createdAt).toLocaleDateString(
                    "en-IN"
                  )}`
                : `@${chat.users[0]?.username}`}
            </p>
          </div>
          {!chat.isGroupChat && (
            <Link href={`/${chat.users[0]?.username}`}>
              <Button variant="outline" className="my-2">
                View profile
              </Button>
            </Link>
          )}
        </div>
        {skeletonLoading ? (
          <MessagesLoading />
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`group flex items-center justify-start w-full ${
                message.sender?.username !== user.username
                  ? "flex-row"
                  : "flex-row-reverse ml-auto"
              }`}
              ref={index === 0 ? firstMessageRef : undefined}
            >
              {message.sender?.username !== user.username &&
                chat?.isGroupChat && (
                  <div className="flex h-full items-end">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={message.sender?.avatar} />
                      <AvatarFallback>
                        {nameFallback(message.sender?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              <div
                className={`flex flex-col gap-0 overflow-hidden ${
                  message.sender?.username !== user.username
                    ? "items-start"
                    : "items-end"
                }`}
              >
                <span
                  className={`py-1 rounded-xl -mb-1 px-3 opacity-70 truncate max-w-full ${
                    message.sender?.username !== user.username
                      ? `${theme.color} text-${theme.text}`
                      : "bg-stone-300 dark:bg-stone-800"
                  } ${!message?.reply?.content?.length ? "hidden" : ""}`}
                >
                  {message?.reply?.content}
                </span>
                <div
                  className={`py-2 px-4 rounded-2xl w-fit relative ${
                    message.sender?.username !== user.username
                      ? `${theme.color} text-${theme.text} max-w-3/4`
                      : "bg-stone-300 dark:bg-stone-800 max-w-3/4"
                  } ${
                    messages[index - 1]?.sender?.username ===
                    message.sender?.username
                      ? "mb-1"
                      : "mb-3"
                  }
                  ${message?.reacts ? "mb-4" : "mb-1"}`}
                >
                  {giveAssets(message.content, message.kind || "message")}
                  {message?.reacts?.length > 0 && (
                    <MessageReacts
                      messageId={message._id}
                      reacts={message?.reacts}
                      type={
                        message.sender?.username !== user.username
                          ? "reply"
                          : "sent"
                      }
                    />
                  )}
                </div>
              </div>
              <div
                className={`flex group-hover:visible invisible w-fit mb-2 mx-0.5 gap-0 ${
                  message.sender?.username !== user.username
                    ? "flex-row"
                    : "flex-row-reverse"
                }`}
              >
                <MessageOptions
                  isGroupChat={chat.isGroupChat}
                  messageId={message._id}
                  username={message.sender?.username}
                  setReply={(reply) => {
                    const filteredReply = checkForAssets(
                      reply.content,
                      reply.kind
                    );
                    form.setValue("reply", {
                      username: reply.username,
                      content: filteredReply,
                    });
                    inputRef.current?.focus();
                  }}
                  createdAt={message.createdAt}
                  message={message.content}
                  type={
                    message.sender?.username !== user.username
                      ? "reply"
                      : "sent"
                  }
                  kind={message.kind || "message"}
                />
              </div>
            </div>
          ))
        )}
      </ScrollableFeed>
      {!skeletonLoading && (
        <div className="bg-white dark:bg-black bottom-0 right-0 w-full px-2.5 flex items-center justify-center z-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center w-full justify-center gap-2"
            >
              <div
                className={`flex items-center justify-between gap-0 px-3 py-1 w-full border-t-2 leading-5 overflow-hidden ${
                  form.watch("reply")?.content ? "" : "hidden"
                }`}
              >
                <div className="flex gap-2 text-sm overflow-hidden">
                  {form.watch("reply")?.username}:
                  <span className="text-stone-500 truncate max-w-full">
                    {form.watch("reply")?.content.slice(0, 100)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="top-1 right-1 h-fit w-fit hover:bg-white dark:hover:bg-black"
                  onClick={() =>
                    form.setValue("reply", {
                      username: "baila",
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
                        <Input
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
                <MessageActions message={message} chatId={chatId} />
                {form.watch("message").length > 0 && (
                  <Button
                    type="submit"
                    disabled={!message.length}
                    className={`rounded-xl ${theme.color} hover:${theme.color} hover:opacity-80 text-${theme.text}`}
                  >
                    <SendHorizonal />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default Page;
