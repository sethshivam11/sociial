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
  CirclePlus,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  X,
} from "lucide-react";
import NextImage from "next/image";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";

function Page() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
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
  const [selectedFile, setSelectedFile] = React.useState<string>("");
  const [posts, setPosts] = React.useState<string[]>([]);

  const dragContainer = React.useRef<HTMLDivElement>(null);

  function handleFiles(inputFiles: FileList) {
    const limit = 5 - posts.length - inputFiles.length;
    const maxCap = limit > 0 ? inputFiles.length : 5 - posts.length;
    for (let i = 0; i < maxCap; i++) {
      const file = inputFiles.item(i);
      if (file && file.type.includes("image")) {
        const img = new Image();
        const imgURL = URL.createObjectURL(file);
        img.src = imgURL;
        img.onload = () => {
          setPosts((prevPosts) => [...prevPosts, imgURL]);
          if (!selectedFile) {
            setSelectedFile(imgURL);
          }
        };
      } else {
        toast({
          title: "Error",
          description: "Only images are allowed",
          variant: "destructive",
        });
      }
    }
  }

  function onSubmit({ caption }: z.infer<typeof formSchema>) {
    console.log({ caption, posts });
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
        const droppedFiles = e.dataTransfer.files;
        handleFiles(droppedFiles);
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
      <div className="h-full lg:w-3/4 w-full rounded-xl sm:pt-4 md:px-16 sm:px-6 px-0 ">
        <h1 className="font-bold text-2xl tracking-tight w-full text-center">
          Create New Post
        </h1>
        {posts.length ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="w-full h-full flex max-sm:flex-col items-center justify-center relative">
              <Carousel>
                <CarouselContent className="lg:max-w-[35vw] sm:max-w-[50vw] max-w-full aspect-square">
                  {posts.map((post, index) => (
                    <CarouselItem key={index}>
                      <NextImage
                        src={post}
                        alt=""
                        width="1080"
                        height="720"
                        className="object-cover overflow-hidden h-full w-full rounded-sm"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext />
                <CarouselPrevious />
              </Carousel>
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
                            placeholder="Enter a caption to image"
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
              <CirclePlus size="100" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-stone-500 text-sm">
                  Drag and Drop Photos and Images here
                </span>
                <Button size="lg">
                  <Label
                    htmlFor="new-post"
                    className="w-full text-center text-semibold text-lg cursor-pointer rounded-xl"
                  >
                    Select files
                  </Label>
                </Button>
                <Link href="/upload-video" className="p-2">
                  <Button variant="link" className="text-lg text-blue-500">
                    Upload Videos
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
            if (!inputFiles) return;
            handleFiles(inputFiles);
          }}
          id="new-post"
          accept="image/*"
          className="w-0 h-0 p-0 border-0 invisible"
          multiple
        />
      </div>
    </div>
  );
}

export default Page;
