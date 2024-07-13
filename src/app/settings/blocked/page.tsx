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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameFallback } from "@/lib/helpers";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  const [blocked, setBlocked] = React.useState([
    {
      username: "johndoe",
      fullName: "John Doe",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      isBlocked: true,
      isLoading: false,
    },
    {
      username: "chloe",
      fullName: "Chloe Wilson",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      isBlocked: true,
      isLoading: false,
    },
    {
      username: "jane",
      fullName: "Jane Foster",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
      isBlocked: true,
      isLoading: false,
    },
  ]);
  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-4 my-2 flex items-center gap-4 ">
        <Link href="/settings" className="sm:hidden">
          <Button variant="ghost" size="icon" className="rounded-xl ml-4 hover:bg-background">
            <ArrowLeft />
          </Button>
        </Link>
        Blocked accounts
      </h1>
      <div className="sm:w-2/3 w-full max-sm:px-6 space-y-2 max-sm:mt-3">
        {blocked.length
          ? blocked.map((account, index) => (
              <div className="flex items-center gap-2" key={index}>
                <div className="flex items-center justify-start gap-3 w-full px-2 py-1.5 rounded-xl">
                  <Avatar>
                    <AvatarImage src={account.avatar} />
                    <AvatarFallback>
                      {nameFallback(account.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center">
                    <p>{account.fullName}</p>
                    <p className="text-stone-500 text-sm">
                      @{account.username}
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={account.isBlocked ? "secondary" : "default"}
                      className="rounded-xl"
                    >
                      {account.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <Avatar className="mx-auto w-20 h-20">
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback>
                            {nameFallback(account.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        {account.isBlocked ? "Unblock" : "Block"}&nbsp;
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {account.fullName}
                        </span>
                        &nbsp;&#183; @{account.username}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex w-full sm:flex-col-reverse sm:gap-2 sm:justify-center items-center sm:space-x-0">
                      <AlertDialogCancel autoFocus={false} className="w-full">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="w-full"
                        onClick={() =>
                          setBlocked([
                            ...blocked.map((item) =>
                              item.username === account.username
                                ? { ...item, isBlocked: !item.isBlocked }
                                : item
                            ),
                          ])
                        }
                      >
                        {account.isBlocked ? "Unblock" : "Block"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}

export default Page;
