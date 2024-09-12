"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import React from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  bioSchema,
  fullNameSchema,
  usernameSchema,
} from "@/schemas/userSchema";
import { useAppSelector } from "@/lib/store/store";
import { useDebounceCallback } from "usehooks-ts";
import { isUsernameAvailable } from "@/lib/helpers";

function Page() {
  const router = useRouter();
  const formSchema = z.object({
    bio: bioSchema,
    fullName: fullNameSchema,
    username: usernameSchema,
  });

  const { user } = useAppSelector((state) => state.user);
  const [username, setUsername] = React.useState(user.username);
  const [isFetchingUsername, setIsFetchingUsername] = React.useState(false);
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: user.bio,
      fullName: user.fullName,
      username: user.username,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  React.useEffect(() => {
    if (user.bio) form.setValue("bio", user.bio);
    if (user.fullName) form.setValue("fullName", user.fullName);
    if (user.username) {
      setUsername(user.username);
      form.setValue("username", user.username);
    }
  }, [user]);

  React.useEffect(() => {
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
  }, [username]);

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-lg tracking-tight font-semibold w-full text-left sm:my-4 my-2 flex items-center gap-4 sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 rounded-xl hover:bg-background"
          onClick={() => router.push("/settings")}
        >
          <ArrowLeft />
        </Button>
        Edit Profile
      </h1>
      <div className="flex flex-col gap-2 items-center justify-start sm:w-2/3 w-full rounded-full sm:mt-6 px-4 py-2">
        <Avatar className="w-28 h-28 pointer-events-none select-none">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
        </Avatar>
        <button className="text-blue-500 text-bold">Change photo</button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="sm:w-1/2 w-3/4 space-y-8 mt-8"
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={
              form.watch("username") === user.username &&
              form.watch("fullName") === user.fullName &&
              form.watch("bio") === user.bio
            }
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
