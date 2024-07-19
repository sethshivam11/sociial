"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  const [notificationPreferences, setNotificationPreferences] = React.useState({
    likes: true,
    comments: true,
    commentLikes: true,
    storyLikes: true,
    newFollowers: true,
    messages: true,
    tags: true,
    group: true,
  });

  React.useEffect(() => {
    console.log(notificationPreferences);
  }, [notificationPreferences]);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-2 my-2 flex items-center gap-4">
        <Link href="/settings/notifications" className="sm:hidden">
          <Button variant="ghost" size="icon" className="rounded-xl ml-2 hover:bg-background">
            <ArrowLeft />
          </Button>
        </Link>
        Push Notifications
      </h1>
      <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5 mt-6">
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Likes</h2>
          <Label
            htmlFor="likes-off"
            className="font-light cursor-pointer flex gap-2 items-center justify-start w-full"
          >
            <input
              type="radio"
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
              id="messages-off"
              name="messages"
              checked={!notificationPreferences.messages}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  messages: e.target.checked ? false : true,
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
              id="messages-on"
              name="messages"
              checked={notificationPreferences.messages}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  messages: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">New Tags</h2>
          <Label
            htmlFor="tags-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="tags-off"
              name="messages"
              checked={!notificationPreferences.tags}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  tags: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="tags-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="tags-on"
              name="tags"
              checked={notificationPreferences.tags}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  tags: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">New Groups</h2>
          <Label
            htmlFor="group-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="group-off"
              name="messages"
              checked={!notificationPreferences.group}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  group: e.target.checked ? false : true,
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
              id="group-on"
              name="group"
              checked={notificationPreferences.group}
              onChange={(e) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  group: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
      </div>
    </div>
  );
}

export default Page;
