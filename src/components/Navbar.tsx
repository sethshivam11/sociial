"use client";
import {
  Bell,
  CircleFadingPlusIcon,
  Grid2X2,
  Home,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Moon,
  Palette,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Tv,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTheme } from "next-themes";
import { nameFallback } from "@/lib/helpers";
import {
  clearCookies,
  getLoggedInUser,
  logOutUser,
} from "@/lib/store/features/slices/userSlice";
import { toast } from "./ui/use-toast";
import ReportDialog from "./ReportDialog";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Lobster_Two } from "next/font/google";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function Navbar() {
  const location = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [reportDialog, setReportDialog] = useState(false);
  const [logOutDialog, setLogOutDialog] = useState(false);
  const hideNav = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-code",
    "/story",
    "/stories",
    "/get-premium",
    "/call",
    "/new-post",
    "/upload-video",
    "/add-story",
  ];
  const [unreadMessageCount, newNotifications] = [0, false];
  const { user, isLoggedIn, loading } = useAppSelector((state) => state.user);

  function handleLogout() {
    dispatch(logOutUser())
      .then(({ payload }) => {
        if (payload?.success || payload?.message === "Token is required") {
          if (document && "cookie" in window) document.cookie = "";
          router.push("/sign-in");
        } else {
          dispatch(clearCookies()).then(() => router.push("/sign-in"));
        }
      })
      .catch((err) => {
        if (!navigator.onLine) {
          toast({
            title: "No internet connection",
            description: "Looks like you have slow or no internet connection",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: err.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setLogOutDialog(false);
      });
  }

  useEffect(() => {
    if (!document.cookie) {
      const token = localStorage.getItem("token");
      if (token) {
        document.cookie = `token=${token};`;
      } else if (!token) {
        router.push("/sign-in");
      }
    }

    dispatch(getLoggedInUser())
      .then((response) => {
        if (response.payload?.success && location === "/sign-in") {
          router.push("/");
        } else if (
          response.payload?.statusCode === 401 &&
          location !== "/sign-in"
        ) {
          dispatch(clearCookies()).then(() => router.push("/sign-in"));
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router]);

  return (
    <nav
      className={`xl:px-4 xl:py-6 p-3 sm:sticky fixed sm:top-0 sm:left-0 sm:h-screen h-fit max-sm:bottom-0 xl:col-span-2 sm:col-span-1 col-span-10 sm:min-h-[42rem] max-h-[55rem] z-10 w-full min-w-max block 
      ${hideNav
        .map((path) => {
          if (location.includes(path) || location.startsWith(path))
            return "hidden";
        })
        .join("")} ${
        location.includes("/messages/") ||
        location.includes("/following") ||
        location.includes("/followers") ||
        location.includes("/video") ||
        location === "/notifications"
          ? "max-sm:hidden"
          : ""
      }`}
    >
      <div className="sm:bg-stone-100 sm:dark:bg-stone-900 min-h-14 bg-stone-100/50 dark:bg-stone-900/50 backdrop-blur-sm blur-bg h-full w-full sm:rounded-3xl rounded-2xl xl:p-6 sm:px-2 sm:py-4 sm:w-fit xl:w-full flex flex-col items-center justify-between">
        <Link href="/" className="sm:inline hidden w-full" title="Sociial">
          <div className="text-4xl tracking-tighter font-extrabold flex items-center md:pt-0 max-xl:justify-center gap-2 w-full px-2">
            <Image
              src="/logo.svg"
              alt=""
              width="50"
              height="50"
              className="pointer-events-none select-none"
              priority={true}
            />
            <span className={`xl:inline hidden ${lobster.className}`}>
              Sociial
            </span>
          </div>
        </Link>
        <div className="flex sm:flex-col flex-row w-full md:items-start items-center sm:justify-start justify-evenly p-2 text-lg gap-4 h-fit">
          <Link
            href="/"
            className={` md:w-full w-fit flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/"
                ? "sm:bg-stone-200 sm:dark:bg-stone-800 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Home"
          >
            <Home className="inline" />
            <span className="xl:inline hidden">Home</span>
          </Link>
          <Link
            href="/search"
            className={`md:w-full w-fit flex items-center justify-start xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2 ${
              location === "/search"
                ? "sm:bg-stone-200 sm:dark:bg-stone-800 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Search"
          >
            <Search className="inline" />
            <span className="xl:inline hidden">Search</span>
          </Link>
          <Link
            href="/messages"
            className={`md:w-full w-fit sm:flex hidden items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location.includes("/messages")
                ? "sm:bg-stone-200 sm:dark:bg-stone-800 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Messages"
          >
            <span className="inline-block relative">
              <Mail className="inline" />
              {unreadMessageCount !== 0 && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500  rounded-full -top-2 -end-3 dark:border-gray-900">
                  {unreadMessageCount}
                </div>
              )}
            </span>
            <span className="xl:inline hidden">Messages</span>
          </Link>
          <Menubar className="w-fit sm:hidden bg-transparent border-transparent xl:justify-start justify-center">
            <MenubarMenu>
              <MenubarTrigger
                className="bg-tranparent w-fit flex items-center justify-center sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-900 bg-stone-800 dark:bg-stone-100 text-white dark:text-black"
                title="Create"
              >
                <Plus />
              </MenubarTrigger>
              <MenubarContent className="rounded-xl" align="center">
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/new-post")}
                >
                  <Grid2X2 />
                  &nbsp;&nbsp;Post
                </MenubarItem>
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/upload-video")}
                >
                  <Tv />
                  &nbsp;&nbsp;Video
                </MenubarItem>
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/add-story")}
                >
                  <CircleFadingPlusIcon />
                  &nbsp;&nbsp; Story
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Link
            href="/videos"
            className={`md:w-full w-fit flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/videos"
                ? "sm:bg-stone-200 sm:dark:bg-stone-800 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Videos"
          >
            <Tv className="inline" />
            <span className="xl:inline hidden">Videos</span>
          </Link>
          <Link
            href="/notifications"
            className={`md:w-full w-fit sm:flex hidden items-center justify-start xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2 ${
              location === "/notifications"
                ? "sm:bg-stone-200 sm:dark:bg-stone-800 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Notifications"
          >
            <span className="inline-block relative">
              <Bell className="inline" />
              {newNotifications && (
                <span className="absolute top-0 right-0 inline-block w-[10px] h-[10px] transform translate-x-1/5 translate-y-0.5 bg-red-600 rounded-full"></span>
              )}
            </span>
            <span className="xl:inline hidden">Notifications</span>
          </Link>
          <Link
            href={user.username ? `/${user.username}` : "/sign-in"}
            className={`md:w-full w-fit flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === `/${user.username}` && isLoggedIn
                ? "sm:bg-stone-200 sm:dark:bg-stone-800 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Profile"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={
                  isLoggedIn
                    ? user.avatar
                    : "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png"
                }
                loading="eager"
                alt=""
                className="pointer-events-none select-none"
              />
              <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
            </Avatar>
            <span className="xl:inline hidden">Profile</span>
          </Link>
        </div>
        <div className="w-full text-center sm:flex hidden flex-col xl:items-start items-center gap-4 sm:p-1">
          <Menubar className="w-full bg-transparent border-transparent xl:justify-start justify-center">
            <MenubarMenu>
              <MenubarTrigger
                className="bg-tranparent xl:w-full w-fit ring-2 flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-900  bg-stone-800 dark:bg-stone-100 text-white dark:text-black ring-stone-800 dark:hover:ring-stone-100 hover:ring-2"
                title="Create"
              >
                <span className="text-center w-full xl:inline hidden">
                  Create
                </span>
                <Plus className="xl:hidden inline" />
              </MenubarTrigger>
              <MenubarContent className="rounded-xl" align="center">
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/new-post")}
                >
                  <Grid2X2 />
                  &nbsp;&nbsp;Post
                </MenubarItem>
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/upload-video")}
                >
                  <Tv />
                  &nbsp;&nbsp;Video
                </MenubarItem>
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/add-story")}
                >
                  <CircleFadingPlusIcon />
                  &nbsp;&nbsp; Story
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Menubar className="w-full bg-transparent border-transparent xl:justify-start justify-center">
            <MenubarMenu>
              <MenubarTrigger
                className="bg-tranparent xl:w-full w-fit ring-2 ring-stone-500 flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl hover:ring-stone-900 dark:hover:ring-stone-200"
                title="More"
              >
                <span className="text-center w-full xl:inline hidden">
                  More
                </span>
                <Menu className="xl:hidden inline" />
              </MenubarTrigger>
              <MenubarContent className="rounded-xl" align="center">
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/settings")}
                >
                  <Settings />
                  &nbsp;&nbsp;Settings
                </MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger className="py-2.5 rounded-lg pl-2.5">
                    {theme === "dark" && <Moon />}
                    {theme === "light" && <Sun />}
                    {theme === "system" && <Palette />}
                    &nbsp;&nbsp;Theme
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5"
                      onClick={() => setTheme("system")}
                    >
                      <Palette />
                      &nbsp;&nbsp;System
                    </MenubarItem>
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5"
                      onClick={() => setTheme("light")}
                    >
                      <Sun />
                      &nbsp;&nbsp;Light
                    </MenubarItem>
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon />
                      &nbsp;&nbsp;Dark
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5 text-red-600 focus:text-red-600"
                  onClick={() => setReportDialog(true)}
                >
                  <ShieldAlert />
                  &nbsp;&nbsp;Report problem
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5 text-red-600 focus:text-red-600"
                  onClick={() => setLogOutDialog(true)}
                >
                  <LogOut />
                  &nbsp;&nbsp;Log Out
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <ReportDialog
            open={reportDialog}
            setOpen={setReportDialog}
            type="problem"
          />
          <AlertDialog open={logOutDialog}>
            <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <AlertDialogTitle className="w-full text-center text-2xl tracking-tight font-bold">
                Log Out
              </AlertDialogTitle>
              <p className="dark:text-stone-400">
                You can always log back in at any time. Are you sure you want to
                Log Out?
              </p>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={loading}
                  onClick={() => {
                    if (!loading) setLogOutDialog(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-destructive text-white sm:hover:bg-destructive/80 min-w-20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
