"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ImageIcon, Loader2, X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
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
import { AppDispatch, useAppSelector } from "@/lib/store/store";
import { createPost, setLoading } from "@/lib/store/features/slices/postSlice";

function Page() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppSelector((state) => state.user);
  const { loading } = useAppSelector((state) => state.post);
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
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [posts, setPosts] = useState<string[]>([]);
  const [postDialog, setPostDialog] = useState(false);

  const dragContainer = useRef<HTMLDivElement>(null);

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

  function handleRemoveImage(index: number) {
    setPosts((prevPosts) => prevPosts.filter((_, i) => i !== index));
    if (selectedFile === posts[index]) {
      setSelectedFile(posts[index + 1] || "");
    }
  }

  async function onSubmit({ caption }: z.infer<typeof formSchema>) {
    if (!user._id) return;
    dispatch(setLoading(true));
    let files: File[] = [];
    await Promise.all(
      posts.map(async (post) => {
        const response = await fetch(post);
        const blob = await response.blob();
        const image = new File([blob], `${Date.now()}.jpg`, {
          type: blob.type,
        });
        files.push(image);
      })
    );
    if (files.length === 0) return dispatch(setLoading(false));
    dispatch(
      createPost({
        caption: caption || "",
        media: files,
        user: user._id,
      })
    ).then((response) => {
      if (response.payload?.success) {
        router.push("/");
      } else {
        toast({
          title: "Cannot post",
          description:
            response.payload?.message ||
            "An error occurred while creating the post",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div
      className="sm:container flex flex-col items-center h-full min-h-[100dvh] col-span-10 px-3 py-6"
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
      onDragOver={(e) => e.preventDefault()}
    >
      {posts.length > 1 && (
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
      {posts.length ? (
        <div className="lg:w-3/4 w-full rounded-xl sm:pt-4 md:px-16 sm:px-6 px-0 pb-1">
          <h1 className="font-bold text-2xl tracking-tight w-full text-center py-2">
            New Post
          </h1>
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 py-2">
            <div className="w-full h-full flex max-sm:flex-col items-center justify-center relative">
              <Carousel>
                <CarouselContent className="lg:max-w-[35vw] sm:max-w-[50vw] max-w-full aspect-square">
                  {posts.map((post, index) => (
                    <CarouselItem key={index} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-transparent/30 rounded-full"
                        onClick={() => handleRemoveImage(index)}
                        disabled={loading}
                      >
                        <X />
                      </Button>
                      <NextImage
                        src={post}
                        alt=""
                        width="800"
                        height="800"
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
              <div className="flex gap-2">
                <Button
                  type="submit"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Post"}
                </Button>
                {posts.length < 5 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                  >
                    Add more
                  </Button>
                )}
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
            <ImageIcon size="100" />
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-bold tracking-tighter text-2xl">
                Post Photos
              </h1>
              <span className="text-stone-500 text-sm">
                Drag and Drop Photos and Images here
              </span>
              <Button onClick={() => inputRef.current?.click()}>
                Select files
              </Button>
              <Link href="/upload-video" className="p-2">
                <Button variant="link" className="text-blue-500">
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
        ref={inputRef}
        id="new-post"
        accept="image/*"
        className="w-0 h-0 p-0 border-0 invisible"
        multiple
      />
    </div>
  );
}

export default Page;
