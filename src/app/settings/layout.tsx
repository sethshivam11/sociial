"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  clearCookies,
  logOutUser,
} from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  Ban,
  Bell,
  ChevronLeft,
  KeySquare,
  Loader2,
  LogOut,
  Palette,
  Shield,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useState, useEffect } from "react";

function Page({ children }: PropsWithChildren) {
  const location = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  function handleLogOut() {
    dispatch(logOutUser())
      .then((response) => {
        if (response.payload?.success) {
          router.push("/sign-in");
        } else {
          dispatch(clearCookies()).then(() => router.push("/sign-in"));
        }
      })
      .finally(() => setOpen(false));
  }

  useEffect(() => {
    const checkScreenWidthAndRedirect = () => {
      const screenWidth = window.innerWidth;
      const targetWidth = 768;

      if (screenWidth > targetWidth) {
        router.push("/settings/edit-profile");
      }
    };

    if (location === "/settings") {
      checkScreenWidthAndRedirect();
    }
  }, [router, location]);

  return (
    <div className="md:container flex items-start justify-start xl:col-span-8 sm:col-span-9 col-span-10 sm:py-6">
      <div
        className={`lg:w-1/4 md:w-1/3 max-md:ml-6 max-sm:ml-0 w-full max-h-[100dvh] sticky top-0 ${
          location === "/settings" ? "block" : "max-md:hidden"
        }`}
      >
        <div className="sm:text-3xl text-xl tracking-tighter font-bold text-center w-full sm:py-6 py-2 flex items-center">
          <Link className="sm:hidden ml-2 p-2" href={`/${user.username}`}>
            <ChevronLeft />
          </Link>
          <h1 className="w-full max-sm:pr-14">Settings</h1>
        </div>
        <hr className="w-full bg-stone-500 mb-4" />
        <div className="flex flex-col sm:px-1 px-4 overflow-y-auto gap-2">
          <Link
            href="/settings/edit-profile"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/edit-profile"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <UserCircle2 size="30" strokeWidth="1.5" /> Edit Profile
          </Link>
          <Link
            href="/settings/notifications"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/notifications"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Bell size="30" strokeWidth="1.5" /> Notifications
          </Link>
          <Link
            href="/settings/blocked"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/blocked"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Ban size="30" strokeWidth="1.5" /> Blocked
          </Link>
          <Link
            href="/settings/security"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/security"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <KeySquare size="30" strokeWidth="1.5" /> Security
          </Link>
          <Link
            href="/settings/theme"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/theme"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Palette size="30" strokeWidth="1.5" /> Theme
          </Link>
          <Link
            href="/settings/help"
            className={`flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg ${
              location === "/settings/help"
                ? "bg-stone-100 dark:bg-stone-900"
                : ""
            }`}
          >
            <Shield size="30" strokeWidth="1.5" /> Help
          </Link>
          <button
            onClick={() => setOpen(true)}
            className={`sm:hidden flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg`}
          >
            <LogOut size="30" strokeWidth="1.5" /> Log Out
          </button>
        </div>
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogTitle className="w-full text-center text-2xl tracking-tight font-bold">
            Log Out
          </AlertDialogTitle>
          <p>
            You can always log back in at any time. Are you sure you want to Log
            Out?
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => {
                if (!loading) setOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="text-white bg-destructive hover:bg-destructive/80"
              disabled={loading}
              onClick={handleLogOut}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        className={`h-full md:max-h-full md:border-l-2 border-stone-200 dark:border-stone-800 ${
          location === "/settings" ? "lg:w-3/4 w-0" : "lg:w-3/4 w-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Page;

{
  /* <Link
            href={user.isPremium ? "/settings/premium" : "/get-premium"}
            className="flex items-center justify-start gap-2 py-2 px-3 hover:bg-stone-200 hover:dark:bg-stone-800 rounded-lg"
          >
            <BadgeCheck size="30" strokeWidth="1.5" /> Premium
          </Link> */
}
