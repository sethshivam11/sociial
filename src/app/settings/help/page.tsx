"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { descriptionSchema, titleSchema } from "@/schemas/reportSchema";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { submitReport } from "@/lib/store/features/slices/reportSlice";
import { toast } from "@/components/ui/use-toast";

function Page() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const [image, setImage] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const formSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit({ title, description }: z.infer<typeof formSchema>) {
    dispatch(
      submitReport({
        title,
        description,
        image,
        kind: "problem",
        user: user._id,
      })
    ).then((response) => {
      if (response.payload?.success) {
        setSubmitted(true);
        form.reset();
        setImage(null);
      } else {
        toast({
          title: "Cannot submit your problem",
          description: response.payload?.message || "Please try again later",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto min-h-[90dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full max-sm:pb-10">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-2 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Help & Support
      </h1>
      {submitted ? (
        <div className="flex flex-col h-full sm:w-2/3 w-full mx-auto px-4 text-center items-center justify-center gap-3">
          <Info size="50" />
          <h1 className="text-2xl tracking-tight font-bold">
            Problem Submitted
          </h1>
          <p className="text-stone-500">
            We&apos;re very sorry for your bad experience. We will resolve your
            issue as soon as possible.
          </p>
          <Button
            variant="link"
            className="text-blue-500"
            onClick={() => setSubmitted(false)}
          >
            Submit another problem
          </Button>
        </div>
      ) : (
        <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5 mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your problem?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Errors or issues you are facing"
                        inputMode="text"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explain your problem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your problem in detail"
                        inputMode="text"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Images
                      <span className="text-stone-500">&nbsp;(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Images"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setImage(e.target.files[0]);
                          } else {
                            setImage(null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg">
                {loading ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default Page;
