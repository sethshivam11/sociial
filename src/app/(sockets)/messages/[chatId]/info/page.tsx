"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Check,
  Loader2,
  MoreHorizontal,
  MoreVertical,
  Palette,
  SquarePen,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback, themes } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReportDialog from "@/components/ReportDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { Checkbox } from "@/components/ui/checkbox";
import FollowersLoadingSkeleton from "@/components/skeletons/FollowersLoading";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  deleteGroupChat,
  getChats,
  leaveGroupChat,
  makeAdmin,
  removeAdmin,
  removeParticipants,
  setCurrentChat,
} from "@/lib/store/features/slices/chatSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { blockUser } from "@/lib/store/features/slices/userSlice";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Theme {
  name: string;
  color: string;
  text: string;
}

function Info({ params }: { params: { chatId: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { chatId } = params;
  const { skeletonLoading, followers } = useAppSelector(
    (state) => state.follow
  );
  const { chat, chats, loading } = useAppSelector((state) => state.chat);
  const { user: currentUser, loading: userLoading } = useAppSelector(
    (state) => state.user
  );
  
  const [participants, setParticipants] = useState<typeof followers>([]);
  const [reportDialog, setReportDialog] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [removeDialog, setRemoveDialog] = useState({
    open: false,
    username: "",
    userId: "",
  });

  function handleMakeAdmin(userId: string) {
    dispatch(makeAdmin({ chatId, userId })).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "User is now an admin",
        });
      } else {
        toast({
          title: "Cannot make user an admin",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  function handleRemoveAdmin(userId: string) {
    dispatch(removeAdmin({ chatId, userId })).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "User is not an admin now",
        });
      } else {
        toast({
          title: "Cannot remove user as admin",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  function handleRemoveUser(userId: string) {
    dispatch(removeParticipants({ participants: [userId], chatId })).then(
      (response) => {
        if (response.payload?.success) {
          toast({
            title: "User removed from group",
          });
        } else {
          toast({
            title: "Cannot remove user",
            description: response.payload?.message || "Something went wrong",
            variant: "destructive",
          });
        }
      }
    );
  }
  function handleLeaveGroup() {
    dispatch(leaveGroupChat(chatId)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "You left the group",
        });
        router.push("/messages");
      } else {
        toast({
          title: "Cannot leave group",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  function handleBlockUser(userId: string) {
    dispatch(blockUser(userId)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "User blocked",
        });
        router.push("/messages");
      } else {
        toast({
          title: "Cannot block user",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  function handleDeleteGroup() {
    dispatch(deleteGroupChat(chatId)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Group deleted successfully",
        });
        router.push("/messages");
      } else {
        toast({
          title: "Cannot delete group",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    const savedMessageTheme = JSON.parse(
      localStorage.getItem("message-theme") || "{}"
    );
    if (savedMessageTheme.name) {
      setCurrentTheme(savedMessageTheme as (typeof themes)[0]);
    } else {
      setCurrentTheme(themes[0]);
    }

    if (!chats.length)
      dispatch(getChats()).then((response) => {
        if (!chat._id && response.payload?.success)
          dispatch(setCurrentChat(chatId));
      });
  }, [themes, dispatch]);

  return (
    <div className="flex flex-col w-full h-full gap-2 relative md:border-l-2 border-stone-200 dark:border-stone-800 lg:col-span-7 md:col-span-6 col-span-10 py-4 md:container px-3 max-h-[100dvh]">
      <div className="flex justify-between gap-2 items-center px-1 w-full">
        <h1 className="text-xl tracking-tight font-semibold">
          Conversation Info
        </h1>
        <Link href={`/messages/${chatId}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X />
          </Button>
        </Link>
      </div>
      <hr className="bg-stone-500 w-full" />
      <div className="flex flex-col items-center justify-center w-full py-2 gap-2 mb-8">
        <Avatar className="w-28 h-28 select-none pointer-events-none">
          <AvatarImage src={chat.groupIcon || chat.users[0]?.avatar} alt="" />
          <AvatarFallback>
            {nameFallback(chat.groupName || chat.users[0]?.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="grid place-items-center">
          <h1 className="text-2xl font-bold tracking-tight flex items-center justify-start">
            {chat.groupName || chat.users[0]?.fullName}
          </h1>
          <p className="text-stone-800 dark:text-stone-200 font-light">
            {chat.description}
          </p>
          <p className="text-sm text-stone-500">
            {chat.isGroupChat
              ? `Created on ${new Date(chat.createdAt).toLocaleDateString(
                  "en-IN"
                )}`
              : `@${chat.users[0]?.username}`}
          </p>
        </div>
        {!chat.isGroupChat && (
          <Link href={`/${chat.users[0]?.username}`}>
            <Button variant="outline" className="my-2">
              View profile
            </Button>
          </Link>
        )}
      </div>
      {chat.isGroupChat && <h3 className="mx-1">Members</h3>}
      <ScrollArea className="max-h-full">
        <div className="flex items-center justify-start gap-2 w-full p-3 hover:bg-stone-100 hover:dark:bg-stone-900 rounded-xl">
          <Avatar className="pointer-events-none select-none">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
              {nameFallback(currentUser.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center w-full">
            <span className="text-lg font-medium leading-5">
              {currentUser.fullName}
            </span>
            <span className="text-sm text-stone-500">You</span>
          </div>
          {chat.admin.includes(currentUser._id) && <Badge>Admin</Badge>}
        </div>
        {chat.users.map((user, index) => (
          <div
            className="flex items-center justify-start gap-2 w-full p-3 hover:bg-stone-100 hover:dark:bg-stone-900 rounded-xl"
            key={index}
          >
            <Link href={`/${user.username}`}>
              <Avatar className="pointer-events-none select-none">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href={`/${user.username}`}
              className="flex flex-col items-start justify-center w-full"
            >
              <span className="text-lg font-medium leading-4">
                {user.fullName}
              </span>
              <span className="text-sm text-stone-500">@{user.username}</span>
            </Link>
            {chat.admin.includes(user._id) && <Badge>Admin</Badge>}
            {chat.isGroupChat && chat.admin.includes(currentUser._id) && (
              <Menubar className="bg-transparent border-transparent xl:justify-start justify-center w-fit p-0">
                <MenubarMenu>
                  <MenubarTrigger className="px-1.5 rounded-lg cursor-pointer">
                    <MoreHorizontal />
                  </MenubarTrigger>
                  <MenubarContent className="rounded-xl" align="center">
                    <Link href={`/${user.username}`}>
                      <MenubarItem
                        className=" rounded-lg py-2.5"
                        onClick={() => handleRemoveAdmin(user._id)}
                      >
                        View Profile
                      </MenubarItem>
                    </Link>
                    {chat.admin.includes(user._id) ? (
                      <MenubarItem
                        className=" rounded-lg py-2.5"
                        onClick={() => handleRemoveAdmin(user._id)}
                      >
                        Remove Admin
                      </MenubarItem>
                    ) : (
                      <MenubarItem
                        className=" rounded-lg py-2.5"
                        onClick={() => handleMakeAdmin(user._id)}
                      >
                        Make Admin
                      </MenubarItem>
                    )}
                    <MenubarItem
                      className="text-red-600 focus:text-red-600 rounded-lg py-2.5"
                      onClick={() =>
                        setRemoveDialog({
                          open: true,
                          username: user.username,
                          userId: user._id,
                        })
                      }
                    >
                      Remove
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </div>
        ))}
      </ScrollArea>
      <hr className="bg-stone-500 w-full" />
      <Dialog>
        <DialogTrigger className="flex items-center justify-start text-base gap-4 py-3 px-4 w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-sm">
          <Palette /> Themes
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="rounded-xl"
        >
          <div className="flex flex-col py-2 items-center justify-center">
            <h1 className="text-xl tracking-tight font-semibold mt-2 mb-4">
              Themes
            </h1>
            {themes.map((theme, index) => (
              <DialogClose
                className="px-4 py-3 hover:bg-stone-100 hover:dark:bg-stone-900 flex items-center justify-between w-full rounded-xl gap-2 capitalize"
                onClick={() => {
                  setCurrentTheme(theme);
                  localStorage.setItem("message-theme", JSON.stringify(theme));
                }}
                key={index}
              >
                <div className="flex gap-2">
                  <div className={`rounded-full ${theme.color} w-8 h-8`} />
                  &nbsp;{theme.name}
                </div>
                {currentTheme.name === theme.name && <Check />}
              </DialogClose>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <hr className="bg-stone-500 w-full" />
      <div className="p-2 w-full bg-transparent flex flex-col gap-2">
        <Button
          className="w-full text-red-600  hover:text-red-600"
          variant="ghost"
          onClick={() => setReportDialog(true)}
        >
          Report Chat
        </Button>
        {chat?.isGroupChat ? (
          chat.users.length > 0 && (
            <Button
              className="w-full text-red-600 hover:text-red-600"
              variant="ghost"
              onClick={() => setLeaveDialog(true)}
            >
              Leave Group
            </Button>
          )
        ) : (
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-600"
            onClick={() => setBlockDialog(true)}
          >
            Block @{chat?.users[0]?.username}
          </Button>
        )}
        {chat.admin.includes(currentUser._id) && chat?.isGroupChat && (
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-600"
            onClick={() => setDeleteGroup(true)}
          >
            Delete Group
          </Button>
        )}
      </div>
      <AlertDialog open={leaveDialog}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle className="font-normal">
            Leave this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer receive messages from this group.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLeaveDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              className="bg-destructive hover:bg-destructive/80 text-white"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Leave"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={blockDialog}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle className="font-normal">
            Block {chat.users[0]?.username}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer be able to send/receive messages from this user.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBlockDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleBlockUser(chat.users[0]?._id)}
              className="bg-destructive hover:bg-destructive/80 text-white"
            >
              {userLoading ? <Loader2 className="animate-spin" /> : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteGroup}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle className="font-normal">
            Delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            No one will be able to send messages in this group.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLeaveDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-destructive hover:bg-destructive/80 text-white"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={removeDialog.open}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle className="font-normal">
            Remove {removeDialog.username} from this group?
          </AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setRemoveDialog({ open: false, username: "", userId: "" })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemoveUser(removeDialog.userId)}
              className="bg-destructive hover:bg-destructive/80 text-white"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ReportDialog
        open={reportDialog}
        setOpen={setReportDialog}
        type="chat"
        entityId={chatId}
      />
    </div>
  );
}

export default Info;
