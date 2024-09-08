"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, MonitorPlay, X } from "lucide-react";
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
import generateMediaThumbnail from "browser-thumbnail-generator";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  createPost,
  createVideoPost,
  setLoading,
} from "@/lib/store/features/slices/postSlice";

function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.user);
  const formSchema = z.object({
    caption: captionSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

  const [video, setVideo] = React.useState("");
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const dragContainer = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function onSubmit({ caption }: z.infer<typeof formSchema>) {
    if (!videoFile) return;
    if (!user._id) return;
    generateMediaThumbnail({
      file: videoFile,
      width: 800,
      height: 800,
      maintainAspectRatio: true,
    }).then(async (response) => {
      dispatch(setLoading(true));
      const url = URL.createObjectURL(response.thumbnail);
      let files: {
        video: File | null;
        thumbnail: File | null;
      } = {
        video: null,
        thumbnail: null,
      };
      await Promise.all(
        [video, url].map(async (post) => {
          const res = await fetch(post);
          const blob = await res.blob();
          const file = new File(
            [blob],
            `${Date.now()}.${blob.type.split("/")[1]}`,
            {
              type: blob.type,
            }
          );
          if (blob.type.includes("video")) files.video = file;
          else files.thumbnail = file;
        })
      );
      if (!files.thumbnail || !files.video) return dispatch(setLoading(false));
      dispatch(
        createVideoPost({
          caption: caption || "",
          media: [files.video, files.thumbnail],
          user: user._id,
        })
      ).then((response) => {
        if (response.payload?.success) {
          router.push("/");
        } else {
          toast({
            title: "Error",
            description:
              response.payload?.message ||
              "An error occurred while creating the post",
            variant: "destructive",
          });
        }
      });
    });
  }

  return (
    <div
      className="sm:container flex flex-col items-center justify-start min-h-[100dvh] h-full col-span-10 px-3 py-6"
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
            setVideo(video.toString());
          }
        };
        reader.readAsDataURL(droppedFile);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {video.length > 1 && (
        <AlertDialog>
          <AlertDialogTrigger
            className="absolute right-2 top-2 disabled:text-stone-500 disabled:cursor-not-allowed"
            disabled={loading}
          >
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
      )}
      {video.length ? (
        <div className="lg:w-3/4 w-full rounded-xl sm:pt-4 md:px-16 sm:px-6 px-0 pb-2">
          <h1 className="font-bold text-2xl tracking-tight w-full text-center py-2">
            Video Post
          </h1>
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 py-2">
            <div className="flex max-sm:flex-col items-center justify-center relative h-full w-full py-6">
              <video
                src={video}
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
              <div className="flex gap-2">
                <Button
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Post"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setVideo("")}
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-full border-2 border-dashed bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-700 z-10 rounded-2xl relative"
          ref={dragContainer}
        >
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 max-sm:hover:bg-transparent"
            >
              <X size="25" />
            </Button>
          </Link>
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <MonitorPlay size="100" />
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-bold tracking-tighter text-2xl">
                Post Videos
              </h1>
              <span className="text-stone-500 text-sm">
                Drag and Drop Video file here
              </span>
              <Button onClick={() => inputRef.current?.click()}>
                Select file
              </Button>
              <Link href="/new-post" className="p-2">
                <Button variant="link" className="text-blue-500">
                  Upload Photos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          const inputFiles = e.target.files;
          if (inputFiles === null) return;
          const file = inputFiles[0];
          setVideoFile(file);
          const reader = new FileReader();
          reader.onload = (event) => {
            const video = event.target?.result;
            if (video) {
              const videoElement = document.getElementById("videoElement");
              if (videoElement) {
                videoElement.setAttribute("src", video.toString());
              }
              setVideo(video.toString());
            }
          };
          reader.readAsDataURL(file);
        }}
        id="new-post"
        accept="video/mp4"
        className="w-0 h-0 p-0 border-0 invisible"
      />
    </div>
  );
}

export default Page;
