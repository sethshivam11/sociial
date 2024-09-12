"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { nameFallback } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  getUserSuggestions,
  setFollowing,
  setSuggestionLoading,
} from "@/lib/store/features/slices/userSlice";
import {
  followUser,
  unfollowUser,
} from "@/lib/store/features/slices/followSlice";
import { toast } from "./ui/use-toast";
import SuggestionsLoading from "./skeletons/SuggestionsLoading";
import { usePathname } from "next/navigation";

function Suggestions() {
  const dispatch = useAppDispatch();
  const location = usePathname();
  const { suggestions, user, skeletonLoading } = useAppSelector(
    (state) => state.user
  );

  function handleFollow(userId: string) {
    dispatch(setSuggestionLoading(userId));
    dispatch(followUser({ userId }))
      .then((response) => {
        if (!response.payload?.success) {
          toast({
            title: "Failed to follow user",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      })
      .finally(() => dispatch(setFollowing({ userId, isFollowing: true })));
  }
  function handleUnfollow(userId: string) {
    dispatch(setSuggestionLoading(userId));
    dispatch(unfollowUser({ userId }))
      .then((response) => {
        if (!response.payload?.success) {
          toast({
            title: "Failed to unfollow user",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      })
      .finally(() => dispatch(setFollowing({ userId, isFollowing: false })));
  }

  React.useEffect(() => {
    if (!user._id) return;
    dispatch(getUserSuggestions());
  }, [dispatch, getUserSuggestions, user._id, location]);

  return (
    <div className="py-4 px-2 lg:flex hidden h-fit sticky top-0 flex-col gap-4 lg:col-span-3">
      <div className="bg-stone-100 dark:bg-stone-900 pt-4 p-6 rounded-2xl">
        <h1 className="font-semibold text-xl">Suggestions</h1>
        <div className="flex flex-col w-full p-1 mt-4 gap-5">
          {skeletonLoading ? (
            <SuggestionsLoading />
          ) : suggestions.length ? (
            suggestions.map((user, index) => {
              return (
                <div
                  className="flex items-center justify-between gap-3"
                  key={index}
                >
                  <Link
                    href={`/${user.username}`}
                    className="w-full flex items-center gap-3"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.avatar}
                        alt=""
                        className="pointer-events-none select-none"
                      />
                      <AvatarFallback>
                        {nameFallback(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0 leading-3">
                      <span className="text-md font-semibold flex items-center justify-start gap-1">
                        {user.fullName}
                      </span>
                      <span className="text-sm text-stone-400">
                        @{user.username}
                      </span>
                    </div>
                  </Link>
                  {user?.isFollowing ? (
                    <button
                      className="bg-stone-500 w-28 h-7 text-center text-white rounded-full text-xs transition-colors hover:bg-stone-700 disabled:bg-stone-400"
                      onClick={() => handleUnfollow(user._id)}
                      disabled={user?.loading}
                    >
                      {user?.loading ? (
                        <Loader2 className="animate-spin w-full" />
                      ) : (
                        "Unfollow"
                      )}
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 w-28 h-7 text-center text-white rounded-full text-xs transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                      onClick={() => handleFollow(user._id)}
                      disabled={user?.loading}
                    >
                      {user?.loading ? (
                        <Loader2 className="animate-spin w-full" />
                      ) : (
                        "Follow"
                      )}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-center text-sm text-stone-400">
              No suggestions for now
            </span>
          )}
        </div>
      </div>
      {/* <div className="bg-stone-100 dark:bg-stone-900 pt-4 p-6 rounded-2xl">
        <h1 className="font-semibold text-xl">Premium</h1>
        <p className="text-stone-500 my-2 text-sm">
          Subscribe to get access to premium features
        </p>
        <p className="flex items-center justify-start gap-0.5 my-1">
          <Image
            src="/icons/premium.svg"
            width="20"
            height="20"
            alt=""
            className="w-5"
          />
          Verified Badge
        </p>
        <Link href="/get-premium" className="w-full">
          <Button
            className="w-full rounded-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
            size="lg"
          >
            Subscribe
          </Button>
        </Link>
      </div> */}
    </div>
  );
}

export default Suggestions;
