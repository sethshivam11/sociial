"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function SignUpPage() {
  const formSchema = z
    .object({
      email: z
        .string()
        .email()
        .min(6, {
          message: "Email must be more than 6 characters",
        })
        .max(50, {
          message: "Email must be less than 50 characters",
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
        .regex(/^[a-z_1-9.]+$/)
        .min(2, {
          message: "Username must be more than 2 characters",
        })
        .max(20, {
          message: "Username must be less than 20 characters",
        }),
      password: z
        .string()
        .min(6, {
          message: "Password must be more than 6 characters",
        })
        .max(50, {
          message: "Password must be less than 50 characters",
        }),
      confirmPassword: z.string(),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Passwords must match!",
        path: ["confirmPassword"],
      }
    );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [showPwd, setShowPwd] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [avatar, setAvatar] = React.useState<FileList | null>(null);
  const debounced = useDebounceCallback(setUsername, 500);
  const [isFetchingUsername, setIsFetchingUsername] = React.useState(false);
  const [usernameMessage, setUsernameMessage] = React.useState("");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confirmPassword) {
      return console.log("Passwords do not match");
    }
    console.log(data);
  };

  function isUsernameAvailable(username: string) {
    if (!username?.trim()) {
      return;
    }
    setIsFetchingUsername(true);
    fetch(`/api/v1/users/usernameAvailable/${username}`)
      .then((parsed) => parsed.json())
      .then((response) => {
        setUsernameMessage(response.message);
      })
      .catch((err) => {
        console.error(err);
        setUsernameMessage(err.message || "Error checking username");
      })
      .finally(() => setIsFetchingUsername(false));
  }

  React.useEffect(() => {
    if (username.startsWith(".")) {
      setUsernameMessage("Username cannot start with .");
    } else if (username && /^[a-z]._+$/.test(username)) {
      setUsernameMessage("Username must contain only lowercase, ., _");
    } else if (username.trim()) {
      isUsernameAvailable(username);
    } else {
      setUsernameMessage("");
    }
  }, [username]);

  return (
    <div className="flex justify-center col-span-10 py-12 items-center min-h-screen dark:bg-zinc-800">
      <Image
        width="1920"
        height="1080"
        src="/bg-doodle-dark.jpg"
        alt=""
        className="fixed object-cover h-[60rem] w-full blur-sm hidden dark:block top-0"
      />
      <Image
        width="1920"
        height="1080"
        src="/bg-doodle-light.jpg"
        alt=""
        className="fixed object-cover h-[60rem] w-full blur-sm dark:hidden top-0"
      />
      <div className="w-full max-w-md p-8 space-y-8 last:space-y-3 my-4 bg-white dark:bg-zinc-900 ring-2 ring-zinc-500 dark:ring-zinc-200 rounded-lg shadow-md z-10">
        <div className="text-center  text-black dark:text-white">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Sociial
          </h1>
          <p className="mb-4">Sign up to start to your journey with us</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      inputMode="text"
                      placeholder="name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      type="text"
                      autoComplete="email"
                      inputMode="email"
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
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      type="text"
                      max={30}
                      autoComplete="username"
                      inputMode="text"
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
                  {isFetchingUsername ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    ""
                  )}
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
                      autoComplete="new-password"
                      inputMode="text"
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
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="confirm password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="new-password webauthn"
                      inputMode="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="avatar"
              render={() => (
                <FormItem>
                  <FormLabel>Profile picture (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="profile pic"
                      type="file"
                      autoComplete="off"
                      onChange={(e) => setAvatar(e.target.files)}
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Sign up"}
            </Button>
          </form>
        </Form>
        <p className="text-center mt-2">
          Already have an account?&nbsp;
          <Link
            href="/sign-in"
            className="text-blue-500 hover:opacity-80"
            type="button"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
