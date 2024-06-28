import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquareText, SendHorizonal } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import EmojiKeyboard from "./EmojiKeyboard";

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
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
}

interface FormInterface {
  comment: string;
}

export default function Comment({
  comments,
  user,
  likeComment,
  addComment,
  comment,
  setComment,
}: Props) {
  const form = useForm<FormInterface>({
    defaultValues: {
      comment: "",
    },
  });
  function onSubmit(values: FormInterface) {
    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild title="Comment">
        <MessageSquareText size="30" className="sm:hover:opacity-60" />
      </DialogTrigger>
      <DialogContent
        className="sm:w-2/3 w-full h-3/4 flex flex-col bg-stone-100 dark:bg-stone-900"
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
        <div className="h-full">
          {comments.map((comment, index) => {
            return (
              <div key={index} className="flex flex-col items-start mb-3">
                <div className="flex items-center gap-2 p-1 rounded-lg">
                  <div className="w-6 h-6">
                    <Image
                      width={32}
                      height={32}
                      src={comment.user.avatar}
                      alt=""
                      className="w-full h-full rounded-full pointer-events-none select-none"
                    />
                  </div>
                  <div className="font-semibold">
                    {comment.user.fullName}&nbsp;
                    <span className="text-xs text-stone-500">
                      @{comment.user.username}
                    </span>
                  </div>
                </div>
                <div className="px-1">
                  <p className="py-1.5 px-2">{comment.content}</p>
                  <div className="flex gap-3 text-xs text-stone-500 dark:text-stone-400 select-none">
                    <p>
                      <Heart
                        size="16"
                        className={`${
                          comment.liked
                            ? "text-rose-500"
                            : "sm:hover:opacity-60"
                        } mx-2 inline-block transition-all active:scale-110`}
                        fill={comment.liked ? "rgb(244 63 94)" : "none"}
                        onClick={() => likeComment(comment._id)}
                      />
                      {comment.likesCount <= 1
                        ? "1 like"
                        : `${comment.likesCount} likes`}
                    </p>
                    <button>Reply</button>
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
              className="flex gap-2 w-full items-center"
            >
              <EmojiKeyboard
                message={form.watch("comment")}
                setMessage={(emoji: string): void => {
                  form.setValue("comment", emoji);
                  console.log(emoji);
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
