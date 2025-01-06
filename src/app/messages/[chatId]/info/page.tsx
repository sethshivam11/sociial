"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Check,
  History,
  Loader2,
  MoreHorizontal,
  Palette,
  SquarePen,
  UserPlus2,
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
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import FollowersLoadingSkeleton from "@/components/skeletons/FollowersLoading";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  addParticipants,
  deleteGroupChat,
  getChats,
  leaveGroupChat,
  makeAdmin,
  removeAdmin,
  removeGroupImage,
  removeParticipants,
  setCurrentChat,
  updateGroupDetails,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { groupDescriptionSchema, groupNameSchema } from "@/schemas/chatSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { getFollowings } from "@/lib/store/features/slices/followSlice";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Theme {
  name: string;
  color: string;
  text: string;
}

function Info({ params }: { params: { chatId: string } }) {
  const defaultIcon =
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1725736840/sociial/settings/feahtus4algwiixi0zmi.png";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const formSchema = z.object({
    name: groupNameSchema,
    description: groupDescriptionSchema,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const { chatId } = params;
  const { skeletonLoading, followings } = useAppSelector(
    (state) => state.follow
  );
  const { chat, chats, loading } = useAppSelector((state) => state.chat);
  const { user: currentUser, loading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const [participants, setParticipants] = useState<string[]>([]);
  const [friends, setFriends] = useState<typeof followings>([]);
  const [reportDialog, setReportDialog] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
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
    dispatch(removeParticipants({ participants: [userId], chatId }))
      .then((response) => {
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
      })
      .finally(() =>
        setRemoveDialog({ open: false, username: "", userId: "" })
      );
  }
  function handleLeaveGroup() {
    dispatch(leaveGroupChat(chatId))
      .then((response) => {
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
      })
      .finally(() => setLeaveDialog(false));
  }
  function handleBlockUser(userId: string) {
    dispatch(blockUser(userId))
      .then((response) => {
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
      })
      .finally(() => setBlockDialog(false));
  }
  function handleDeleteGroup() {
    dispatch(deleteGroupChat(chatId))
      .then((response) => {
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
      })
      .finally(() => setDeleteGroup(false));
  }
  function handleAdd() {
    dispatch(addParticipants({ participants, chatId }))
      .then((response) => {
        if (response.payload?.success) {
          toast({
            title: "Members added to group",
          });
        } else {
          toast({
            title: "Cannot add members to group",
            description: response.payload?.message || "Something went wrong",
            variant: "destructive",
          });
        }
      })
      .finally(() => setAddDialog(false));
  }
  function handleUpdateGroupIcon(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    dispatch(updateGroupDetails({ image: e.target.files[0], chatId })).then(
      (response) => {
        if (response.payload?.success) {
          toast({
            title: "Group image updated successfully",
          });
        } else {
          toast({
            title: "Cannot update group image",
            description: response.payload?.message || "Something went wrong",
            variant: "destructive",
          });
        }
      }
    );
  }
  function handleRemoveGroupIcon() {
    dispatch(removeGroupImage(chatId)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Group image removed successfully",
        });
      } else {
        toast({
          title: "Cannot remove group image",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  async function handleUpdate({
    name,
    description,
  }: z.infer<typeof formSchema>) {
    dispatch(updateGroupDetails({ chatId, name, description }))
      .then((response) => {
        if (response.payload?.success) {
          toast({
            title: "Group details updated successfully",
          });
          setParticipants([]);
        } else {
          toast({
            title: "Cannot update group details",
            description: response.payload?.message || "Something went wrong",
            variant: "destructive",
          });
        }
      })
      .finally(() => setUpdateDialog(false));
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

    if (!chats.length) {
      dispatch(getChats()).then((response) => {
        if (!chat._id && response.payload?.success) {
          dispatch(setCurrentChat(chatId));
        }
      });
    }
  }, [dispatch, chat._id, chatId, chats.length]);
  useEffect(() => {
    if (addDialog) {
      dispatch(getFollowings({ userId: currentUser._id })).then((response) => {
        if (
          response.payload?.success ||
          response.payload?.message === "Followings not found"
        ) {
          const usersInChat = chat.users.map((user) => user._id);
          const filteredFollowing = response.payload.data.followings.filter(
            (user: { _id: string }) => !usersInChat.includes(user._id)
          );
          setFriends(filteredFollowing);
        }
      });
    }
  }, [dispatch, addDialog, chat.users, currentUser._id]);

  return (
    <div className="flex flex-col w-full h-full gap-2 relative md:border-l-2 border-stone-200 dark:border-stone-800 lg:col-span-7 md:col-span-6 col-span-10 py-4 md:container px-3 max-h-[100dvh] overflow-y-auto">
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
        {chat.isGroupChat ? (
          <Menubar className="bg-transparent border-transparent xl:justify-start justify-center w-fit h-fit p-0">
            <MenubarMenu>
              <MenubarTrigger className="p-0 rounded-full cursor-pointer">
                <Avatar className="w-28 h-28 select-none pointer-events-none">
                  <AvatarImage src={chat.groupIcon || ""} alt="" />
                  <AvatarFallback>
                    {nameFallback(chat.groupName || chat.users[0]?.fullName)}
                  </AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              {chat.admin.includes(currentUser._id) && (
                <>
                  <input
                    type="file"
                    id="image"
                    ref={inputRef}
                    className="h-0 w-0"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleUpdateGroupIcon}
                  />
                  <MenubarContent className="rounded-xl" align="center">
                    {chat.groupIcon === defaultIcon ? (
                      <MenubarItem
                        className=" rounded-lg py-2.5"
                        onClick={() => inputRef.current?.click()}
                      >
                        Update
                      </MenubarItem>
                    ) : (
                      <MenubarItem
                        className="text-red-600 focus:text-red-600 rounded-lg py-2.5"
                        onClick={handleRemoveGroupIcon}
                      >
                        Remove
                      </MenubarItem>
                    )}
                  </MenubarContent>
                </>
              )}
            </MenubarMenu>
          </Menubar>
        ) : (
          <Avatar className="w-28 h-28 select-none pointer-events-none">
            <AvatarImage src={chat.users[0]?.avatar} alt="" />
            <AvatarFallback>
              {nameFallback(chat.groupName || chat.users[0]?.fullName)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="grid place-items-center">
          <h1 className="text-2xl font-bold tracking-tight flex items-center justify-start">
            {chat.groupName || chat.users[0]?.fullName}
          </h1>
          <p className="text-sm text-stone-500">
            {chat.isGroupChat
              ? `Created on ${new Date(chat.createdAt).toLocaleDateString(
                  "en-IN"
                )}`
              : `@${chat.users[0]?.username}`}
          </p>
          <p className="text-stone-800 dark:text-stone-200 font-light">
            {chat.description}
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
      {chat.isGroupChat && (
        <div>
          <button
            className="flex items-center justify-start gap-2.5 w-full py-3 px-5 hover:bg-stone-100 hover:dark:bg-stone-900 rounded-xl"
            onClick={() => setAddDialog(true)}
          >
            <UserPlus2 size="30" />
            <div className="flex flex-col items-start justify-center w-full text-lg font-medium leading-5">
              Add Members
            </div>
          </button>
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
        </div>
      )}
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
      {chat.isGroupChat && (
        <Dialog open={updateDialog}>
          <DialogTrigger
            className="flex items-center justify-start text-base gap-4 py-3 px-4 w-full hover:bg-stone-100 hover:dark:bg-stone-900 rounded-sm"
            onClick={() => {
              form.setValue("name", chat.groupName);
              form.setValue("description", chat.description || "");
              setUpdateDialog(true);
            }}
          >
            <SquarePen /> Update Group
          </DialogTrigger>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            hideCloseIcon
          >
            <DialogTitle className="text-center">
              Update Group Details
            </DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdate)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Group Name" id="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Group Description"
                          id="description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant="ghost"
                    type="button"
                    className="max-sm:mt-2"
                    disabled={loading}
                    onClick={() => {
                      if (!loading) setUpdateDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      (form.watch("name") === chat.groupName &&
                        form.watch("description") ===
                          (chat.description || "")) ||
                      !form.watch("name")
                    }
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Update"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
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
      <Dialog open={addDialog}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          hideCloseIcon
        >
          <DialogTitle className="text-center">Add Members</DialogTitle>
          <div className="flex flex-col items-center justify-center w-full">
            {skeletonLoading ? (
              <FollowersLoadingSkeleton />
            ) : friends.length ? (
              <ScrollArea className="h-96 w-full p-4">
                {friends.map((friend, index) => (
                  <div
                    className="flex items-center justify-between w-full px-2 mb-3 gap-3 rounded-lg"
                    key={index}
                  >
                    <Label
                      htmlFor={`follower-${index}`}
                      className="flex items-center gap-3 rounded-lg w-full cursor-pointer"
                    >
                      <div className="w-8 h-8">
                        <Avatar className="w-full h-full rounded-full pointer-events-none select-none">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>
                            {nameFallback(friend.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-lg leading-5">{friend.fullName}</p>
                        <p className="text-sm text-gray-500">
                          @{friend.username}
                        </p>
                      </div>
                    </Label>
                    <Checkbox
                      id={`follower-${index}`}
                      className="rounded-full w-5 h-5 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 data-[state=checked]:border-0"
                      onCheckedChange={(checked) => {
                        checked
                          ? setParticipants((prev) => [...prev, friend._id])
                          : setParticipants((prevParticipants) =>
                              prevParticipants.filter(
                                (user) => user !== friend._id
                              )
                            );
                      }}
                      defaultChecked={participants.includes(friend._id)}
                    />
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 h-96 p-4">
                <History size="60" />
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-semibold tracking-tight">
                    No members to join
                  </h2>
                  <p className="text-center text-stone-500">
                    Follow more people in order to add them to the group
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="max-sm:mt-2"
              onClick={() => {
                if (!loading) {
                  setAddDialog(false);
                  setParticipants([]);
                }
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={participants.length === 0}>
              {loading ? <Loader2 className="animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={leaveDialog}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle className="font-normal">
            Leave this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer receive messages from this group.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (!loading) setLeaveDialog(false);
              }}
            >
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
            <AlertDialogCancel
              onClick={() => {
                if (!userLoading) setBlockDialog(false);
              }}
            >
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
            <AlertDialogCancel
              onClick={() => {
                if (!loading) setDeleteGroup(false);
              }}
            >
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
              onClick={() => {
                if (!loading)
                  setRemoveDialog({ open: false, username: "", userId: "" });
              }}
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
{
  /* <label htmlFor="image" className="cursor-pointer">
              <Image
                className="mx-auto mt-2 object-cover w-24 h-24 pointer-events-none select-none aspect-square rounded-full"
                src={image || chat.groupIcon}
                alt=""
                width={100}
                height={100}
              />
            </label>
            <button
              className={`text-red-600 text-sm ${
                image ? "visible" : "invisible "
              }`}
              onClick={() => setImage("")}
            >
              Clear
            </button>
             */
}
