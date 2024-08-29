"use client";
import React from "react";
import { Loader2, Search, Users2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Input } from "@/components/ui/input";
import {
  followUser,
  getFollowings,
  unfollowUser,
} from "@/lib/store/features/slices/followSlice";
import FriendsLoading from "@/components/skeletons/FriendsLoading";
import { toast } from "@/components/ui/use-toast";

function Page() {
  const dispatch = useAppDispatch();
  const { followings, skeletonLoading } = useAppSelector(
    (state) => state.follow
  );
  const { profile } = useAppSelector((state) => state.user);
  const [searchResults, setSearchResults] = React.useState<typeof followings>(
    []
  );
  const [search, setSearch] = React.useState("");
  const [followingsIds, setFollowingsIds] = React.useState<string[]>([]);

  function setLoading(userId: string, loading: boolean) {
    setSearchResults((prev) =>
      prev.map((follower) => {
        if (follower._id === userId) {
          return { ...follower, loading };
        }
        return follower;
      })
    );
  }

  function handleFollow(userId: string) {
    setLoading(userId, true);
    dispatch(followUser({ userId }))
      .then((response) => {
        if (response.payload?.success) {
          setFollowingsIds([...followingsIds, userId]);
        } else if (!response.payload?.success) {
          toast({
            title: "Failed to follow user",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      })
      .finally(() => setLoading(userId, false));
  }
  function handleUnfollow(userId: string) {
    setLoading(userId, true);
    dispatch(unfollowUser({ userId }))
      .then((response) => {
        if (response.payload?.success) {
          setFollowingsIds(followingsIds.filter((id) => id !== userId));
        } else if (!response.payload?.success) {
          toast({
            title: "Failed to unfollow user",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      })
      .finally(() => setLoading(userId, false));
  }

  const fetchFollowings = React.useCallback(
    async (username: string) => {
      const response = await dispatch(getFollowings({ username }));
      if (response.payload?.success) {
        setFollowingsIds(
          response.payload.data.followings.map(
            (following: { _id: string }) => following._id
          )
        );
        setSearchResults(response.payload.data.followings);
      }
    },
    [dispatch, getFollowings]
  );

  React.useEffect(() => {
    if (search) {
      setSearchResults(
        followings.filter((follower) => {
          if (
            follower.username.includes(search) ||
            follower.fullName.includes(search)
          )
            return follower;
        })
      );
    } else {
      setSearchResults(followings);
    }
  }, [search]);

  React.useEffect(() => {
    if (!profile.username) return;
    fetchFollowings(profile.username);
  }, [fetchFollowings, profile.username]);

  return (
    <>
      <div className="w-full  max-sm:px-2 sm:bg-stone-100 sm:dark:bg-stone-900 py-2 top-0 sticky z-10">
        <div className="flex items-center gap-2 bg-background rounded-lg w-full pl-3 focus-within:ring-2 focus-within:ring-stone-200 border">
          <Search />
          <Input
            placeholder="Search"
            value={search}
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            inputMode="text"
            autoComplete="off"
            className="focus-within:ring-offset-transparent ring-offset-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-e-lg w-full"
          />
        </div>
      </div>
      {skeletonLoading ? (
        <FriendsLoading />
      ) : searchResults.length ? (
        <div className="flex flex-col gap-1 px-3 h-fit overflow-y-auto overflow-x-hidden pb-2">
          {searchResults.map((followee, index) => (
            <div
              className="flex items-start justify-start sm:hover:bg-stone-200 sm:hover:dark:bg-stone-800 rounded-lg p-2"
              key={index}
            >
              <Link
                href={`/${followee.username}`}
                className="flex items-start justify-start w-full"
              >
                <Avatar className="mx-2">
                  <AvatarImage src={followee.avatar} alt="" />
                  <AvatarFallback>
                    {nameFallback(followee.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full h-full">
                  <h2 className="flex items-center justify-between w-full text-base font-semibold">
                    {followee.fullName}
                  </h2>
                  <p className="text-stone-500 text-sm">@{followee.username}</p>
                </div>
              </Link>
              <div className="flex items-center justify-center bg-primary-500 text-white rounded-full w-fit h-full my-auto">
                {followingsIds.includes(followee._id) ? (
                  <button
                    className="bg-stone-500 w-20 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-stone-600 disabled:bg-stone-400 ml-4"
                    onClick={() => handleUnfollow(followee._id)}
                    disabled={followee.loading}
                  >
                    {followee.loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Unfollow"
                    )}
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 w-16 h-7 text-center text-white rounded-full text-sm transition-colors hover:bg-blue-700 disabled:bg-blue-400 ml-4"
                    onClick={() => handleFollow(followee._id)}
                    disabled={followee.loading}
                  >
                    {followee.loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Follow"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] min-h-[28rem] w-full gap-6">
          <Users2 size="80" />
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="text-3xl tracking-tight font-bold">No Following</h1>
            <p className="text-stone-500">
              Start following people to see them here
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
