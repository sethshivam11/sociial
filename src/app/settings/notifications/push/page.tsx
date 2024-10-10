"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  deleteToken,
  getPreferences,
  updatePreferences,
} from "@/lib/store/features/slices/notificationPreferenceSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

function Page() {
  const dispatch = useAppDispatch();
  const { pushNotifications, loading, skeletonLoading } = useAppSelector(
    (state) => state.notificationPreference
  );
  const [notificationPreferences, setNotificationPreferences] = useState({
    likes: false,
    comments: false,
    commentLikes: false,
    storyLikes: false,
    newFollowers: false,
    newMessages: false,
    newGroups: false,
  });
  const [pauseAll, setPauseAll] = useState(false);
  const [permission, setPermission] = useState(false);

  function handleUpdatePreferences() {
    const {
      likes,
      comments,
      commentLikes,
      storyLikes,
      newFollowers,
      newMessages,
      newGroups,
    } = notificationPreferences;
    dispatch(
      updatePreferences({
        likes,
        comments,
        commentLikes,
        storyLikes,
        newFollowers,
        newMessages,
        newGroups,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot update preferences",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Preferences updated",
          description: "Push notification preferences updated successfully",
        });
      }
    });
  }

  function handlePause() {
    dispatch(
      updatePreferences({
        likes: pauseAll,
        comments: pauseAll,
        commentLikes: pauseAll,
        storyLikes: pauseAll,
        newFollowers: pauseAll,
        newMessages: pauseAll,
        newGroups: pauseAll,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot update preferences",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        toast({
          title: pauseAll ? "Notifications unpaused" : "Notifications paused",
          description: `All notifications are ${
            pauseAll ? "unpaused" : "paused"
          }`,
        });
        setNotificationPreferences({
          likes: pauseAll,
          comments: pauseAll,
          commentLikes: pauseAll,
          storyLikes: pauseAll,
          newFollowers: pauseAll,
          newMessages: pauseAll,
          newGroups: pauseAll,
        });
        setPauseAll(!pauseAll);
      }
    });
  }

  function handlePermission() {
    if (Notification.permission === "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          toast({
            title: "Please provide permission",
            description:
              "Please provide permission to enable push notifications on your device",
            variant: "destructive",
          });
        } else {
          setPermission(true);
          setPauseAll(false);
        }
      });
    } else {
      const consent = JSON.parse(
        localStorage.getItem("notificationToken") ||
          `{"consent": false,"expiry": 0, "token": null, "lastChecked": ${Date.now()}}`
      );
      dispatch(deleteToken(consent?.token));
    }
  }

  useEffect(() => {
    if (Notification.permission === "granted") {
      setPermission(true);
    }
    dispatch(getPreferences()).then((response) => {
      if (response.payload?.success) {
        setNotificationPreferences(response.payload.data.pushNotifications);
        const {
          likes,
          comments,
          commentLikes,
          storyLikes,
          newFollowers,
          newMessages,
          newGroups,
        } = response.payload.data.pushNotifications;
        if (
          !likes &&
          !comments &&
          !commentLikes &&
          !storyLikes &&
          !newFollowers &&
          !newMessages &&
          !newGroups
        ) {
          setPauseAll(true);
        }
      }
    });
  }, [dispatch, setPermission, setNotificationPreferences]);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto min-h-[90dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-20">
      <div className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-2 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings/notifications">
          <ChevronLeft />
        </Link>
        Push Notifications
      </div>
      <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5 mt-6">
        <div className="space-y-2">
          <div className="w-full flex items-center justify-start gap-4">
            <Label
              htmlFor="notification-permission"
              className="text-md cursor-pointer w-full"
            >
              Permissions
            </Label>
            <Switch
              id="notification-permission"
              disabled={skeletonLoading || loading}
              checked={permission}
              onCheckedChange={handlePermission}
            />
          </div>
          <p className="text-stone-500 text-sm">
            Please provide permission to enable push notifications on your
            device
          </p>
        </div>
        <div className="w-full flex items-center justify-start gap-4">
          <Label htmlFor="pause-all" className="text-md cursor-pointer w-full">
            Pause all
          </Label>
          <Switch
            id="pause-all"
            disabled={!permission || skeletonLoading}
            checked={pauseAll || !permission}
            onCheckedChange={handlePause}
          />
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Likes</h2>
          <Label
            htmlFor="likes-off"
            className="font-light cursor-pointer flex gap-2 items-center justify-start w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="likes-off"
              name="likes"
              checked={!notificationPreferences.likes}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  likes: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="likes-on"
            className="font-light cursor-pointer flex gap-2 items-center justify-start w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="likes-on"
              name="likes"
              checked={notificationPreferences.likes}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  likes: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Comments</h2>
          <Label
            htmlFor="comments-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="comments-off"
              name="comments"
              checked={!notificationPreferences.comments}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  comments: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="comments-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="comments-on"
              name="comments"
              checked={notificationPreferences.comments}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  comments: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Comment Likes</h2>
          <Label
            htmlFor="comment-likes-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="comment-likes-off"
              name="comment-likes"
              checked={!notificationPreferences.commentLikes}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  commentLikes: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="comment-likes-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="comment-likes-on"
              name="comment-likes"
              checked={notificationPreferences.commentLikes}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  commentLikes: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Story Likes</h2>
          <Label
            htmlFor="story-likes-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="story-likes-off"
              name="story-likes"
              checked={!notificationPreferences.storyLikes}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  storyLikes: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="story-likes-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="story-likes-on"
              name="story-likes"
              checked={notificationPreferences.storyLikes}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  storyLikes: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">New Followers</h2>
          <Label
            htmlFor="new-followers-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="new-followers-off"
              name="new-followers"
              checked={!notificationPreferences.newFollowers}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  newFollowers: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="new-followers-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="new-followers-on"
              name="new-followers"
              checked={notificationPreferences.newFollowers}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  newFollowers: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">New Messages</h2>
          <Label
            htmlFor="messages-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="messages-off"
              name="messages"
              checked={!notificationPreferences.newMessages}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  newMessages: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="messages-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="messages-on"
              name="messages"
              checked={notificationPreferences.newMessages}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  newMessages: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <hr className="w-full bg-stone-500" />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">New Groups</h2>
          <Label
            htmlFor="group-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="group-off"
              name="group"
              checked={!notificationPreferences.newGroups}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  newGroups: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="group-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              disabled={pauseAll || !permission || skeletonLoading}
              id="group-on"
              name="group"
              checked={notificationPreferences.newGroups}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  newGroups: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <Button
          size="lg"
          onClick={handleUpdatePreferences}
          disabled={
            loading ||
            pauseAll ||
            skeletonLoading ||
            Object.keys(notificationPreferences).every(
              (key) =>
                notificationPreferences[
                  key as keyof typeof notificationPreferences
                ] === pushNotifications[key as keyof typeof pushNotifications]
            )
          }
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}

export default Page;
