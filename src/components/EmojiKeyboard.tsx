import React from "react";
import { Smile } from "lucide-react";
import { Button } from "./ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";

interface Props {
  setMessage: (message: string) => void;
  message: string;
}

function EmojiKeyboard({ setMessage, message }: Props) {
  const { theme } = useTheme();
  return (
    <Menubar className="p-0 border-transparent bg-transparent">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button size="icon" variant="ghost" title="Emoji" className={`px-2 rounded-xl`}>
            <Smile />
          </Button>
        </MenubarTrigger>
        <MenubarContent className="w-fit p-0 z-50">
          <Picker
            data={data}
            theme={theme}
            navPosition="bottom"
            onEmojiSelect={({ native }: { native: string }) =>
              setMessage(message.concat(native))
            }
            previewPosition="none"
          />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default EmojiKeyboard;
