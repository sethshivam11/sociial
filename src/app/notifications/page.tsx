"use client";
import NotificationLoading from "@/components/skeletons/NotificationLoading";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { nameFallback } from "@/lib/helpers";
import {
  deleteNotification,
  getNotifications,
  readNotification,
} from "@/lib/store/features/slices/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCheck,
  Circle,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  const dispatch = useAppDispatch();
  const { skeletonLoading, notifications, loading } = useAppSelector(
    (state) => state.notification
  );
  const [followingsIds, setFollowingsIds] = React.useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    id: "",
  });

  function handleDelete(notificationId: string) {
    if (!notificationId) return;
    dispatch(deleteNotification(notificationId)).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Error",
          description:
            response.payload?.message || "Notification could not be deleted",
          variant: "destructive",
        });
      }
    });
  }

  React.useEffect(() => {
    dispatch(getNotifications()).then((response) => {
      if (response.payload?.success) {
        setFollowingsIds(
          response.payload.data.map(
            (notification: { user: { _id: string } }) => notification.user._id
          )
        );
      }
    });
  }, [dispatch, getNotifications]);

  return (
    <div className="sm:container flex flex-col items-center justify-start min-h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 sm:pt-6 pb-3">
      <div className="h-full lg:w-3/4 w-full rounded-xl sm:bg-stone-100 sm:dark:bg-stone-900 md:px-16 sm:px-6 px-0">
        <div className="sticky top-0 sm:bg-stone-100 sm:dark:bg-stone-900 bg-background w-full z-10">
          <div className="w-full flex justify-between items-center max-sm:px-3 sm:pt-4 pt-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl max-sm:hover:bg-background"
              >
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="sm:text-2xl text-lg tracking-tight font-bold w-full text-center sm:py-2">
              Notifications
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl max-sm:hover:bg-background"
                    onClick={() => dispatch(readNotification())}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      <CheckCheck />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent dir="bottom">Mark all as read</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <hr className="w-full bg-stone-950 sm:mt-3 mt-2 sm:mb-2 mb-0" />
        </div>
        {skeletonLoading ? (
          <NotificationLoading />
        ) : notifications.length ? (
          <div className="flex flex-col gap-1 px-3 h-fit overflow-y-auto p-2">
            {notifications.map((notification, index) => (
              <div
                className={`flex items-center justify-start ${
                  !notification.read ? "bg-stone-200 dark:bg-stone-800" : ""
                } hover:bg-stone-300 hover:dark:bg-stone-700 rounded-lg p-2`}
                key={index}
              >
                <Link
                  href={"/"}
                  className="flex items-start gap-2 justify-start w-full"
                >
                  <Avatar>
                    <AvatarImage src={notification.user.avatar} />
                    <AvatarFallback>
                      {nameFallback(notification.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center w-full h-full">
                    <h2 className="flex items-center justify-between w-full text-base font-semibold">
                      {notification.title}
                    </h2>
                    <p className="text-stone-500 text-sm">
                      {notification.description}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center justify-center bg-primary-500 text-white rounded-full w-fit h-full my-auto">
                  {!followingsIds.includes(notification.user._id) &&
                    notification.title === "New Follower" && (
                      <button className="bg-blue-500 w-16 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-blue-700 disabled:bg-blue-400 ml-4">
                        Follow
                      </button>
                    )}
                </div>
                <Menubar className="p-0 w-fit h-fit bg-inherit border-0">
                  <MenubarMenu>
                    <MenubarTrigger>
                      <MoreHorizontal />
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem
                        className="flex gap-2 text-destructive focus:text-destructive"
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            id: notification._id,
                          })
                        }
                      >
                        <Trash2 /> Delete
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full gap-6">
            <BellRing size="80" />
            <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-3xl tracking-tight font-bold">
                No Notifications
              </h1>
              <p className="text-stone-500">Check back later</p>
            </div>
          </div>
        )}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => {
            if (!loading) {
              setDeleteDialog({
                open,
                id: "",
              });
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteDialog.id)}
              >
                Delete
              </Button>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default Page;
