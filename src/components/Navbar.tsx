"use client";
import {
  Bell,
  Home,
  Mail,
  Menu,
  Plus,
  Search,
  Tv,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
import { useTheme } from "next-themes";
import { nameFallback } from "@/lib/helpers";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

function Navbar() {
  const location = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [reportDialog, setReportDialog] = React.useState(false);
  const [iosDevice, setIosDevice] = React.useState(false);
  const [newPost, setNewPost] = React.useState<FileList | null>(null);
  const hideNav = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-code",
    "/story/",
    "/call",
  ];
  const [unreadMessageCount, newNotifications] = [0, false];
  const user = {
    fullName: "Shivam",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    username: "sethshivam11",
  };

  React.useEffect(() => {
    const ifIos =
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    if (ifIos) setIosDevice(true);
  }, []);

  return (
    <nav
      className={`xl:px-4 xl:py-6 p-3 sm:sticky fixed sm:top-0 left-0 sm:h-screen h-fit ${
        iosDevice ? "bottom-14" : "bottom-0"
      } xl:col-span-2 sm:col-span-1 col-span-10 sm:min-h-[42rem] max-h-[55rem] z-10 w-full min-w-max block 
      ${hideNav
        .map((path) => {
          if (location.includes(path) || location.startsWith(path))
            return "hidden";
          else return "";
        })
        .join("")} ${
        location.includes("/messages/") ||
        location.includes("/following") ||
        location.includes("/followers") ||
        location.includes("/notifications")
          ? "max-sm:hidden"
          : ""
      }`}
    >
      <div
        className={`sm:bg-stone-100 sm:dark:bg-stone-800 backdrop-blur-sm h-full w-full sm:rounded-3xl rounded-2xl xl:p-6 sm:px-2 sm:py-4 sm:w-fit xl:w-full flex flex-col items-center justify-between ${
          iosDevice
            ? "bg-stone-100/90 dark:bg-stone-800/90"
            : "bg-stone-100/50 dark:bg-stone-800/50"
        }`}
      >
        <Link href="/" className="sm:inline hidden w-full" title="Sociial">
          <div className="text-3xl tracking-tighter font-extrabold flex items-center md:justify-start md:pt-0 justify-center gap-2 w-full px-2">
            <Image
              src="/logo.svg"
              alt=""
              width="50"
              height="50"
              className="pointer-events-none select-none"
              priority={true}
            />

            <span className="xl:inline hidden">Sociial</span>
          </div>
        </Link>
        <div className="flex sm:flex-col flex-row w-full md:items-start items-center sm:justify-start justify-evenly p-2 text-lg gap-4 h-fit">
          <Link
            href="/"
            className={` md:w-full w-fit flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Home"
          >
            <Home className="inline group-hover:scale-110" />
            <span
              className={`xl:inline hidden ${
                location === "/" ? "font-semibold" : ""
              }`}
            >
              Home
            </span>
          </Link>
          <Link
            href="/search"
            className={`md:w-full w-fit flex items-center justify-start xl:pl-4 sm:p-3 p-2 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2 ${
              location === "/search"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Search"
          >
            <Search
              className="inline group-hover:scale-110"
              strokeWidth={location === "/search" ? "2.5" : "2"}
            />
            <span className="xl:inline hidden">Search</span>
          </Link>
          <Link
            href="/messages"
            className={`md:w-full w-fit sm:flex hidden items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location.includes("/messages")
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Messages"
          >
            <span className="inline-block relative">
              <Mail className="inline group-hover:scale-110" />
              {unreadMessageCount !== 0 && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500  rounded-full -top-2 -end-3 dark:border-gray-900">
                  {unreadMessageCount}
                </div>
              )}
            </span>
            <span
              className={`xl:inline hidden ${
                location === "/messages" ? "font-semibold" : ""
              }`}
            >
              Messages
            </span>
          </Link>
          <Link
            href="/new-post"
            className="bg-stone-800 dark:bg-stone-100 text-white dark:text-black md:w-full w-fit sm:hidden flex items-center justify-start xl:pl-4 px-2 py-2 gap-3 group rounded-full hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2"
            title="New post"
          >
            <Plus className="inline group-hover:scale-110" />
          </Link>
          <Link
            href="/videos"
            className={`md:w-full w-fit flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/videos"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Videos"
          >
            <Tv
              className="inline group-hover:scale-110"
              strokeWidth={location === "/videos" ? "2.5" : "2"}
            />
            <span className="xl:inline hidden">Videos</span>
          </Link>
          <Link
            href="/notifications"
            className={`md:w-full w-fit sm:flex hidden items-center justify-start xl:pl-4 sm:p-3 p-2 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2 ${
              location === "/notifications"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Notifications"
          >
            <span className="inline-block relative">
              <Bell
                className="inline group-hover:scale-110"
                strokeWidth={location === "/notifications" ? "2.5" : "2"}
              />
              {newNotifications && (
                <span className="absolute top-0 right-0 inline-block w-[10px] h-[10px] transform translate-x-1/5 translate-y-0.5 bg-red-600 rounded-full"></span>
              )}
            </span>
            <span className="xl:inline hidden">Notifications</span>
          </Link>
          <Link
            href={`/${user.username}`}
            className={`md:w-full w-fit flex items-center xl:justify-start justify-center xl:pl-4 sm:p-3 p-2 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location.includes("/profile")
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
            title="Profile"
          >
            <Avatar className="w-6 h-6 group-hover:scale-110">
              <AvatarImage
                src={user.avatar}
                loading="eager"
                alt=""
                className="pointer-events-none select-none"
              />
              <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
            </Avatar>
            <span
              className={`xl:inline hidden ${
                location.includes("/profile") ? "font-semibold" : ""
              }`}
            >
              Profile
            </span>
          </Link>
        </div>
        <div className="w-full text-center sm:flex hidden flex-col xl:items-start items-center gap-4 sm:p-1">
          <Dialog>
            <DialogTrigger
              className="bg-stone-800 dark:bg-stone-100 text-white dark:text-black xl:w-full w-fit flex items-center xl:justify-start xl:pl-4 sm:p-3 p-2 gap-3 rounded-2xl ring-stone-800 dark:hover:ring-stone-100 hover:ring-2"
              title="New post"
            >
              <span className="text-center w-full xl:inline hidden">
                Create
              </span>
              <Plus className="xl:hidden inline" />
            </DialogTrigger>
            <DialogContent
              className="h-3/4 flex flex-col items-center justify-start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <h1 className="text-2xl h-fit tracking-tight text-bold text-center">
                Create new post
              </h1>
              <hr className="w-full" />
              <div
                className="h-full w-full flex flex-col items-center justify-center"
                ref={dialogRef}
                onDrop={() => dialogRef.current?.focus()}
                onDragEnter={() =>
                  dialogRef.current?.classList.add(
                    "ring-2",
                    "ring-stone-200",
                    "dark:ring-stone-800"
                  )
                }
                onDragLeave={() =>
                  dialogRef.current?.classList.remove(
                    "ring-2",
                    "ring-stone-200",
                    "dark:ring-stone-800"
                  )
                }
                onDragOver={(e) => e.preventDefault()}
              >
                {newPost ? (
                  <canvas></canvas>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <ImageIcon size="80" />
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-stone-500 text-sm">
                        Drag and Drop Photos and Images here
                      </span>
                      <Button className="w-fit h-fit p-0 rounded-lg">
                        <Label
                          htmlFor="new-post"
                          className="w-full text-center text-semibold text-lg cursor-pointer px-3 py-2 rounded-xl"
                        >
                          Select files
                        </Label>
                      </Button>
                      <Input
                        type="file"
                        id="new-post"
                        accept="image/*,video/*"
                        onChange={(e) => setNewPost(e.target.files)}
                        className="placeholder:text-black file:text-background text-background w-0 h-0 p-0 border-0"
                        multiple
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
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
              <MenubarContent className="rounded-xl">
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger className="py-2.5 rounded-lg pl-2.5">
                    Theme
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5"
                      onClick={() => setTheme("system")}
                    >
                      System
                    </MenubarItem>
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5"
                      onClick={() => setTheme("light")}
                    >
                      Light
                    </MenubarItem>
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5"
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem
                  className="py-2.5 rounded-lg pl-2.5 text-red-600 focus:text-red-600"
                  onClick={() => setReportDialog(true)}
                >
                  Report problem
                </MenubarItem>
                <MenubarItem className="py-2.5 rounded-lg pl-2.5 text-red-600 focus:text-red-600">
                  Log Out
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Dialog open={reportDialog}>
            <DialogContent
              className="sm:w-2/3 w-full h-fit flex flex-col bg-stone-100 dark:bg-stone-900"
              hideCloseIcon
            >
              <DialogTitle className="text-center text-2xl my-1">
                Report Post
              </DialogTitle>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Title</Label>
                  <Input
                    id="report-title"
                    placeholder="Title for the issue"
                    className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-description">Description</Label>
                  <Textarea
                    id="report-description"
                    placeholder="Detailed description of the issue"
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-file">
                    Image
                    <span className="text-stone-500 text-sm">
                      &nbsp;(Optional)
                    </span>
                  </Label>
                  <Input
                    type="file"
                    id="report-file"
                    accept="image/*"
                    className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1 ring-stone-200"
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => console.log(user.username)}
                >
                  Report
                </Button>
                <DialogClose onClick={() => setReportDialog(false)}>
                  Cancel
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
