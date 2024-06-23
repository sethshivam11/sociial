import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Send, SendHorizonal } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import React from "react";

interface FormInterface {
  message: string;
}

export default function Share() {
  const form = useForm<FormInterface>({
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: FormInterface) {
    console.log(values);
  }
  const [search, setSearch] = React.useState("");

  const followers = [
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild title="Share">
        <Send size="30" className="sm:hover:opacity-60 rotate-12" />
      </DialogTrigger>
      <DialogContent
        className="sm:w-2/3 w-full h-3/4 flex flex-col bg-stone-100 dark:bg-stone-900"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <h1 className="text-xl">Share post</h1>
        <Input
          value={search}
          inputMode="search"
          placeholder="Search for users"
          onChange={(e) => setSearch(e.target.value)}
        />
        <hr className="bg-stone-500 my-2" />
        <div className="flex flex-col justify-start items-start gap-4 overflow-y-auto h-full">
          {followers.map((follower, index) => {
            return (
              <div className="flex items-center gap-3 rounded-lg" key={index}>
                <div className="w-8 h-8">
                  <Image
                    width={32}
                    height={32}
                    src={follower.avatar}
                    alt=""
                    className="w-full h-full rounded-full pointer-events-none select-none"
                  />
                </div>
                <div>
                  <p>{follower.fullName}</p>
                  <p className="text-sm text-gray-500 leading-3">
                    @{follower.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex items-center justify-center gap-2"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        type="text"
                        inputMode="text"
                        placeholder="Add a message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size="sm" type="submit">
                <SendHorizonal />
              </Button>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
