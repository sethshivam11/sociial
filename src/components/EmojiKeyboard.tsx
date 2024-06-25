import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { Button } from "./ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface Props {
  setMessage: (message: string) => void;
  message: string;
  react?: boolean;
}

function EmojiKeyboard({ setMessage, message, react }: Props) {
  const { theme } = useTheme();
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              {react ? (
                <Smile size="15" />
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  className={`px-2 rounded-xl`}
                >
                  <Smile />
                </Button>
              )}
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Emoji</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-fit p-0">
        <Picker
          data={data}
          theme={theme}
          onEmojiSelect={({ native }: { native: string }) =>
            react ? setMessage(native) : setMessage(message.concat(native))
          }
          previewPosition="none"
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiKeyboard;