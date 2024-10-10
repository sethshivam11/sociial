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
import {
  reactMessage,
  unsendMessage,
} from "@/lib/store/features/slices/messageSlice";
import { useAppDispatch } from "@/lib/store/store";

interface Props {
  messageId: string;
  username: string;
  setReply: (reply: {
    username: string;
    kind: string;
    content: string;
  }) => void;
  message: string;
  type: string;
  kind: string;
  createdAt: string;
}

function MessageOptions({
  messageId,
  message,
  type,
  username,
  kind,
  createdAt,
  setReply,
}: Props) {
  const dispatch = useAppDispatch();
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

  function handleReact(content: string) {
    dispatch(reactMessage({ messageId, content })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot react to message",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  function handleUnsend() {
    dispatch(unsendMessage(messageId)).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot unsend message",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
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
                  handleReact(native)
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
            <div className="text-stone-500 text-sm px-2 py-1">
              {new Date(createdAt).toLocaleString("en-IN")}
            </div>
            <hr className="w-full text-stone-500" />
            <MenubarItem
              className=" rounded-lg py-2.5"
              onClick={() =>
                setReply({
                  username,
                  kind,
                  content: message,
                })
              }
            >
              Reply
            </MenubarItem>
            {kind === "message" && (
              <MenubarItem
                className=" rounded-lg py-2.5"
                onClick={() => copyMessage(message)}
              >
                Copy Message
              </MenubarItem>
            )}
            {type === "sent" && (
              <MenubarItem
                className="text-red-600 focus:text-red-600 rounded-lg py-2.5"
                onClick={handleUnsend}
              >
                Unsend
              </MenubarItem>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
}

export default MessageOptions;
