"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInput {
  identifier: string;
  password: string;
}

function page() {
  const form = useForm<FormInput>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [showPwd, setShowPwd] = React.useState(false);
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    let username = "";
    if (!(data.identifier.includes("@") || data.identifier.includes("."))) {
      username = data.identifier;
      data.identifier = "";
    }
    console.log({
      username,
      email: data.identifier,
      password: data.password,
    });
  };
  return (
    <div className="flex justify-center col-span-10 py-12 items-center min-h-screen bg-white dark:bg-zinc-800">
      <img
        src="/bg-doodle-2.jpg"
        alt=""
        className="fixed object-cover h-full w-full blur-sm hidden dark:block"
      />
      <img
        src="/bg-doodle-white.jpg"
        alt=""
        className="fixed object-cover h-full w-full blur-sm dark:hidden"
      />
      <div className="w-full max-w-md p-8 space-y-8 last:space-y-3 bg-white dark:bg-zinc-900 ring-2 ring-zinc-500 dark:ring-zinc-200 rounded-lg shadow-md relative z-10">
        <div className="text-center text-black dark:text-white">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Sociial
          </h1>
          <p className="mb-4">Sign in to continue to your journey with us</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username / Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="username or email"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      inputMode="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CheckboxWithLabel
              text="Show Password"
              checked={showPwd}
              setChecked={setShowPwd}
            />
            <div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
              </Button>
            </div>
          </form>
        </Form>
        <p className="mb-2 text-center">
          <Link
            href="/forgot-password"
            className="text-blue-500 text-sm hover:opacity-80"
          >
            Forgot Password
          </Link>
        </p>
        <p className="text-center mt-2">
          Don't have an account?&nbsp;
          <Link href="/sign-up" className="text-blue-500 hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default page;
