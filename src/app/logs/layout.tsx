"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Phone,
  PhoneCall,
  Video,
} from "lucide-react";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setCall } from "@/lib/store/features/slices/callSlice";
import CallsLoading from "@/components/skeletons/CallsLoading";

function Layout({ children }: { children: ReactNode }) {
  const location = usePathname();
  const dispatch = useAppDispatch();
  const { skeletonLoading, calls } = useAppSelector((state) => state.call);

  return (
    <div className="grid h-[100dvh] sm:min-h-[42rem] max-sm:max-h-[100dvh] xl:col-span-8 pl-8 md:pl-4 max-sm:pl-0 sm:col-span-9 col-span-10 sm:grid-cols-10">
      <div
        className={`lg:col-span-3 md:col-span-4 col-span-10 md:flex flex-col items-start justify-start gap-2 py-6 h-full max-h-[100dvh] sm:min-h-[42rem] md:px-0 px-4 sticky top-0 ${
          location === "/logs" ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between w-full mb-4 pr-2">
          <h1 className="text-2xl tracking-tight font-bold text-left p-2.5">
            Calls
          </h1>
          <Dialog>
            <DialogTrigger className="py-2 px-4 mr-2" title="New Call">
              <PhoneCall />
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogTitle>Start a Call</DialogTitle>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="py-3 w-full h-full p-2.5 max-sm:hidden min-h-96">
          {skeletonLoading ? (
            <CallsLoading />
          ) : calls.length > 0 ? (
            calls.map((call, index) => (
              <Link
                className={`flex items-center justify-center rounded-md w-full gap-2 p-2 mb-1 ${
                  location === `/logs/${call._id}`
                    ? "bg-stone-200 dark:bg-stone-800 hover:bg-stone-100 hover:dark:bg-stone-900"
                    : "sm:hover:bg-stone-200 sm:dark:hover:bg-stone-800"
                }`}
                key={index}
                href={`/logs/${call._id}`}
                onClick={() => dispatch(setCall(call))}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={call.user.avatar}
                    alt=""
                    className="pointer-events-none select-none object-contain"
                  />
                  <AvatarFallback>
                    {nameFallback(call.user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full">
                  <p>{call.user.fullName}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
                    {call.type === "incoming" ? (
                      <>
                        <ArrowDownLeft size="16" />
                        Incoming Call
                      </>
                    ) : (
                      <>
                        <ArrowUpRight size="16" />
                        Outgoing Call
                      </>
                    )}
                  </div>
                </div>
                <div className="mr-2">
                  {call.kind === "audio" ? (
                    <Phone size="18" />
                  ) : (
                    <Video size="18" />
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-[80dvh]">
              <History size="60" />
              <div>
                <h2 className="text-2xl tracking-tight font-bold">
                  No Calls yet
                </h2>
                <p className="text-stone-500">Call your loved ones now!</p>
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="sm:hidden pb-16 w-full">
          {skeletonLoading ? (
            <CallsLoading />
          ) : calls.length > 0 ? (
            calls.map((call, index) => (
              <Link
                className={`flex items-center justify-center rounded-md w-full gap-2 p-2 ${
                  location === `/messages/${call._id}`
                    ? "bg-stone-200 dark:bg-stone-800 hover:bg-stone-100 hover:dark:bg-stone-900"
                    : "sm:hover:bg-stone-200 sm:dark:hover:bg-stone-800"
                }`}
                key={index}
                href={`/logs/${call._id}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={call.user.avatar}
                    alt=""
                    className="pointer-events-none select-none"
                  />
                  <AvatarFallback>
                    {nameFallback(call.user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full">
                  <p>{call.user.fullName}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
                    {call.type === "incoming" ? (
                      <>
                        <ArrowDownLeft size="16" />
                        Incoming Call
                      </>
                    ) : (
                      <>
                        <ArrowUpRight size="16" />
                        Outgoing Call
                      </>
                    )}
                  </div>
                </div>
                <div className="mr-2">
                  {call.kind === "audio" ? (
                    <Phone size="18" />
                  ) : (
                    <Video size="18" />
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-full">
              <History size="60" />
              <div>
                <h2 className="text-2xl tracking-tight font-bold">
                  No Chats yet
                </h2>
                <p className="text-stone-500">
                  Start a conversation with someone!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Layout;
