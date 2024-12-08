"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
  bioSchema,
  fullNameSchema,
  usernameSchema,
} from "@/schemas/userSchema";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { useDebounceCallback } from "usehooks-ts";
import { isUsernameAvailable } from "@/lib/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import {
  removeAvatar,
  updateAvatar,
  updateDetails,
} from "@/lib/store/features/slices/userSlice";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

function Page() {
  const dispatch = useAppDispatch();
  const formSchema = z.object({
    bio: bioSchema,
    fullName: fullNameSchema,
    username: usernameSchema,
  });

  const { user, skeletonLoading, loading } = useAppSelector(
    (state) => state.user
  );
  const [username, setUsername] = useState(user.username);
  const [isFetchingUsername, setIsFetchingUsername] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: user.bio,
      fullName: user.fullName,
      username: user.username,
    },
  });

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;
    dispatch(updateAvatar(e.target.files[0])).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Profile photo updated successfully",
        });
      } else {
        toast({
          title: "Profile photo update failed",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  function onSubmit({ fullName, username, bio }: z.infer<typeof formSchema>) {
    const data = {
      fullName: fullName === user.fullName ? undefined : fullName,
      username: username === user.username ? undefined : username,
      bio: bio === user.bio ? undefined : bio,
    };
    dispatch(updateDetails(data)).then((response) => {
      if (response.payload?.success) {
        toast({
          title: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Profile update failed",
          description: response.payload?.message || "An error occurred",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    if (user.bio) form.setValue("bio", user.bio);
    if (user.fullName) form.setValue("fullName", user.fullName);
    if (user.username) {
      setUsername(user.username);
      form.setValue("username", user.username);
    }
  }, [user, form]);

  useEffect(() => {
    if (username === user.username) return setUsernameMessage("");
    try {
      if (username) {
        usernameSchema.parse(username);
        isUsernameAvailable(
          username,
          setUsernameMessage,
          setIsFetchingUsername
        );
      } else {
        setUsernameMessage("");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameMessage(error.errors[0].message);
      } else {
        console.log(error);
      }
    }
  }, [username, user.username]);

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-lg tracking-tight font-semibold w-full text-left sm:my-4 my-2 flex items-center gap-4 sm:hidden">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Edit Profile
      </h1>
      {skeletonLoading ? (
        <div className="flex flex-col gap-6 items-center justify-start sm:w-2/3 w-full rounded-full sm:mt-6 px-4 py-2">
          <Skeleton className="w-28 h-28 rounded-full" />
          <Skeleton className="w-28 h-6" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-start sm:w-2/3 w-full rounded-full sm:mt-6 px-4 py-2">
            <Menubar className="w-fit h-fit bg-transparent border-transparent xl:justify-start justify-center">
              <MenubarMenu>
                <MenubarTrigger className="bg-tranparent w-fit p-0 hover:bg-transparent bg-transparent rounded-full">
                  <Avatar className="w-28 h-28 select-none cursor-pointer">
                    <AvatarImage
                      src={user.avatar}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <AvatarFallback>
                      {nameFallback(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </MenubarTrigger>
                <MenubarContent className="rounded-xl" align="center">
                  <MenubarItem
                    className="py-2.5 rounded-lg pl-2.5"
                    onClick={() => setViewDialog(true)}
                  >
                    View
                  </MenubarItem>
                  {user.avatar !==
                    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png" && (
                    <MenubarItem
                      className="py-2.5 rounded-lg pl-2.5 text-red-500"
                      onClick={() => dispatch(removeAvatar())}
                    >
                      Remove
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          <label
            htmlFor="update-avatar"
            className="text-blue-500 text-bold cursor-pointer px-5 py-2"
          >
            Change photo
          </label>
          <input
            type="file"
            id="update-avatar"
            className="w-0 h-0"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFiles}
          />
        </>
      )}
      {skeletonLoading ? (
        <div className="sm:w-1/2 w-3/4 space-y-8 mt-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-full h-20" />
          </div>
          <Skeleton className="w-32 h-10" />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="sm:w-1/2 w-3/4 space-y-8 mt-8 pb-2"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      inputMode="text"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      inputMode="text"
                      autoComplete="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <span
                    className={`text-sm ${
                      usernameMessage === "Username available"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {!isFetchingUsername && usernameMessage}
                  </span>
                  {isFetchingUsername && <Loader2 className="animate-spin" />}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bio"
                      inputMode="text"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <p
                    className={`text-xs tracking-tight ${
                      form.watch("bio")?.length > 160
                        ? "text-red-500"
                        : "text-stone-500"
                    }`}
                  >
                    {form.watch("bio")?.length} / 160
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              disabled={
                (username === user.username &&
                  form.watch("fullName") === user.fullName &&
                  form.watch("bio") === user.bio) ||
                isFetchingUsername ||
                loading ||
                (username !== user.username &&
                  usernameMessage !== "Username available")
              }
            >
              {loading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      )}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent
          className="flex items-center justify-center py-10"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Image
            src={user.avatar}
            className="pointer-events-none select-none"
            alt=""
            width="400"
            height="400"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
