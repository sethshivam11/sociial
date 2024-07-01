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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const formSchema = z.object({
    bio: z.string().max(200, {
      message: "Bio must be less than 200 characters",
    }),
    fullName: z
      .string()
      .min(2, {
        message: "Name must be more than 2 characters",
      })
      .max(20, {
        message: "Name must be less than 20 characters",
      }),
    username: z
      .string()
      .min(2, {
        message: "Username must be more than 2 characters",
      })
      .max(20, {
        message: "Username must be less than 20 characters",
      }),
  });

  const user = {
    fullName: "Shivam Soni",
    username: "sethshivam11",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    bio: "I am a full stack developer and a tech enthusiast. I love to build things that make a difference.",
  };

  const [username, setUsername] = React.useState(user.username);

  // const debouned = setUsername;

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

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-xl tracking-tight font-semibold w-full text-left my-4 flex items-center gap-4 sm:hidden">
        <Button variant="ghost" size="icon" className="ml-4 rounded-xl" onClick={() => router.push("/settings")}>
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
                  />
                </FormControl>
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
              form.getValues("username") === user.username &&
              form.getValues("fullName") === user.fullName &&
              form.getValues("bio") === user.bio
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
