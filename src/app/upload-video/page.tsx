"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  ChevronsLeftRight,
  FileVideo,
  Film,
  MonitorPlay,
  MonitorUp,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Tv,
  X,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import Cropper, { Area } from "react-easy-crop";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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

function Page() {
  const router = useRouter();
  const formSchema = z.object({
    caption: z
      .string()
      .max(1000, {
        message: "Caption should not exceed 1000 characters",
      })
      .optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });
  const [videoFile, setVideoFile] = React.useState<{
    video: string;
    area: Area;
  }>({
    video: "",
    area: { x: 0, y: 0, width: 0, height: 0 },
  });
  const [aspect, setAspect] = React.useState(1 / 1);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  const dragContainer = React.useRef<HTMLDivElement>(null);

  const onCropComplete = (croppedArea: Area, _: Area) => {
    setVideoFile((prev) => ({ ...prev, area: croppedArea }));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
            setVideoFile({
              video: video.toString(),
              area: { x: 0, y: 0, width: 0, height: 0 },
            });
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
        {videoFile.video.length ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="w-full h-full flex max-sm:flex-col items-center justify-center gap-3">
              <div className="w-full h-full relative rounded-xl">
                <Cropper
                  video={videoFile.video}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={false}
                  classes={{
                    cropAreaClassName:
                      "cursor-grab active:cursor-grabbing w-full h-full  ",
                    containerClassName:
                      "hover:cursor-grab active:cursor-grabbing rounded-xl dark:bg-white",
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-evenly">
              <Menubar className="border-0">
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button size="icon" className="rounded-xl">
                      <ChevronsLeftRight size="20" className="rotate-45" />
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent className="rounded-xl min-w-32">
                    <MenubarItem
                      className="flex items-center justify-between p-2 rounded-lg"
                      onClick={() => setAspect(1 / 1)}
                    >
                      1:1
                      <Square />
                    </MenubarItem>
                    <MenubarItem
                      className="flex items-center justify-between p-2 rounded-lg"
                      onClick={() => setAspect(4 / 5)}
                    >
                      4:5
                      <RectangleVertical />
                    </MenubarItem>
                    <MenubarItem
                      className="flex items-center justify-between p-2 rounded-lg"
                      onClick={() => setAspect(16 / 9)}
                    >
                      16:9
                      <RectangleHorizontal />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
              <div className="px-2 py-4 rounded-lg mx-2 border">
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.01}
                  className="w-60"
                  onValueChange={(value) => setZoom(value[0])}
                />
              </div>
            </div>
            <div className="flex max-sm:flex-col items-center justify-start gap-4 w-full">
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
                Next
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
                setVideoFile({
                  video: video.toString(),
                  area: { x: 0, y: 0, width: 0, height: 0 },
                });
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
