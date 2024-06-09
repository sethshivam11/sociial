import { MoreHorizontal } from "lucide-react";
import React from "react";
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

function More() {
  return (
    <Menubar className="w-fit border-transparent bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="w-fit">
          <MoreHorizontal className="" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem className="text-red-500 focus:text-red-500">Report</MenubarItem>
          <MenubarItem className="text-red-500 focus:text-red-500">Unfollow</MenubarItem>
          <MenubarItem>Copy link</MenubarItem>
          <MenubarItem>Open post</MenubarItem>
          <MenubarItem>Go to Account</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default More;
