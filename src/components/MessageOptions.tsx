import React from "react";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal } from "lucide-react";

function MessageOptions() {
  return (
    <Menubar className="w-full bg-transparent border-transparent xl:justify-start justify-center">
      <MenubarMenu>
        <MenubarTrigger className="px-1 rounded-lg">
          <MoreHorizontal size="15" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reply</MenubarItem>
          <MenubarItem>Copy Message</MenubarItem>
          <MenubarItem>Delete for everyone</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default MessageOptions;
