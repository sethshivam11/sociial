"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/schemas/userSchema";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  loginUser,
  resendVerificationCode,
} from "@/lib/store/features/slices/userSlice";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { socket } from "@/socket";

function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const formSchema = z.object({
    identifier: emailSchema.or(usernameSchema),
    password: passwordSchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { loading } = useAppSelector((state) => state.user);
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [currentDevice, setCurrentDevice] = useState({
    name: "",
    location: "",
  });

  function getDevice(userAgent: string) {
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("Mac")) return "Macintosh";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("like Mac")) return "iPhone";
    if (userAgent.includes("BlackBerry")) return "BlackBerry";
    if (userAgent.includes("Win")) return "Windows";
    return "Unknown";
  }
  function handleGoogleLogin() {
    if (!window) return;
    window.location.href = "/auth/google";
  }
  async function onSubmit(data: z.infer<typeof formSchema>) {
    let username = "";
    let email = "";
    if (!(data.identifier.includes("@") || data.identifier.includes("."))) {
      username = data.identifier;
    } else {
      email = data.identifier;
    }
    const response = await dispatch(
      loginUser({
        email,
        username,
        password: data.password,
        location: currentDevice.location,
        device: currentDevice.name,
      })
    );
    if (response.payload?.success) {
      if (!response.payload.data.user.isMailVerified) {
        router.prefetch("/verify-code");
        await dispatch(
          resendVerificationCode(response.payload.data.user.username)
        );
        return router.push(
          `/verify-code?username=${response.payload.data.user.username}`
        );
      } else {
        socket.connect();
        router.push("/");
      }
    } else {
      if (response.payload?.message === "User not found") {
        toast({
          title: "Invalid username or email",
          description: "Please check your username or email and try again",
        });
      } else {
        toast({
          title: response.payload?.message || "Something went wrong",
        });
      }
    }
  }

  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((parsed) => parsed.json())
      .then((response) => {
        setCurrentDevice({
          name: getDevice(navigator?.userAgent),
          location: `${response.city}, ${response.country}`,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex justify-center col-span-10 py-12 items-center min-h-[100dvh] bg-white dark:bg-zinc-800 bg-[url('/bg-doodle-light.jpg')] dark:bg-[url('/bg-doodle-dark.jpg')] bg-cover bg-center bg-no-repeat px-2">
      <div className="w-full max-w-md p-8 max-sm:p-6 space-y-8 last:space-y-3 bg-white dark:bg-zinc-900 ring-2 ring-zinc-500 dark:ring-zinc-200 rounded-lg shadow-md relative z-10">
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
                  <div className="flex gap-2 items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm hover:opacity-80 underline"
                    >
                      Forgot Password
                    </Link>
                  </div>
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
            <div className="space-y-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full"
              >
                <Image
                  src="/google-logo.png"
                  width="20"
                  height="20"
                  alt=""
                  className="mr-2"
                />
                Signin with Google
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-2">
          Don&apos;t have an account?&nbsp;
          <Link
            href="/sign-up"
            className="text-blue-500 hover:opacity-80 underline underline-offset-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
