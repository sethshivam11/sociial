"use client";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import StoriesLoading from "./skeletons/StoriesLoading";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  getStories,
  getUserStory,
} from "@/lib/store/features/slices/storySlice";
import { useRouter, useSearchParams } from "next/navigation";
import { socket } from "@/socket";
import Image from "next/image";

function Story({
  user,
  setRedirecting,
  seen = false,
}: {
  user: {
    avatar: string;
    username: string;
    fullName: string;
  };
  setRedirecting: (redirecting: boolean) => void;
  seen?: boolean;
}) {
  return (
    <Link
      href={`/stories/${user.username}`}
      onClick={() => setRedirecting(true)}
      className="flex flex-col items-center gap-1 sm:hover:scale-105 transition-transform"
    >
      <div
        className={`w-24 h-fit rounded-lg p-1 relative overflow-hidden ring-1 ring-input`}
      >
        <Image
          src={user.avatar}
          alt={user.username}
          width="96"
          height="128"
          className="w-full sm:h-32 h-28 rounded-xl ring-2 ring-white dark:ring-black blur-[2px] object-cover select-none"
          draggable={false}
        />
        <span className="bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent via-transparent/50 to-transparent/80 absolute" />
        <div
          className={`absolute bottom-2 left-2 rounded-full p-1 
            ${
              seen
                ? "bg-stone-400 dark:bg-stone-600"
                : "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500"
            }
          `}
        >
          <Avatar
            className={`max-sm:w-8 max-sm:h-8 ring-2 ring-white dark:ring-black ${
              user.avatar.includes("r5pvoicvcxtyhjkgqk8y.png")
                ? "bg-[#cdd5d8]"
                : "bg-white dark:bg-black"
            } `}
          >
            <AvatarImage
              src={user.avatar}
              alt=""
              className="pointer-events-none select-none object-cover"
            />
            <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <p className="text-xs truncate w-20 max-w-20 ml-2">{user.username}</p>
    </Link>
  );
}

function Stories() {
  const dispatch = useAppDispatch();
  const { user, skeletonLoading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const { stories, userStory, skeletonLoading } = useAppSelector(
    (state) => state.story
  );
  const query = useSearchParams();
  const router = useRouter();

  const sortedStories = stories
    .map((story) => ({
      ...story,
      seen: story.seenBy.includes(user._id),
    }))
    .sort((a, b) => {
      if (a.seen !== b.seen) {
        return a.seen ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!stories.length) dispatch(getStories());
    if (!userStory?.media.length) dispatch(getUserStory());
    const token = query.get("token");
    if (token) {
      localStorage.setItem("token", token);
      if (!socket.active) socket.connect();
      router.replace("/");
    }
  }, [dispatch, query, stories.length, userStory?.media.length, router]);

  return (
    <>
      {redirecting && (
        <div className="fixed h-full w-full flex items-center justify-center bg-transparent/50 z-50 overflow-clip top-0 left-0">
          <Loader2 className="animate-spin" size="100" strokeWidth="1" />
        </div>
      )}
      <div className="h-30 flex overflow-x-auto w-full p-4 gap-2 sm:gap-4 no-scrollbar">
        <Link
          href={userStory?.media[0] ? "/story" : "add-story"}
          onClick={() => setRedirecting(true)}
          className={`flex flex-col items-center gap-1 ${
            userStory?.media[0] ? "sm:hover:scale-105 transition-transform" : ""
          }`}
        >
          <div
            className={`w-24 h-fit rounded-lg p-1 relative overflow-hidden ring-1 ring-input`}
          >
            <Image
              src={user.avatar}
              width="96"
              height="128"
              alt={user.username}
              className="w-full sm:h-32 h-28 rounded-xl ring-2 ring-white dark:ring-black blur-[2px] object-cover select-none"
              draggable={false}
            />
            <span className="bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent dark:via-transparent/50 via-transparent-20 dark:to-transparent/80 to-transparent/30 rounded-b-xl absolute" />
            {userStory?.media[0] ? (
              <div
                className={`absolute bottom-2 left-2 rounded-full p-1 
            ${
              userStory?.media[0] && userStory?.selfSeen
                ? "bg-stone-400 dark:bg-stone-600"
                : "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500"
            }
          `}
              >
                <Avatar
                  className={`max-sm:w-8 max-sm:h-8 ring-2 ring-white dark:ring-black ${
                    user.avatar.includes("r5pvoicvcxtyhjkgqk8y.png")
                      ? "bg-[#cdd5d8]"
                      : "bg-white dark:bg-black"
                  } `}
                >
                  <AvatarImage
                    src={user.avatar}
                    alt=""
                    className="pointer-events-none select-none object-cover"
                  />
                  <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Link
                href="/add-story"
                className="absolute inline-flex items-center justify-center w-10 h-10 text-xs font-bold text-white bg-[#fd1958] rounded-full bottom-2 left-2 sm:hover:scale-105"
              >
                <Plus size="30" />
              </Link>
            )}
          </div>
          <p className="text-xs truncate w-20 max-w-20 ml-2">You</p>
        </Link>
        {skeletonLoading ? (
          <StoriesLoading />
        ) : (
          sortedStories.map((story, index) => {
            return (
              <Story
                key={index}
                user={story.user}
                setRedirecting={setRedirecting}
                seen={story.seenBy.includes(user._id)}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default Stories;
