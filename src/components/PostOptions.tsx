"use client";
import { Loader2, MoreHorizontal } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "./ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import ReportDialog from "./ReportDialog";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { deletePost } from "@/lib/store/features/slices/postSlice";
import { unfollowUser } from "@/lib/store/features/slices/followSlice";

interface Props {
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  postId: string;
  isVideo: boolean;
}

function PostOptions({ user, postId, isVideo }: Props) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user: currentUser, loading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const { loading: postLoading } = useAppSelector((state) => state.post);
  const router = useRouter();
  const location = usePathname();
  const [unfollowDialog, setUnfollowDialog] = React.useState(false);
  const [deletePostDialog, setDeletePostDialog] = React.useState(false);
  const [reportDialog, setReportDialog] = React.useState(false);

  async function copyLink(postId: string) {
    const link = `${process.env.NEXT_PUBLIC_LINK || ""}/post/${postId}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "The link has been copied to your clipboard.",
    });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger className="w-fit" title="Options">
          <MoreHorizontal />
        </DialogTrigger>
        <DialogContent className="w-full md:w-fit" hideCloseIcon>
          <DialogClose
            className="text-red-500 w-full md:px-20 py-1"
            onClick={() => setReportDialog(true)}
          >
            Report
          </DialogClose>
          {user._id === currentUser._id ? (
            <DialogClose
              className="text-red-500 w-full md:px-20 py-1"
              onClick={() => setDeletePostDialog(true)}
            >
              Delete
            </DialogClose>
          ) : (
            <DialogClose
              className="text-red-500 w-full md:px-20 py-1"
              onClick={() => setUnfollowDialog(true)}
            >
              Unfollow
            </DialogClose>
          )}
          <DialogClose
            className="w-full md:px-20 py-1"
            onClick={() => copyLink(postId)}
          >
            Copy link
          </DialogClose>
          {location === "/" ? (
            <DialogClose
              className="w-full md:px-20 py-1"
              onClick={() =>
                router.push(isVideo ? `/video/${postId}` : `/post/${postId}`)
              }
            >
              Open post
            </DialogClose>
          ) : (
            ""
          )}
          <DialogClose
            className="w-full md:px-20 py-1"
            onClick={() => router.push(`/${user.username}`)}
          >
            Go to Account
          </DialogClose>
          <DialogClose className="w-full md:px-20 py-1">Cancel</DialogClose>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={unfollowDialog}
        onOpenChange={(open) => {
          if (!userLoading) {
            setUnfollowDialog(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Avatar className="mx-auto select-none pointer-events-none w-24 h-24">
                <AvatarImage src={user.avatar} className="" />
                <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
              </Avatar>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Unfollow&nbsp;
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {user.fullName}
              </span>
              &nbsp;&#183; @{user.username}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full sm:flex-col-reverse sm:gap-2 sm:justify-center items-center sm:space-x-0">
            <AlertDialogCancel className="w-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                dispatch(unfollowUser({ username: user.username }))
              }
            >
              {userLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Unfollow"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={deletePostDialog}
        onOpenChange={() => {
          if (!postLoading) {
            setDeletePostDialog(!deletePostDialog);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure want to delete this post? This action cannot be
              reverted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus={false}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/80 text-white"
              onClick={() => dispatch(deletePost(postId))}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReportDialog
        open={reportDialog}
        setOpen={setReportDialog}
        entityId={postId}
        type="post"
      />
    </>
  );
}

export default PostOptions;
