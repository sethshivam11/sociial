import React from "react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVerticalIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReportDialog from "./ReportDialog";

interface Props {
  username: string;
  fullName: string;
  avatar: string;
  postId: string;
}

function VideoOptions({ username, fullName, avatar, postId }: Props) {
  const router = useRouter();
  const [unfollowDialog, setUnfollowDialog] = React.useState(false);
  const [reportDialog, setReportDialog] = React.useState(false);
  function unfollow(username: string) {
    console.log(`Unfollowed user ${username}`);
  }

  async function copyLink(postId: string) {
    const link = `${process.env.NEXT_PUBLIC_LINK || ""}/post/${postId}`;
    if (navigator.clipboard === undefined) {
      return toast({
        title: "Error",
        description: "An error occurred while copying the link.",
        variant: "destructive",
      });
    }
    await navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "The link has been copied to your clipboard.",
    });
  }
  return (
    <>
      <Dialog>
        <DialogTrigger
          className="w-fit h-fit absolute top-2 right-2 rounded-full p-2"
          title="Options"
        >
          <MoreVerticalIcon />
        </DialogTrigger>
        <DialogContent
          className="w-full md:w-fit"
          hideCloseIcon
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
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
            onClick={() => copyLink(postId)}
          >
            Copy link
          </DialogClose>
          <DialogClose
            className="w-full md:px-20 py-1"
            onClick={() => router.push(`/video/${postId}`)}
          >
            Open post
          </DialogClose>
          <DialogClose
            className="w-full md:px-20 py-1"
            onClick={() => router.push(`/${username}`)}
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
                src={avatar}
                alt=""
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Unfollow&nbsp;
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {fullName}
              </span>
              &nbsp;&#183; @{username}
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
              onClick={() => unfollow(username)}
            >
              Unfollow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ReportDialog
        open={reportDialog}
        setOpen={setReportDialog}
        type="post"
        entityId={postId}
      />
    </>
  );
}

export default VideoOptions;
