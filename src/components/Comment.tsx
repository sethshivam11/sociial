import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MessageSquareText,
  MoreHorizontal,
  SendHorizonal,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import EmojiKeyboard from "./EmojiKeyboard";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";

interface Props {
  comments: {
    user: {
      fullName: string;
      username: string;
      avatar: string;
    };
    content: string;
    _id: string;
    liked: boolean;
    likesCount: number;
  }[];
  user: {
    fullName: string;
    username: string;
    avatar: string;
  };
  commentsCount: number;
  likeComment: Function;
  addComment: Function;
  isVideo?: boolean;
}

export default function Comment({
  comments,
  user,
  likeComment,
  addComment,
  commentsCount,
  isVideo,
}: Props) {
  const formSchema = z.object({
    comment: z
      .string()
      .min(1, {
        message: "Comment cannot be empty",
      })
      .max(1000, {
        message: "Comment cannot be more than 1000 characters",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    addComment(values.comment, "1");
    form.setValue("comment", "");
  }
  return (
    <Dialog>
      <DialogTrigger asChild title="Comment">
        <div className="flex flex-col items-center justify-center">
          <MessageSquareText size="30" className="sm:hover:opacity-60" />
          <span className={`text-sm ${isVideo ? "" : "hidden"}`}>
            {commentsCount}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:w-4/5 max-w-[800px] w-full sm:h-3/4 h-full flex flex-col bg-stone-100 dark:bg-stone-900 focus:ring-0 focus:border-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2 rounded-lg">
            <div className="w-8 h-8">
              <Image
                width={32}
                height={32}
                src={user.avatar}
                alt=""
                className="w-full h-full rounded-full pointer-events-none select-none"
              />
            </div>
            <div>
              <p>{user.fullName}</p>
              <p className="text-sm text-gray-500 leading-3">
                @{user.username}
              </p>
            </div>
          </div>
        </div>
        <hr className="bg-stone-500" />
        <div className="h-full overflow-y-auto">
          {comments.map((comment, index) => {
            return (
              <div key={index} className="flex flex-col items-start mb-3 group">
                <div className="flex items-start gap-2 p-1 rounded-lg">
                  <div className="w-8 h-w-8">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>
                        {nameFallback(comment.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="px-2">
                    <span className="text-sm font-light">
                      <span className="font-semibold">
                        {comment.user.username}&nbsp;
                      </span>
                      {comment.content}
                    </span>
                    <div className="flex gap-3 items-center text-xs mt-1 text-stone-500 dark:text-stone-400 select-none">
                      <button onClick={() => likeComment(comment._id)}>
                        <Heart
                          size="16"
                          className={`${
                            comment.liked
                              ? "text-rose-500"
                              : "sm:hover:opacity-60"
                          } mr-1 inline-block transition-all active:scale-110`}
                          fill={comment.liked ? "rgb(244 63 94)" : "none"}
                        />
                        {comment.likesCount <= 1
                          ? "1 like"
                          : `${comment.likesCount} likes`}
                      </button>
                      <button
                        onClick={() =>
                          form.setValue("comment", `@${user.username} `)
                        }
                      >
                        Reply
                      </button>
                      <Menubar className="border-0 p-0 h-0 rounded-xl">
                        <MenubarMenu>
                          <MenubarTrigger className="w-fit h-fit py-0.5 px-2 rounded-md invisible group-hover:visible">
                            <MoreHorizontal size="16" />
                          </MenubarTrigger>
                          <MenubarContent className="rounded-xl">
                            <MenubarItem className="rounded-lg py-2 text-red-600 focus:text-red-600">
                              Delete
                            </MenubarItem>
                            <MenubarItem className="rounded-lg py-2 text-red-600 focus:text-red-600">
                              Report
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <hr className="bg-stone-500" />
        <DialogFooter>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex sm:gap-2 gap-1 w-full items-center"
            >
              <EmojiKeyboard
                message={form.watch("comment")}
                setMessage={(emoji: string): void => {
                  form.setValue("comment", emoji);
                }}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        name="comment"
                        inputMode="text"
                        autoComplete="off"
                        placeholder="Add a comment..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size="sm" type="submit">
                <SendHorizonal />
              </Button>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
