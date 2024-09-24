"use client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { nameFallback } from "@/lib/helpers";
import {
  getBlockedUsers,
  unblockUser,
} from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { ChevronLeft, History, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  const dispatch = useAppDispatch();
  const { blocked, loading } = useAppSelector((state) => state.user);

  const [blockDialog, setBlockDialog] = React.useState({
    open: false,
    user: {
      _id: "",
      avatar: "",
      fullName: "",
      username: "",
    },
  });

  function handleUnblock(userId: string) {
    dispatch(unblockUser(userId)).then((response) => {
      if (!response.payload?.success) {
        setBlockDialog({
          open: false,
          user: {
            _id: "",
            avatar: "",
            fullName: "",
            username: "",
          },
        });
        toast({
          title: "Cannot unblock user",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  React.useEffect(() => {
    dispatch(getBlockedUsers());
  }, [dispatch, getBlockedUsers]);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto min-h-[90dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-4 my-2 flex items-center gap-4 ">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Blocked accounts
      </h1>
      {blocked.length ? (
        <div className="sm:w-2/3 w-full max-sm:px-6 space-y-2 max-sm:mt-3">
          {blocked.map((user, index) => (
            <div className="flex items-center gap-2" key={index}>
              <div className="flex items-center justify-start gap-3 w-full px-2 py-1.5 rounded-xl">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <p>{user.fullName}</p>
                  <p className="text-stone-500 text-sm">@{user.username}</p>
                </div>
              </div>
              <Button
                variant={"secondary"}
                className="rounded-xl"
                onClick={() =>
                  setBlockDialog({
                    open: true,
                    user,
                  })
                }
              >
                Unblock
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="sm:w-2/3 w-full px-2 h-full flex flex-col justify-center items-center gap-2 text-center">
          <History size="80" />
          <h1 className="text-2xl tracking-tight font-bold">
            No blocked accounts
          </h1>
          <p className="text-stone-500">
            When you block an account, you won&apos;t see their posts, comments,
            or messages.
          </p>
        </div>
      )}
      <AlertDialog
        open={blockDialog.open}
        onOpenChange={(open) => {
          setBlockDialog({
            open,
            user: {
              _id: "",
              avatar: "",
              fullName: "",
              username: "",
            },
          });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Avatar className="mx-auto w-20 h-20">
                <AvatarImage src={blockDialog.user.avatar} />
                <AvatarFallback>
                  {nameFallback(blockDialog.user.fullName)}
                </AvatarFallback>
              </Avatar>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Unblock &nbsp;
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {blockDialog.user.fullName}
              </span>
              &nbsp;&#183;@{blockDialog.user.username}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full sm:flex-col-reverse sm:gap-2 sm:justify-center items-center sm:space-x-0">
            <AlertDialogCancel autoFocus={false} className="w-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full"
              onClick={() => {
                if (loading) return;
                handleUnblock(blockDialog.user._id);
              }}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Page;
