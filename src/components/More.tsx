"use client";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    username: string;
    fullName: string;
    avatar: string;
  };
  postId: string;
}

function More({ user, postId }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const [unfollowOpen, setUnfollowOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);

  function unfollow(username: string) {
    console.log(`Unfollowed user ${username}`);
    setUnfollowOpen(false);
  }

  function report(postId: string, username: string) {
    console.log(`Reported post ${postId} by user ${user.username}`);
    setReportOpen(false);
  }

  async function copyLink(username: string, postId: string) {
    const link = `${process.env.PUBLIC_URL || ""}/${username}/post/${btoa(
      "jklfjlksdj4589nljlk"
    )}`;
    console.log(process.env.NEXT_PUBLIC_URL);
    await navigator.clipboard.writeText(link);
    // console.log(link);
    toast({
      title: "Link copied to clipboard",
      description: "The link has been copied to your clipboard.",
    });
  }

  return (
    <>
      <Dialog open={reportOpen}>
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
                placeholder="Title for the issue"
                className="bg-stone-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Detailed description of the issue"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => report(postId, user.username)}
            >
              Report
            </Button>
            <Button variant="secondary" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={unfollowOpen}>
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
          <AlertDialogFooter className="flex w-full sm:flex-col-reverse gap-2 sm:justify-center items-center sm:space-x-0">
            <AlertDialogCancel
              onClick={() => setUnfollowOpen(false)}
              autoFocus={false}
              className="w-full"
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
      <Menubar className="w-fit border-transparent bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="w-fit">
            <MoreHorizontal />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              className="text-red-500 focus:text-red-500"
              onClick={() => setReportOpen(true)}
            >
              Report
            </MenubarItem>
            <MenubarItem
              className="text-red-500 focus:text-red-500"
              onClick={() => setUnfollowOpen(true)}
            >
              Unfollow
            </MenubarItem>
            <MenubarItem onClick={() => copyLink(user.username, postId)}>
              Copy link
            </MenubarItem>
            <MenubarItem
              onClick={() =>
                router.push(`/${user.username}/post/${btoa(postId)}`)
              }
            >
              Open post
            </MenubarItem>
            <MenubarItem onClick={() => router.push(`/${user.username}`)}>
              Go to Account
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
}

export default More;
