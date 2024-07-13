"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { ArrowLeft } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const formSchema = z
    .object({
      currentPassword: z
        .string()
        .min(6, {
          message: "Invalid Password",
        })
        .max(50, {
          message: "Invalid Password",
        }),
      newPassword: z
        .string()
        .min(6, {
          message: "Password must be at least 6 characters",
        })
        .max(50, {
          message: "Password must be at most 50 characters",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword !== data.confirmPassword, {
      message: "Passwords do not match",
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  function sendMail(email: string) {
    console.log(email);
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="sm:w-2/3 text-lg tracking-tight font-semibold w-full text-left my-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="ml-4 rounded-xl sm:hidden hover:bg-background"
          onClick={() => router.push("/settings")}
        >
          <ArrowLeft />
        </Button>
        Change Password
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="sm:w-2/3 w-3/4 space-y-5 mt-3"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Current Password"
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
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm New Password"
                    inputMode="text"
                    autoComplete="username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
