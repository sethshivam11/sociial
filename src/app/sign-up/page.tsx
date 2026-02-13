"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "@/components/ui/use-toast";
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  usernameSchema,
} from "@/schemas/userSchema";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { registerUser } from "@/lib/store/features/slices/userSlice";
import { isUsernameAvailable } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { Lobster_Two } from "next/font/google";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function SignUpPage() {
  const formSchema = z
    .object({
      email: emailSchema,
      fullName: fullNameSchema,
      username: usernameSchema,
      password: passwordSchema,
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
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const debounced = useDebounceCallback(setUsername, 500);
  const [isFetchingUsername, setIsFetchingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");

  function handleGoogleLogin() {
    if (!window) return;
    window.location.href = "/auth/google";
  }
  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.password !== data.confirmPassword) {
      return console.log("Passwords do not match");
    }
    const response = await dispatch(registerUser({ ...data, avatar }));
    if (response.payload && response.payload.success) {
      router.push(`/verify-code?username=${response.payload.data.username}`);
    } else {
      toast({
        title: response.payload?.message || "Something went wrong",
      });
    }
  }

  useEffect(() => {
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
    <>
      <div className="flex justify-center col-span-10 py-12 items-center min-h-[100dvh] bg-white dark:bg-zinc-800  bg-[url('/bg-doodle-light.jpg')] dark:bg-[url('/bg-doodle-dark.jpg')] bg-cover bg-center bg-no-repeat px-2">
        <div className="w-full max-w-md p-8 space-y-8 last:space-y-3 my-4 bg-white dark:bg-zinc-900 ring-2 ring-zinc-500 dark:ring-zinc-200 rounded-lg shadow-md z-10">
          <div className="text-center  text-black dark:text-white">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join <span className={lobster.className}>Sociial</span>
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
                    {isFetchingUsername && <Loader2 className="animate-spin" />}
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
                        accept="image/jpg,image/png,image/jpeg"
                        autoComplete="off"
                        onChange={(e) => {
                          const imageFiles = e.target.files;
                          if (!imageFiles) return;
                          if (
                            imageFiles[0].type === "image/jpeg" ||
                            imageFiles[0].type === "image/jpg" ||
                            imageFiles[0].type === "image/png"
                          ) {
                            setAvatar(imageFiles[0]);
                          } else {
                            toast({
                              title: "Warning",
                              description:
                                "Unsupported file format, Please provide jpg, jpeg or png image",
                              variant: "destructive",
                            });
                            e.currentTarget.value = "";
                          }
                        }}
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
                  {loading ? <Loader2 className="animate-spin" /> : "Sign up"}
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
                  Continue with Google
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-center mt-2">
            Already have an account?&nbsp;
            <Link
              href="/sign-in"
              className="text-blue-500 hover:opacity-80 underline underline-offset-2"
              type="button"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignUpPage;
