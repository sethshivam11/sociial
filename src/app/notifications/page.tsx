"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameFallback } from "@/lib/helpers";
import { ArrowLeft, BellRing, Circle, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Notification {
  id: number;
  message: string;
  type: string;
  link: string;
  isNew?: boolean;
  isSystem?: boolean;
  user: {
    avatar: string;
    username: string;
    fullName: string;
    isFollow?: boolean;
    loading?: boolean;
  };
}

function Page() {
  const router = useRouter();
  const savedNotifications: Notification[] = [
    {
      id: 1,
      message: "New message from John Doe",
      type: "message",
      link: "/post/1",
      isNew: true,
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
        isFollow: true,
      },
    },
    {
      id: 2,
      message: "Your subscription has been renewed",
      type: "subscription",
      isNew: false,
      link: "/post/1",
      user: {
        avatar: "/logo.svg",
        username: "sociial",
        fullName: "Sociial",
      },
    },
    {
      id: 3,
      message: "System update available",
      type: "system",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 4,
      message: "Meeting at 10:00 AM tomorrow",
      type: "meeting",
      isNew: false,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 5,
      message: "New friend request",
      type: "social",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 6,
      message: "Your order has been shipped",
      type: "order",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 7,
      message: "You have a new follower",
      type: "social",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "janedoe",
        fullName: "Jane Doe",
      },
    },
    {
      id: 8,
      message: "Reminder: Yearly subscription renewal",
      type: "subscription",
      isNew: false,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 9,
      message: "Welcome to our new app feature!",
      type: "feature",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 10,
      message: "Security alert: Please update your password",
      type: "security",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 11,
      message: "You've been tagged in a post",
      type: "social",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "janedoe",
        fullName: "Jane Doe",
      },
    },
    {
      id: 12,
      message: "Your friend has joined your group",
      type: "social",
      isNew: false,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "alexsmith",
        fullName: "Alex Smith",
      },
    },
    {
      id: 13,
      message: "Flash sale: 50% off for the next 24 hours",
      type: "promotion",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 14,
      message: "New comment on your photo",
      type: "social",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "emilyjones",
        fullName: "Emily Jones",
      },
    },
    {
      id: 15,
      message: "Your item has been delivered",
      type: "order",
      isNew: false,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 16,
      message: "New course available: Advanced React Techniques",
      type: "education",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
    {
      id: 17,
      message: "You have a new challenge to complete!",
      type: "game",
      isNew: true,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "gamerpro",
        fullName: "Gamer Pro",
      },
    },
    {
      id: 18,
      message: "Your weekly activity report is ready",
      type: "report",
      isNew: false,
      link: "/post/1",
      user: {
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
        username: "johndoe",
        fullName: "John Doe",
      },
    },
  ];
  const [notifications, setNotifications] = React.useState<Notification[]>(savedNotifications);
  return (
    <div className="sm:container flex flex-col items-center justify-start max-h-[100dvh] min-h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div className="h-full lg:w-3/4 w-full rounded-xl sm:bg-stone-100 sm:dark:bg-stone-900 sm:pt-4 md:px-16 sm:px-6 px-0 pb-28">
        <div className="w-full flex justify-between items-center pt-3 max-sm:pb-4 max-sm:px-6 max-sm:bg-stone-100 max-sm:dark:bg-stone-800">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl tracking-tight font-bold w-full text-center">
            Notifications
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/settings")}
          >
            <Wrench />
          </Button>
        </div>
        <hr className="w-full max-sm:hidden bg-stone-950 mb-8 mt-3" />
        {notifications.length ? (
          <div className="flex flex-col gap-3 px-3 h-full mb-16 overflow-y-auto mt-4 max-sm:pb-16">
            {notifications.map((notification, index) => (
              <div
                className="flex items-start justify-start hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg p-2"
                key={index}
              >
                <Link
                  href={notification.link}
                  className="flex items-start justify-start w-full"
                >
                  <Avatar className="mx-2">
                    <AvatarImage src={notification.user.avatar} alt="" />
                    <AvatarFallback>
                      {nameFallback(notification.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center w-full h-full">
                    <h2 className="flex items-center justify-between w-full text-base font-semibold">
                      {notification.message}
                    </h2>
                    <p className="text-stone-500 text-sm">{index + 1}m</p>
                  </div>
                </Link>
                <div className="flex items-center justify-center bg-primary-500 text-white rounded-full w-fit h-full my-auto">
                  {notification.user.isFollow ? (
                    <button className="bg-blue-500 w-16 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-blue-700 disabled:bg-blue-400 ml-4">
                      Follow
                    </button>
                  ) : (
                    notification.isNew && (
                      <Circle
                        size="10"
                        color="rgb(14 165 233)"
                        fill="rgb(14 165 233)"
                        className="w-8"
                      />
                    )
                  )}
                </div>
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
      </div>
    </div>
  );
}

export default Page;
