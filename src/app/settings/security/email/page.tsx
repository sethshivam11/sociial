"use client";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { toast } from "@/components/ui/use-toast";
import {
  resendVerificationCode,
  updateEmail,
} from "@/lib/store/features/slices/userSlice";

function Page() {
  const dispatch = useAppDispatch();
  const formSchema = z.object({
    email: emailSchema,
    otp: verificationCodeSchema,
  });

  const { user, isSendingMail, loading } = useAppSelector(
    (state) => state.user
  );
  const [timer, setTimer] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
    },
  });

  function onSubmit({ email, otp }: z.infer<typeof formSchema>) {
    dispatch(updateEmail({ email, code: otp.toString() })).then((response) => {
      if (!response.payload.success) {
        toast({
          title: "Error",
          description: response.payload.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        form.resetField("otp");
        toast({
          title: "Success",
          description: response.payload.message,
        });
      }
    });
  }

  function sendMail() {
    if (
      form.watch("email") === user.email ||
      !form.watch("email") ||
      isSendingMail
    )
      return;
    try {
      z.object({
        email: emailSchema,
      }).parse({ email: form.watch("email") });
      form.clearErrors();
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setError("email", { message: error.errors[0].message });
      }
    }
    dispatch(
      resendVerificationCode({
        username: user.username,
        email: form.watch("email"),
      })
    ).then((response) => {
      if (response.payload.success) {
        setTimer(60);
        toast({
          title: "Success",
          description: response.payload.message,
        });
      } else {
        toast({
          title: "Error",
          description: response.payload.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    form.setValue("email", user.email);
  }, [form, user.email]);

  useEffect(() => {
    if (timer > 0) {
      const runningTimer = setInterval(() => {
        setTimer((timer) => (timer -= 1));
      }, 1000);
      return () => clearInterval(runningTimer);
    }
  }, [timer]);

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
                      placeholder="example@mail.com"
                      inputMode="text"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-w-24"
                    disabled={
                      form.watch("email") === user.email ||
                      timer > 0 ||
                      isSendingMail
                    }
                    onClick={sendMail}
                  >
                    {isSendingMail ? (
                      <Loader2 className="animate-spin" />
                    ) : timer > 0 ? (
                      timer
                    ) : (
                      "Get OTP"
                    )}
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
            {loading ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
