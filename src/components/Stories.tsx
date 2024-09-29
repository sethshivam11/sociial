"use client";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/lib/helpers";
import StoriesLoading from "./skeletons/StoriesLoading";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  getStories,
  getUserStory,
} from "@/lib/store/features/slices/storySlice";

function Stories() {
  const dispatch = useAppDispatch();
  const { user, skeletonLoading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const { stories, userStory, skeletonLoading } = useAppSelector(
    (state) => state.story
  );

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

  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (!stories.length) dispatch(getStories());
    if (!userStory?.media.length) dispatch(getUserStory());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      {redirecting && (
        <div className="fixed h-full w-full flex items-center justify-center bg-transparent/50 z-50 overflow-clip top-0 left-0">
          <Loader2 className="animate-spin" size="100" strokeWidth="1" />
        </div>
      )}
      <div className="h-30 flex overflow-x-auto w-full p-4 gap-4 no-scrollbar">
        <div className="flex flex-col items-center gap-1 relative">
          <div
            className={`w-20 h-20 rounded-full p-1 ${
              userStory?.media[0] &&
              (userStory?.selfSeen
                ? "bg-stone-400 dark:bg-stone-600"
                : "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500")
            }`}
          >
            <Link
              href={userStory?.media[0] ? `/story` : "/add-story"}
              onClick={() => setRedirecting(true)}
            >
              <Avatar
                className={`w-full h-full ring-2 ring-white dark:ring-black ${
                  user.avatar.includes("r5pvoicvcxtyhjkgqk8y.png")
                    ? "bg-[#cdd5d8]"
                    : "bg-white dark:bg-black"
                }`}
              >
                <AvatarImage
                  src={user.avatar}
                  alt=""
                  className="pointer-events-none select-none"
                />
                <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="/add-story">
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full bottom-0 end-0 sm:hover:scale-110">
                <Plus />
              </div>
            </Link>
          </div>
        </div>
        {skeletonLoading ? (
          <StoriesLoading />
        ) : (
          sortedStories.map((story, index) => {
            return (
              <Link
                href={`/stories/${story.user.username}`}
                key={index}
                onClick={() => setRedirecting(true)}
                className="flex flex-col items-center gap-1 sm:hover:scale-105 transition-transform"
              >
                <div
                  className={`w-20 h-20 rounded-full p-1 ${
                    story.seenBy.includes(user._id)
                      ? "bg-stone-400 dark:bg-stone-600"
                      : "bg-gradient-to-bl from-red-500 via-blue-500 to-green-500 "
                  }`}
                >
                  <Avatar
                    className={`w-full h-full ring-2 ring-white dark:ring-black ${
                      story.user.avatar.includes("r5pvoicvcxtyhjkgqk8y.png")
                        ? "bg-[#cdd5d8]"
                        : "bg-white dark:bg-black"
                    }`}
                  >
                    <AvatarImage
                      src={story.user.avatar}
                      alt=""
                      className="pointer-events-none select-none"
                    />
                    <AvatarFallback>
                      {nameFallback(story.user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

export default Stories;
