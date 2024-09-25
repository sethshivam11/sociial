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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { CircleX, History, Search as SearchIcon, X } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { searchUsers } from "@/lib/store/features/slices/userSlice";
import { useDebounceCallback } from "usehooks-ts";
import SearchLoading from "@/components/skeletons/SearchLoading";

interface Search {
  fullName: string;
  username: string;
  avatar: string;
}

function Search() {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { searchResults, skeletonLoading } = useAppSelector(
    (state) => state.user
  );
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const debounced = useDebounceCallback(setSearch, 500);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  function clearRecentSearches() {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }

  function appendRecentSearches(search: string) {
    recentSearches.length >= 10 ? recentSearches.pop() : recentSearches;
    if (recentSearches.includes(search)) return;
    setRecentSearches((recentSearches) => [search, ...recentSearches]);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify([search, ...recentSearches])
    );
  }

  React.useEffect(() => {
    dispatch(searchUsers(search)).then((response) => {
      if (
        !response.payload?.success &&
        response.payload?.message !== "No users found"
      ) {
        console.log(response.payload?.message);
      }
    });
  }, [search, dispatch]);

  React.useEffect(() => {
    const savedRecentSearches = localStorage.getItem("recentSearches");
    if (savedRecentSearches) {
      setRecentSearches(JSON.parse(savedRecentSearches));
    }
  }, [setRecentSearches]);

  return (
    <div className="container flex flex-col items-center justify-start min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 md:py-10 py-4">
      <div className="lg:w-1/2 md:w-3/5 sm:w-4/5 w-full ring-2 ring-stone-500 focus-within:dark:ring-stone-200 focus-within:ring-stone-800 rounded-lg px-2 py-0.5">
        <div className="w-full flex items-center justify-center rounded-lg space-y-0 gap-1">
          <SearchIcon />
          <Input
            className="w-full ring-0 border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
            defaultValue={search}
            ref={searchRef}
            onChange={(e) => debounced(e.target.value)}
            placeholder="Search"
            autoComplete="off"
            inputMode="search"
            name="search"
          />
          <button
            className={`${search ? "" : "hidden"}`}
            onClick={() => {
              setSearch("");
              if (searchRef.current) searchRef.current.value = "";
            }}
          >
            <CircleX />
          </button>
        </div>
      </div>
      <div
        className={`flex justify-between text-sm my-3 lg:w-1/2 md:w-3/5 sm:w-4/5 w-full px-2 ${
          search ? "hidden" : ""
        }`}
      >
        {recentSearches.length ? (
          <>
            <p className="text-stone-500">Recent Searches</p>
            <AlertDialog>
              <AlertDialogTrigger className="text-blue-500">
                Clear all
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Clear all recent searches?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This can&apos;t be undone and you&apos;ll remove all your
                    recent searches.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/80"
                    onClick={() => clearRecentSearches()}
                  >
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <span className="text-stone-500 text-center w-full">
            Try searching for people
          </span>
        )}
      </div>
      <div
        className={`flex flex-col justify-center items-center lg:w-1/2 md:w-3/5 sm:w-4/5 w-full px-2 py-4 gap-2 ${
          recentSearches.length ? "" : "h-full"
        } ${search ? "hidden" : ""}`}
      >
        {recentSearches.length ? (
          recentSearches.map((recentSearch, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full hover:bg-stone-200 hover:dark:bg-stone-900 py-2 px-1 rounded-md "
            >
              <SearchIcon className="ml-2 mr-3" />
              <button
                onClick={() => setSearch(recentSearch)}
                className="w-full text-start"
              >
                {recentSearch}
              </button>
              <button
                onClick={() =>
                  setRecentSearches(
                    recentSearches.filter(
                      (searchFound) => searchFound !== recentSearch
                    )
                  )
                }
                title="Remove"
              >
                <X />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <History size="80" />
            <div>
              <h2 className="text-2xl tracking-tight font-bold">
                Nothing here
              </h2>
              <p className="text-stone-500">Search for your loved ones</p>
            </div>
          </div>
        )}
      </div>
      {skeletonLoading ? (
        <SearchLoading />
      ) : (
        <div
          className={`flex flex-col justify-center items-center lg:w-1/2 md:w-3/5 sm:w-4/5 w-full py-6 px-2 ${
            searchResults.length ? "" : "h-full"
          } ${search ? "" : "hidden"}`}
        >
          {searchResults.length ? (
            searchResults.map((user, index) => (
              <button
                key={index}
                className="flex items-center justify-start gap-2 w-full hover:bg-stone-200 hover:dark:bg-stone-800 px-2 py-2 rounded-lg"
                onClick={() => {
                  router.push(`/${user.username}`);
                  appendRecentSearches(search);
                }}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={user.avatar}
                    alt=""
                    className="pointer-events-none select-none"
                  />
                  <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <h3>{user.fullName}</h3>
                  <p className="text-stone-500 text-xs">@{user.username}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <SearchIcon size="80" />
              <div>
                <h2 className="text-2xl tracking-tight font-bold">
                  Nothing found
                </h2>
                <p className="text-stone-500">Try something else</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
