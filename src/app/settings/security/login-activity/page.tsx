"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { getTimeDifference } from "@/lib/helpers";
import {
  getSessions,
  logOutAllDevices,
  removeSession,
} from "@/lib/store/features/slices/userSlice";
import { useAppDispatch } from "@/lib/store/store";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface Session {
  _id: string;
  token: string;
  device: string;
  createdAt: string;
  lastActivity: string;
}

function Page() {
  const dispatch = useAppDispatch();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState("");
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logOutDialog, setLogOutDialog] = useState(false);

  function handleRemoveSession(sessionId: string) {
    dispatch(removeSession(sessionId)).then((response) => {
      if (response.payload?.success) {
        setSessions(sessions.filter((session) => session._id !== sessionId));
        toast({
          title: "Logged out from the device",
        });
      } else {
        toast({
          title: "Failed to log out",
          description: response.payload?.message || "Please try again later",
          variant: "destructive",
        });
      }
    });
  }
  function handleLogOutAllDevices() {
    setLoading(true);
    dispatch(logOutAllDevices())
      .then((response) => {
        if (response.payload?.success) {
          setSessions(response.payload.data);
          toast({
            title: "Logged out from all devices",
          });
        } else {
          toast({
            title: "Failed to log out",
            description: response.payload?.message || "Please try again later",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setLogOutDialog(false);
        setLoading(false);
      });
  }

  useEffect(() => {
    setSkeletonLoading(true);
    dispatch(getSessions())
      .then((response) => {
        if (response.payload?.success) {
          setSessions(response.payload.data);
        }
      })
      .finally(() => setSkeletonLoading(false));
    const token = localStorage.getItem("token");
    setCurrentSession(token || "");
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="sm:w-2/3 text-lg tracking-tight font-semibold w-full text-left my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings/security">
          <ChevronLeft />
        </Link>
        Where you&apos;re logged in
      </h1>
      <div className="sm:w-2/3 w-3/4 space-y-5 mt-3">
        <p className="text-stone-500">
          You&apos;re logged in on these devices:
        </p>
        <ul className="flex flex-col gap-2 items-center">
          {skeletonLoading ? (
            <Skeleton className="w-full h-24" />
          ) : (
            sessions.map((session, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 ring-1 rounded-xl ring-stone-200 dark:ring-stone-800 w-full"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{session.device}</span>
                  <span className="font-light text-sm">Delhi, India</span>
                  <span
                    className={`${
                      session.token === currentSession
                        ? "text-green-500"
                        : "text-stone-500"
                    } text-sm font-light`}
                  >
                    {session.token === currentSession
                      ? "This device"
                      : getTimeDifference(session.lastActivity)}
                  </span>
                </div>
                {session.token !== currentSession && (
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-600"
                    onClick={() => handleRemoveSession(session._id)}
                  >
                    Log out
                  </Button>
                )}
              </li>
            ))
          )}
          {skeletonLoading ? (
            <Skeleton className="w-full h-10" />
          ) : (
            sessions.length > 1 && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setLogOutDialog(true)}
              >
                Log out of all devices
              </Button>
            )
          )}
        </ul>
      </div>
      <AlertDialog open={logOutDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Log out of all devices</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out of all devices? You will be logged
            out from all devices except this one.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (!loading) setLogOutDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogOutAllDevices}
              disabled={loading}
              className="text-white bg-destructive hover:bg-destructive/80"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Page;
