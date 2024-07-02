"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

function Page() {
  const formSchema = z.object({
    privateAccount: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privateAccount: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-2 my-2 flex items-center gap-4">
        <Link href="/settings" className="sm:hidden">
          <Button variant="ghost" size="icon" className="rounded-xl ml-4">
            <ArrowLeft />
          </Button>
        </Link>
        Privacy
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-x-8 w-full"
        >
          <FormField
            control={form.control}
            name="privateAccount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm sm:w-2/3 w-full max-sm:mx-4 mx-auto border mt-6">
                <div className="space-y-1">
                  <FormLabel>Private Account</FormLabel>
                  <FormDescription>
                    Make your profile and posts visible only to approved
                    followers for added privacy.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default Page;
