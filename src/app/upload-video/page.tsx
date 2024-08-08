"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { MonitorPlay, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { captionSchema } from "@/schemas/postSchema";

function Page() {
  const router = useRouter();
  const formSchema = z.object({
    caption: captionSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

  const [videoFile, setVideoFile] = React.useState("");
  const dragContainer = React.useRef<HTMLDivElement>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div
      className="sm:container flex flex-col items-center justify-start h-full min-h-[100dvh] col-span-10 px-3 py-6"
      onDragEnter={() => {
        dragContainer.current?.classList.remove(
          "border-stone-300",
          "dark:border-stone-700"
        );
        dragContainer.current?.classList.add(
          "border-stone-800",
          "dark:border-stone-200"
        );
      }}
      onDragLeave={() => {
        dragContainer.current?.classList.remove(
          "border-stone-800",
          "dark:border-stone-200"
        );
        dragContainer.current?.classList.add(
          "border-stone-300",
          "dark:border-stone-700"
        );
      }}
      onDrop={(e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile.type.includes("video")) {
          return toast({
            title: "Warning",
            description: "Only video files are allowed",
            variant: "destructive",
          });
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const video = event.target?.result;
          if (video) {
            setVideoFile(video.toString());
          }
        };
        reader.readAsDataURL(droppedFile);
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      <AlertDialog>
        <AlertDialogTrigger className="absolute right-2 top-2">
          <X size="35" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Discard Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to discard this post? All changes will be
            lost.
          </AlertDialogDescription>
          <AlertDialogFooter className="max-sm:flex-col mt-4">
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => router.push("/")}
            >
              Discard
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="h-full lg:w-3/4 w-full rounded-xl sm:pt-4 md:px-16 sm:px-6 px-0 pb-28">
        <h1 className="font-bold text-2xl tracking-tight w-full text-center mb-6">
          Create Video Post
        </h1>
        {videoFile.length ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="w-full h-full flex max-sm:flex-col items-center justify-center relative">
              <video
                src={videoFile}
                className="min-h-40 min-w-40 sm:max-w-[70%] max-w-full rounded-sm"
                autoPlay
                controls
                controlsList="nodownload"
              ></video>
            </div>
            <div className="flex flex-col items-center justify-start gap-4 w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 sm:w-2/3 w-full"
                >
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Caption</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a caption to video"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-sm">
                          {(form.watch("caption") || "").length <= 1000 ? (
                            form.watch("caption")?.length
                          ) : (
                            <span className="text-red-500">
                              {form.watch("caption")?.length}
                            </span>
                          )}
                          /1000
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Button
                className="rounded-xl text-lg"
                size="lg"
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                Post
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full border-2 border-dashed bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-700 mt-10 z-10 rounded-2xl"
            ref={dragContainer}
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <MonitorPlay size="100" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-stone-500 text-sm">
                  Drag and Drop Video files Here
                </span>
                <Button size="lg">
                  <Label
                    htmlFor="new-post"
                    className="w-full text-center text-semibold text-lg cursor-pointer rounded-xl"
                  >
                    Select files
                  </Label>
                </Button>
                <Link href="/new-post" className="p-2">
                  <Button variant="link" className="text-lg text-blue-500">
                    Upload Photos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <input
          type="file"
          onChange={(e) => {
            const inputFiles = e.target.files;
            if (inputFiles === null) return;
            const file = inputFiles[0];
            const reader = new FileReader();
            reader.onload = (event) => {
              const video = event.target?.result;
              if (video) {
                const videoElement = document.getElementById("videoElement");
                if (videoElement) {
                  videoElement.setAttribute("src", video.toString());
                }
                setVideoFile(video.toString());
              }
            };
            reader.readAsDataURL(file);
          }}
          id="new-post"
          accept="video/*"
          className="w-0 h-0 p-0 border-0 invisible"
        />
      </div>
    </div>
  );
}

export default Page;
