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
  Video,
} from "lucide-react";
import { ReactNode, useEffect, useMemo } from "react";
import { getCalls, setCall } from "@/lib/store/features/slices/callSlice";
import CallsLoading from "@/components/skeletons/CallsLoading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CallI } from "@/types/types";

const CallItem = ({
  call,
  userId,
  isCurrent = false,
  onClick,
}: {
  call: CallI;
  userId: string;
  isCurrent?: boolean;
  onClick: () => void;
}) => {
  const isOutgoing = useMemo(() => {
    if (call.caller._id === userId) return true;
    else return false;
  }, [call, userId]);

  const otherUser = useMemo(() => {
    if (call.caller._id === userId) return call.callee;
    else return call.caller;
  }, [call, userId]);

  return (
    <Link
      className={`flex items-center justify-center rounded-md w-full gap-2 p-2 mb-1 ${
        isCurrent
          ? "bg-stone-200 dark:bg-stone-800 hover:bg-stone-100 hover:dark:bg-stone-900"
          : "sm:hover:bg-stone-200 sm:dark:hover:bg-stone-800"
      }`}
      href={`/logs/${call._id}`}
      onClick={onClick}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={otherUser?.avatar}
          alt=""
          className="pointer-events-none select-none object-contain"
        />
        <AvatarFallback>{nameFallback(otherUser?.fullName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start justify-center w-full">
        <p>{otherUser?.fullName}</p>
        <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
          {isOutgoing ? (
            <>
              <ArrowUpRight size="16" />
              Outgoing Call
            </>
          ) : (
            <>
              <ArrowDownLeft size="16" />
              Incoming Call
            </>
          )}
        </div>
      </div>
      <div className="mr-2">
        {call.type === "audio" ? <Phone size="18" /> : <Video size="18" />}
      </div>
    </Link>
  );
};

function Layout({ children }: { children: ReactNode }) {
  const location = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { skeletonLoading, calls } = useAppSelector((state) => state.call);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCalls());
  }, [dispatch]);

  return (
    <div className="grid h-[100dvh] sm:min-h-[42rem] max-sm:max-h-[100dvh] xl:col-span-8 pl-8 md:pl-4 max-sm:pl-0 sm:col-span-9 col-span-10 sm:grid-cols-10">
      <div
        className={`lg:col-span-3 md:col-span-4 col-span-10 md:flex flex-col items-start justify-start gap-2 py-6 h-full max-h-[100dvh] sm:min-h-[42rem] md:px-0 px-4 sticky top-0 ${
          location === "/logs" ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between w-full mb-4 pr-2">
          <Select
            defaultValue="logs"
            onValueChange={(value) => {
              if (value !== "logs") {
                router.push(`/${value}`);
              }
            }}
          >
            <SelectTrigger className="text-2xl tracking-tight font-bold text-left p-2.5 pl-0 border-0 w-fit gap-2 focus:ring-0 shadow-none min-w-40">
              <SelectValue placeholder="Calls" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="messages" className="px-3 py-2">
                Conversations
              </SelectItem>
              <SelectItem value="confessions" className="px-3 py-2">
                Confessions
              </SelectItem>
              <SelectItem value="logs" className="px-3 py-2">
                Calls
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="py-3 w-full h-full p-2.5 max-sm:hidden min-h-96">
          {skeletonLoading ? (
            <CallsLoading />
          ) : calls.length > 0 ? (
            calls.map((call, index) => {
              return (
                <CallItem
                  call={call}
                  userId={user._id}
                  isCurrent={location.includes(`/logs/${call._id}`)}
                  onClick={() => dispatch(setCall(call._id))}
                  key={index}
                />
              );
            })
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
              <CallItem
                  call={call}
                  userId={user._id}
                  isCurrent={location.includes(`/logs/${call._id}`)}
                  onClick={() => dispatch(setCall(call._id))}
                  key={index}
                />
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-full">
              <History size="60" />
              <div>
                <h2 className="text-2xl tracking-tight font-bold">
                  No Calls yet
                </h2>
                <p className="text-stone-500">Start a call with someone!</p>
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
