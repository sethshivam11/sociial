"use client";
import { Bell, Home, Mail, Menu, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
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

function Navbar() {
  const location = usePathname();
  const { setTheme } = useTheme();

  return (
    <div
      className={`md:px-4 md:py-6 p-3 sm:sticky fixed sm:top-0 left-0 sm:h-screen h-fit bottom-0 xl:col-span-2 md:col-span-3 sm:col-span-2 col-span-10 sm:min-h-[35rem] z-10 w-full min-w-max 
      ${location === "/sign-up" ? "hidden" : ""} 
      ${location === "/sign-in" ? "hidden" : ""}`}
    >
      <div className="bg-stone-200/60 dark:bg-stone-800/60 backdrop-blur-sm h-full w-full sm:rounded-3xl rounded-2xl md:p-6 flex flex-col items-center justify-between">
        <Link href="/" className="sm:inline hidden w-full">
          <div className="text-3xl tracking-tighter font-extrabold flex items-center md:justify-start md:pt-0 pt-6 justify-center gap-2 w-full px-2">
            <Image src="/logo.svg" alt="" width={50} height={50} />
            <span className="md:inline hidden">Sociial</span>
          </div>
        </Link>
        <div className="flex sm:flex-col flex-row w-full md:items-start items-center sm:justify-start justify-evenly p-2 text-lg gap-4 h-3/5">
          <Link
            href="/"
            className={` md:w-full w-fit flex items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
          >
            <Home className="inline group-hover:scale-110" />
            <span
              className={`md:inline hidden ${
                location === "/" ? "font-semibold" : ""
              }`}
            >
              Home
            </span>
          </Link>

          <Link
            href="/messages"
            className={`md:w-full w-fit sm:flex hidden items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/messages"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
          >
            <Mail className="inline group-hover:scale-110" />
            <span
              className={`md:inline hidden ${
                location === "/messages" ? "font-semibold" : ""
              }`}
            >
              Messages
            </span>
          </Link>

          <Link
            href="/search"
            className="sm:bg-stone-300 dark:sm:bg-stone-900 md:w-full w-fit flex items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2 sm:hidden"
          >
            <Search
              className="inline group-hover:scale-110"
              strokeWidth={location === "/search" ? "2.5" : "2"}
            />
          </Link>
          <Link
            href="/new-post"
            className="bg-stone-800 dark:bg-stone-100 text-white dark:text-black md:w-full w-fit sm:hidden flex items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-full hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2"
          >
            <Plus className="inline group-hover:scale-110" />
          </Link>
          <Link
            href="/notifications"
            className="sm:bg-stone-300 dark:sm:bg-stone-900 md:w-full w-fit flex sm:hidden items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2"
          >
            <Bell
              className="inline group-hover:scale-110"
              strokeWidth={location === "/notifications" ? "2.5" : "2"}
            />
          </Link>

          <button className="md:w-full w-fit sm:flex hidden items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 sm:hover:ring-2">
            <Bell className="inline group-hover:scale-110" />
            <span className="md:inline hidden">Notifications</span>
          </button>

          <Link
            href="/profile"
            className={`md:w-full w-fit flex items-center justify-start md:pl-4 px-3 py-3 gap-3 group rounded-2xl hover:ring-stone-600 dark:hover:ring-stone-400 transition-colors ${
              location === "/profile"
                ? "sm:bg-stone-300 sm:dark:bg-stone-700 sm:hover:ring-0"
                : "sm:hover:ring-2"
            }`}
          >
            <Avatar className="w-6 h-6 group-hover:scale-110">
              <AvatarImage
                src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png"
                alt=""
              />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <span
              className={`md:inline hidden ${
                location === "/profile" ? "font-semibold" : ""
              }`}
            >
              Profile
            </span>
          </Link>
        </div>
        <div className="w-full text-center sm:flex hidden flex-col md:items-start items-center gap-4 md:p-0 p-3">
          <button className="bg-stone-800 dark:bg-stone-100 text-white dark:text-black md:w-full w-fit flex items-center justify-start md:pl-4 px-3 py-3 gap-3 rounded-2xl ring-stone-800 dark:hover:ring-stone-100 hover:ring-2 ">
            <span className="text-center w-full md:inline hidden">Create</span>
            <Plus className="md:hidden inline" />
          </button>
          <Menubar className="w-full bg-transparent border-transparent md:justify-start justify-center">
            <MenubarMenu>
              <MenubarTrigger className="bg-tranparent md:w-full w-fit ring-2 ring-stone-500 flex items-center md:justify-start justify-center  md:pl-4 px-3 py-3 gap-3 rounded-2xl hover:ring-stone-900 dark:hover:ring-stone-200">
                <span className="text-center w-full md:inline hidden">
                  More
                </span>
                <Menu className="md:hidden inline" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Settings</MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger>Theme</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem onClick={() => setTheme("system")}>
                      System
                    </MenubarItem>
                    <MenubarItem onClick={() => setTheme("light")}>
                      Light
                    </MenubarItem>
                    <MenubarItem onClick={() => setTheme("dark")}>
                      Dark
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>Log Out</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
