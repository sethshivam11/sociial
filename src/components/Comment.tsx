import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Ban,
  Heart,
  History,
  Loader2,
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
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  createComment,
  deleteComment,
  dislikeComment,
  getComments,
  getLikes,
  likeComment,
} from "@/lib/store/features/slices/commentSlice";
import Link from "next/link";
import { toast } from "./ui/use-toast";
import CommentsLoading from "./skeletons/CommentsLoading";
import { blockUser } from "@/lib/store/features/slices/userSlice";

interface Props {
  user: {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
  };
  postId: string;
  commentsCount: number;
  isVideo?: boolean;
}

export default function Comment({
  user,
  commentsCount,
  postId,
  isVideo,
}: Props) {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const { likes, loading, comments, skeletonLoading } = useAppSelector(
    (state) => state.comment
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [likesDialog, setLikesDialog] = React.useState({
    open: false,
    commentId: "",
  });
  const [deleteDialog, setDeleteDialog] = React.useState({
    dialogOpen: false,
    commentId: "",
  });
  const [reportDialog, setReportDialog] = React.useState({
    dialogOpen: false,
    commentId: "",
  });
  const [blockDialog, setBlockDialog] = React.useState({
    dialogOpen: false,
    user: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
    },
  });
  const formSchema = z.object({
    comment: commentSchema,
  });

  function handleComment(content: string) {
    dispatch(createComment({ postId, content })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot comment",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  function handleLike(commentId: string) {
    dispatch(likeComment(commentId)).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot like comment",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  function handleUnlike(commentId: string) {
    dispatch(dislikeComment(commentId)).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot like comment",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  function handleDelete() {
    dispatch(deleteComment(deleteDialog.commentId)).then((response) => {
      if (response.payload?.success) {
        setDeleteDialog({
          dialogOpen: false,
          commentId: "",
        });
      } else {
        toast({
          title: "Cannot delete comment",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  function handleBlock() {
    dispatch(blockUser(blockDialog.user._id)).then((response) => {
      if (response.payload?.success) {
        setBlockDialog({
          dialogOpen: false,
          user: {
            _id: "",
            username: "",
            fullName: "",
            avatar: "",
          },
        });
      } else {
        toast({
          title: "Cannot delete comment",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    handleComment(values.comment);
    form.setValue("comment", "");
  }

  React.useEffect(() => {
    if (dialogOpen) dispatch(getComments({ postId }));
  }, [dispatch, dialogOpen, getComments, postId]);

  React.useEffect(() => {
    if (likesDialog.open && likesDialog.commentId)
      dispatch(getLikes(likesDialog.commentId));
    console.log(likesDialog.commentId);
  }, [dispatch, getLikes, likesDialog.open, likesDialog.commentId]);

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
          {skeletonLoading ? (
            <CommentsLoading />
          ) : comments.length ? (
            <ScrollArea className="h-full px-2">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-1 mb-3 group"
                >
                  <Avatar>
                    <AvatarImage
                      src={comment.user.avatar}
                      className="pointer-events-none select-none"
                    />
                    <AvatarFallback>
                      {nameFallback(comment.user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="px-2">
                    <div className="text-sm font-light">
                      <span className="font-semibold">
                        {comment.user.username}&nbsp;
                      </span>
                      {comment.content}
                    </div>
                    <div className="flex gap-3 items-center text-xs mt-1 text-stone-500 dark:text-stone-400 select-none">
                      <button
                        onClick={() => {
                          if (comment.likes.includes(currentUser.username)) {
                            handleUnlike(comment._id);
                          } else {
                            handleLike(comment._id);
                          }
                        }}
                      >
                        <Heart
                          size="16"
                          className={`${
                            comment.likes.includes(currentUser.username)
                              ? "text-rose-500"
                              : "sm:hover:opacity-60"
                          } mr-1 inline-block transition-all active:scale-110`}
                          fill={
                            comment.likes.includes(currentUser.username)
                              ? "rgb(244 63 94)"
                              : "none"
                          }
                        />
                      </button>
                      <Dialog
                        open={likesDialog.open}
                        onOpenChange={(open) => {
                          if (open) {
                            setLikesDialog({
                              open: true,
                              commentId: comment._id,
                            });
                          } else {
                            setLikesDialog({
                              open: false,
                              commentId: "",
                            });
                          }
                        }}
                      >
                        <DialogTrigger>
                          {comment.likesCount <= 1
                            ? `${comment.likesCount} like`
                            : `${comment.likesCount} likes`}
                        </DialogTrigger>
                        <DialogContent
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <DialogTitle className="text-center max-h-10">
                            Likes
                          </DialogTitle>
                          {loading ? (
                            <div className="min-w-80 min-h-96 flex items-center justify-center">
                              <Loader2 className="animate-spin" size="30" />
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 h-full">
                              {likes.length ? (
                                <ScrollArea className="h-96 sm:min-w-80 w-full px-2 pt-4">
                                  {likes.map((like, index) => (
                                    <Link
                                      href={`/${like.username}`}
                                      key={index}
                                      className="flex items-center space-x-2 w-full sm:hover:bg-stone-200 sm:hover:dark:bg-stone-800 p-2 rounded-xl"
                                    >
                                      <Avatar>
                                        <AvatarFallback>
                                          {nameFallback(like.fullName)}
                                        </AvatarFallback>
                                        <AvatarImage
                                          src={like.avatar}
                                          alt={like.fullName}
                                        />
                                      </Avatar>
                                      <div className="flex flex-col leading-4">
                                        <span>{like.fullName}</span>
                                        <span className="text-stone-500 leading-4 text-sm">
                                          @{like.username}
                                        </span>
                                      </div>
                                    </Link>
                                  ))}
                                </ScrollArea>
                              ) : (
                                <div className="w-full sm:min-w-80 h-96 flex flex-col items-center justify-center gap-2">
                                  <History className="mx-auto" size="50" />
                                  <p className="text-xl font-bold tracking-tight">
                                    No likes yet
                                  </p>
                                  <span className="text-center text-stone-500">
                                    Be the first one to like this post
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Menubar className="border-0 p-0 h-0 rounded-xl">
                        <MenubarMenu>
                          <MenubarTrigger className="w-fit h-fit py-0.5 px-2 rounded-md invisible group-hover:visible">
                            <MoreHorizontal size="16" />
                          </MenubarTrigger>
                          <MenubarContent className="rounded-xl">
                            {user.username === currentUser.username ||
                            comment.user._id === currentUser._id ? (
                              <MenubarItem
                                className="rounded-lg py-2 flex gap-2 items-center text-red-600 focus:text-red-600"
                                onClick={() =>
                                  setDeleteDialog({
                                    dialogOpen: true,
                                    commentId: comment._id,
                                  })
                                }
                              >
                                <Trash2 /> Delete
                              </MenubarItem>
                            ) : (
                              <>
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
                                      user,
                                    })
                                  }
                                >
                                  <Ban /> Block
                                </MenubarItem>
                              </>
                            )}
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <History size="70" />
              <p className="text-xl font-bold tracking-tight">
                No comments yet
              </p>
              <span className="text-center text-stone-500">
                Start the conversation now
              </span>
            </div>
          )}
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
        open={deleteDialog.dialogOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setDeleteDialog({ ...deleteDialog, dialogOpen: open });
          }
        }}
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
              onClick={handleDelete}
            >
              {loading ? <Loader2 /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={blockDialog.dialogOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setBlockDialog({ ...blockDialog, dialogOpen: open });
          }
        }}
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
              onClick={handleBlock}
            >
              {loading ? <Loader2 /> : "Block"}
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
