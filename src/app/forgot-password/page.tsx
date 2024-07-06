"use client";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
  verificationCodeSchema,
} from "@/schemas/userSchema";
import { useUser } from "@/context/UserProvider";

const ForgotPasswordPage = () => {
  const { isSendingMail } = useUser();
  const formSchema = z
    .object({
      identifier: emailSchema.or(usernameSchema),
      password: passwordSchema,
      confirmPassword: z.string(),
      code: verificationCodeSchema,
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
  const [timer, setTimer] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
      confirmPassword: "",
      code: 0,
    },
  });

  function handleGetCode() {
    try {
      z.object({
        identifier: emailSchema.or(usernameSchema),
      }).parse({ identifier: form.watch("identifier") });
      form.clearErrors();
      // resendVerificationCode(form.watch("identifier"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setError("identifier", { message: error.errors[0].message });
      }
    }
  }

  function onSubmit({
    identifier,
    password,
    code,
  }: z.infer<typeof formSchema>) {
    const email =
      identifier.includes("@") && identifier.includes(".") ? identifier : "";
    if (!password) {
      return console.log("Passwords do not match");
    }
    setLoading(true);
    fetch("/api/v1/users/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username: identifier,
        password,
        code,
      }),
    })
      .then((parsed) => parsed.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Success",
            description: data.message,
          });
          router.push("/sign-in");
        } else {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  React.useEffect(() => {
    if (timer > 0) {
      const runningTimer = setInterval(() => {
        setTimer((timer) => (timer -= 1));
      }, 1000);
      return () => clearInterval(runningTimer);
    }
  }, [timer]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 flex col-span-10 items-center justify-center min-h-screen"
      >
        <Card className="w-fit space-y-2 ring-1 ring-gray-400 p-4">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold tracking-tight text-center lg:text-5xl">
              Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username or email"
                      autoComplete="off"
                      inputMode="email"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end justify-start w-full gap-2 my-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="verification code"
                        autoComplete="one-time-code"
                        type="number"
                        inputMode="numeric"
                        {...field}
                        value={
                          form.watch("code") === 0 ? "" : form.watch("code")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="secondary"
                type="button"
                disabled={
                  form.getValues("identifier").length === 0 ||
                  isSendingMail ||
                  timer > 0
                }
                onClick={handleGetCode}
              >
                {timer > 0 ? timer : "Get Code"}
              </Button>
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="new password"
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="confirm new password"
                      autoComplete="new-password webauthn"
                      inputMode="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col justify-start gap-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Verify"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/sign-in")}
              className="w-full"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ForgotPasswordPage;
