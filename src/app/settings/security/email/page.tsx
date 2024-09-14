"use client";
import { ChevronLeft } from "lucide-react";
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
import Link from "next/link";
import { emailSchema, verificationCodeSchema } from "@/schemas/userSchema";

function Page() {
  const formSchema = z.object({
    email: emailSchema,
    otp: verificationCodeSchema,
  });

  const [user, setUser] = React.useState({
    fullName: "Shivam Soni",
    username: "sethshivam11",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png",
    email: "shivam@example.com",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
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
      <h1 className="sm:w-2/3 text-lg tracking-tight font-semibold w-full text-left my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings/security">
          <ChevronLeft />
        </Link>
        Update Email
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="sm:w-2/3 w-3/4 space-y-5 mt-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      inputMode="text"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => sendMail(form.getValues("email"))}
                  >
                    Get OTP
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Verification Code"
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
