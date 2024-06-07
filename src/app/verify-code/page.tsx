"use client";
import React from "react";
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
import { toast } from "@/components/ui/use-toast";

interface FormInput {
  code: string;
  username: string;
}

interface Props {
  searchParams: {
    code: string;
    username: string;
  };
}

const VerifyCodePage = ({ searchParams }: Props) => {
  const form = useForm<FormInput>({
    defaultValues: {
      username: "",
      code: "",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(30);
  const [isSendingMail, setIsSendingMail] = React.useState(false);

  function resendVerificationCode(username: string) {
    setIsSendingMail(true);
    fetch(`/api/v1/users/resendMail?username=${username}`)
      .then((parsed) => parsed.json())
      .then((response) => {
        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });
        } else {
          toast({
            title: "Error",
            description: response.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: err.message || "Something went wrong!",
          variant: "destructive",
        });
      })
      .finally(() => setIsSendingMail(false));
  }

  function onSubmit(data: FormInput) {
    console.log(data);
  }

  React.useEffect(() => {
    if (searchParams.code) {
      form.setValue("code", searchParams.code);
    }
    if (searchParams.code) {
      form.setValue("username", searchParams.username);
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (timer > 0) {
      const runningTimer = setInterval(() => {
        setTimer((timer) => (timer -= 1));
      }, 1000);
      () => clearInterval(runningTimer);
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
            <CardTitle className="text-4xl font-extrabold tracking-tight text-center lg:text-5xl mb-2">
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
                disabled={timer > 0 || isSendingMail}
                onClick={() =>
                  resendVerificationCode(form.getValues("username"))
                }
                type="button"
              >
                &nbsp;{timer > 0 ? timer : "Resend"}
              </button>
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Verify"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default VerifyCodePage;
