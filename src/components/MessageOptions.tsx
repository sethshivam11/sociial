import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MoreHorizontal, Smile } from "lucide-react";
import { toast } from "./ui/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface Props {
  username: string;
  setReply: (reply: { username: string; content: string }) => void;
  message: string;
  id: string;
  type: string;
  reactMessage: (emoji: string) => void;
}

function MessageOptions({
  message,
  id,
  reactMessage,
  type,
  username,
  setReply,
}: Props) {
  const { theme } = useTheme();
  function copyMessage(message: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      toast({
        title: "Copied",
        description: "The message has been copied to your clipboard.",
      });
    }
  }
  return (
    <>
      <Menubar className="bg-transparent border-transparent xl:justify-start justify-center w-fit p-0">
        <MenubarMenu>
          <MenubarTrigger className="px-1.5 rounded-lg">
            <Smile size="15" />
          </MenubarTrigger>
          <MenubarContent className="rounded-xl p-0">
            <MenubarItem className="p-0">
              <Picker
                data={data}
                navPosition="none"
                theme={theme}
                searchPosition="none"
                onEmojiSelect={({ native }: { native: string }) =>
                  reactMessage(native)
                }
                previewPosition="none"
              />
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Menubar className="bg-transparent border-transparent xl:justify-start justify-center w-fit p-0">
        <MenubarMenu>
          <MenubarTrigger className="px-1.5 rounded-lg">
            <MoreHorizontal size="15" />
          </MenubarTrigger>
          <MenubarContent className="rounded-xl">
            <MenubarItem
              className=" rounded-lg py-2.5"
              onClick={() =>
                setReply({
                  username,
                  content: message,
                })
              }
            >
              Reply
            </MenubarItem>
            <MenubarItem
              className=" rounded-lg py-2.5"
              onClick={() => copyMessage(message)}
            >
              Copy Message
            </MenubarItem>
            {type === "sent" ? (
              <MenubarItem className="text-red-600 focus:text-red-600 rounded-lg py-2.5">
                Unsend
              </MenubarItem>
            ) : (
              ""
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
}

export default MessageOptions;
