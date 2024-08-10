"use client";
import { MoreHorizontal } from "lucide-react";
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
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import ReportDialog from "./ReportDialog";

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
  const router = useRouter();
  const location = usePathname();
  const [unfollowDialog, setUnfollowDialog] = React.useState(false);
  const [reportDialog, setReportDialog] = React.useState(false);

  function unfollow(username: string) {
    console.log(`Unfollowed user ${username}`);
  }

  async function copyLink(username: string, postId: string) {
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
          <DialogClose
            className="text-red-500 w-full md:px-20 py-1"
            onClick={() => setUnfollowDialog(true)}
          >
            Unfollow
          </DialogClose>
          <DialogClose
            className="w-full md:px-20 py-1"
            onClick={() => copyLink(user.username, postId)}
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
      <AlertDialog open={unfollowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Image
                width="80"
                height="80"
                className="mx-auto select-none pointer-events-none"
                src={user.avatar}
                alt=""
              />
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
            <AlertDialogCancel
              autoFocus={false}
              className="w-full"
              onClick={() => setUnfollowDialog(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full bg-destructive text-white hover:bg-destructive/90"
              onClick={() => unfollow(user.username)}
            >
              Unfollow
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
