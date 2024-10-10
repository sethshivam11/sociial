"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { usernameSchema, verificationCodeSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  resendVerificationCode,
  verifyCode,
} from "@/lib/store/features/slices/userSlice";
import { useRouter } from "next/navigation";

interface Props {
  searchParams: {
    code: string;
    username: string;
  };
}

function VerifyCodePage({ searchParams }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSendingMail, loading } = useAppSelector((state) => state.user);
  const formSchema = z.object({
    username: z.string(),
    code: verificationCodeSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      code: 0,
    },
  });

  const [timer, setTimer] = useState(0);

  async function handleSendCode() {
    const response = await dispatch(
      resendVerificationCode({ username: form.watch("username") })
    );
    if (response.payload.success) {
      toast({
        title: "Verification code sent successfully",
      });
      setTimer(60);
    } else {
      toast({
        title: response.payload.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      usernameSchema.parse(data.username);
      const response = await dispatch(verifyCode(data));
      if (response.payload.success) {
        router.push("/");
      } else {
        toast({
          title: response.payload.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid username",
          description: error.errors[0].message || "",
          variant: "destructive",
        });
      } else {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    try {
      if (searchParams.username) {
        form.setValue("username", searchParams.username);
      }
      if (searchParams.code) {
        verificationCodeSchema.parse(searchParams.code);
        form.setValue("code", parseInt(searchParams.code));
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
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
            <CardTitle className="sm:text-4xl text-3xl font-extrabold tracking-tight text-center lg:text-5xl mb-2">
              Verify your account
            </CardTitle>
            <CardDescription>
              Please enter the verification code sent to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="verification code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                      {...field}
                      value={form.watch("code") === 0 ? "" : form.watch("code")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p>
              Not recieved email?
              <button
                className="text-blue-500 disabled:opacity-80 mt-2"
                disabled={timer > 0 || isSendingMail || loading}
                onClick={handleSendCode}
                type="button"
              >
                &nbsp;{timer > 0 ? timer : "Resend"}
              </button>
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Verify"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default VerifyCodePage;
