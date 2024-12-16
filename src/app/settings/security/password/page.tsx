"use client";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { passwordSchema } from "@/schemas/userSchema";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { updatePassword } from "@/lib/store/features/slices/userSlice";
import { toast } from "@/components/ui/use-toast";
import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import { notFound } from "next/navigation";

function Page() {
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.user);
  const formSchema = z
    .object({
      currentPassword: passwordSchema,
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password should be different from current password",
      path: ["newPassword"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [showPwd, setShowPwd] = useState(false);

  function onSubmit({
    currentPassword,
    newPassword,
  }: z.infer<typeof formSchema>) {
    dispatch(
      updatePassword({
        oldPassword: currentPassword,
        newPassword,
      })
    ).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot update password",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        form.reset();
        toast({
          title: "Success",
          description:
            response.payload?.message || "Password updated successfully",
        });
      }
    });
  }

  if (user.loginType === "google") {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="sm:w-2/3 text-lg tracking-tight font-semibold w-full text-left my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings/security">
          <ChevronLeft />
        </Link>
        Change Password
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="sm:w-2/3 w-3/4 space-y-5 mt-3"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Current Password"
                    inputMode="text"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Password"
                    inputMode="text"
                    type={showPwd ? "text" : "password"}
                    autoComplete="new-password"
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
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm New Password"
                    inputMode="text"
                    type={showPwd ? "text" : "password"}
                    autoComplete="off"
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
          <Button
            type="submit"
            size="lg"
            disabled={
              loading ||
              form.watch("currentPassword").length < 6 ||
              form.watch("newPassword").length < 6 ||
              form.watch("confirmPassword").length < 6
            }
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
