import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Ban,
  Heart,
  MessageSquareText,
  MoreHorizontal,
  SendHorizonal,
  ShieldAlert,
  Trash2,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import ReportDialog from "./ReportDialog";
import { ScrollArea } from "./ui/scroll-area";
import { commentSchema } from "@/schemas/postSchema";

interface Props {
  user: {
    fullName: string;
    username: string;
    avatar: string;
  };
  commentsCount: number;
  isVideo?: boolean;
}

export default function Comment({ user, commentsCount, isVideo }: Props) {
  const [comments, setComments] = React.useState([
    {
      _id: "12",
      postId: "1",
      user: {
        _id: "",
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
    {
      _id: "13",
      postId: "1",
      user: {
        _id: "",
        fullName: "Shad",
        username: "shadcn",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      },
      content:
        "This is a comment which is very long and I also don't know what to write in it. So, I am just writing anything that comes to my mind. I hope you are having a good day. Bye! 😊 ",
      liked: false,
      likesCount: 1,
    },
  ]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteComment, setDeleteComment] = React.useState({
    dialogOpen: false,
    commentId: "",
  });
  const [reportDialog, setReportDialog] = React.useState({
    dialogOpen: false,
    commentId: "",
  });
  const [blockDialog, setBlockDialog] = React.useState({
    dialogOpen: false,
    commentId: "",
    user: {
      username: "",
      fullName: "",
      avatar: "",
    },
  });
  const formSchema = z.object({
    comment: commentSchema,
  });
  function addComment(content: string) {
    setComments([
      {
        _id: `${Math.floor(Math.random() * 100)}`,
        postId: comments[0].postId,
        content,
        user: comments[0].user,
        liked: false,
        likesCount: 0,
      },
      ...comments,
    ]);
  }
  function likeComment(_id: string) {
    setComments(
      comments.map((comment) =>
        comment._id === _id
          ? {
              ...comment,
              liked: !comment.liked,
              likesCount: comment.liked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            }
          : comment
      )
    );
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    addComment(values.comment);
    form.setValue("comment", "");
  }
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger title="Comment">
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
              <Avatar>
                <AvatarImage
                  src={user.avatar}
                  className="pointer-events-none select-none"
                />
                <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <p>{user.fullName}</p>
                <p className="text-sm text-gray-500 leading-3">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>
          <hr className="bg-stone-500" />
          <ScrollArea className="h-full">
            {comments.length ? (
              comments.map((comment, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start mb-3 group"
                  >
                    <div className="flex items-start gap-2 p-1 rounded-lg">
                      <div className="w-8 h-w-8">
                        <Avatar>
                          <AvatarImage
                            src={comment.user.avatar}
                            className="pointer-events-none select-none"
                          />
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
                          <Menubar className="border-0 p-0 h-0 rounded-xl">
                            <MenubarMenu>
                              <MenubarTrigger className="w-fit h-fit py-0.5 px-2 rounded-md invisible group-hover:visible">
                                <MoreHorizontal size="16" />
                              </MenubarTrigger>
                              <MenubarContent className="rounded-xl">
                                <MenubarItem
                                  className="rounded-lg py-2 flex gap-2 items-center text-red-600 focus:text-red-600"
                                  onClick={() =>
                                    setDeleteComment({
                                      dialogOpen: true,
                                      commentId: comment._id,
                                    })
                                  }
                                >
                                  <Trash2 /> Delete
                                </MenubarItem>
                                <MenubarItem
                                  className="rounded-lg py-2 flex gap-2 items-center text-red-600 focus:text-red-600"
                                  onClick={() =>
                                    setReportDialog({
                                      dialogOpen: true,
                                      commentId: comment._id,
                                    })
                                  }
                                >
                                  <ShieldAlert /> Report
                                </MenubarItem>
                                <MenubarItem
                                  className="rounded-lg py-2 flex gap-2 items-center text-red-600 focus:text-red-600"
                                  onClick={() =>
                                    setBlockDialog({
                                      dialogOpen: true,
                                      commentId: comment._id,
                                      user,
                                    })
                                  }
                                >
                                  <Ban /> Block
                                </MenubarItem>
                              </MenubarContent>
                            </MenubarMenu>
                          </Menubar>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className=""></div>
            )}
          </ScrollArea>
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
      <AlertDialog
        open={deleteComment.dialogOpen}
        onOpenChange={(open) =>
          setDeleteComment({ ...deleteComment, dialogOpen: open })
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle className="text-center">
            Delete Comment
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            comment?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/80 text-white"
              onClick={() =>
                setDeleteComment({
                  dialogOpen: false,
                  commentId: "",
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={blockDialog.dialogOpen}
        onOpenChange={(open) =>
          setBlockDialog({ ...blockDialog, dialogOpen: open })
        }
      >
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle className="text-center">
            Block {blockDialog.user.fullName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to block @{blockDialog.user.username}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/80 text-white"
              onClick={() =>
                setBlockDialog({
                  dialogOpen: false,
                  commentId: "",
                  user: {
                    username: "",
                    fullName: "",
                    avatar: "",
                  },
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ReportDialog
        open={reportDialog.dialogOpen}
        setOpen={(open) =>
          setReportDialog({ ...reportDialog, dialogOpen: open })
        }
        type="comment"
        entityId={reportDialog.commentId}
      />
    </>
  );
}
