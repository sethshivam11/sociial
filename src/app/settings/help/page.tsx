"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function Page() {
  const [image, setImage] = React.useState<File | null>(null);
  const formSchema = z.object({
    title: z
      .string()
      .min(10, {
        message: "Title must be more than 10 characters",
      })
      .max(100, {
        message: "Title must be less than 100 characters",
      }),
    description: z
      .string()
      .min(50, {
        message: "Description must be more than 50 characters",
      })
      .max(1000, {
        message: "Description must be less than 1000 characters",
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-2 my-2 flex items-center gap-4">
        <Link href="/settings" className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl ml-2 hover:bg-background"
          >
            <ArrowLeft />
          </Button>
        </Link>
        Help & Support
      </h1>
      <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5 mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your problem?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Errors or issues you are facing"
                      inputMode="text"
                      autoComplete="off"
                      {...field}
                    />
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
                  <FormLabel>Explain your problem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your problem in detail"
                      inputMode="text"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Images
                    <span className="text-stone-500">&nbsp;(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Images"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setImage(e.target.files[0]);
                        } else {
                          setImage(null);
                        }
                      }}
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
    </div>
  );
}

export default Page;
