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
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreVerticalIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
    username: string;
    fullName: string;
    avatar: string;
    postId: string;
}

function VideoOptions({username, fullName, avatar, postId}: Props) {
  const router = useRouter();
  const [unfollowDialog, setUnfollowDialog] = React.useState(false);
  const [reportDialog, setReportDialog] = React.useState(false);
  function unfollow(username: string) {
    console.log(`Unfollowed user ${username}`);
  }

  function report(postId: string, username: string) {
    console.log(`Reported post ${postId} by user ${username}`);
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
          className="w-fit h-fit absolute top-2 right-2 rounded-full hover:bg-stone-800 p-2"
          title="Options"
          asChild
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
      <Dialog open={reportDialog}>
        <DialogContent
          className="sm:w-2/3 w-full h-fit flex flex-col bg-stone-100 dark:bg-stone-900"
          hideCloseIcon
        >
          <DialogTitle className="text-center text-2xl my-1 ">
            Report Post
          </DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="report-title">Title</Label>
              <Input
                id="report-title"
                placeholder="What is the issue?"
                className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Describe the issue in detail."
                rows={5}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-file">
              Image
              <span className="text-stone-500 text-sm">&nbsp;(Optional)</span>
            </Label>
            <Input
              type="file"
              id="report-file"
              accept="image/*"
              className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1 ring-stone-200"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => report(postId, username)}
            >
              Report
            </Button>
            <DialogClose onClick={() => setReportDialog(false)}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VideoOptions;
