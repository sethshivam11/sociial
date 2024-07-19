"use client";
import { Button } from "@/components/ui/button";
import {
  Brush,
  Check,
  CircleFadingPlus,
  CirclePlus,
  Highlighter,
  Type,
  X,
} from "lucide-react";
import React from "react";
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
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import NextImage from "next/image";
import Link from "next/link";

function Page() {
  const router = useRouter();
  const dragContainer = React.useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = React.useState<string>("");
  const [stories, setStories] = React.useState<string[]>([]);
  const [text, setText] = React.useState<string>("");
  const [brush, setBrush] = React.useState({ active: false, color: "white" });
  const [marker, setMarker] = React.useState({
    active: false,
    color: "yellow",
  });
  const [editable, setEditable] = React.useState<boolean>(false);
  const [textPosition, setTextPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 50, y: 50 });
  return (
    <div
      className="col-span-10 min-h-[100dvh] max-h-[100dvh] flex items-center justify-center bg-stone-900"
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
        if (droppedFiles.length > 5) {
          return toast({
            title: "Warning",
            description: "You can only upload 5 files at a time",
            variant: "destructive",
          });
        }
        for (let i = 0; i < droppedFiles.length; i++) {
          const file = droppedFiles.item(i);
          if (file?.type.includes("image")) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            if (droppedFiles.length >= 10) {
              const removedfirstItem = stories.shift();
              if (removedfirstItem) {
                setStories((prevStories) => [...prevStories, img.src]);
              } else {
                setStories([img.src]);
              }
            } else {
              setStories((prevStories) => [...prevStories, img.src]);
            }
            setSelectedFile(img.src);
          } else {
            toast({
              title: "Error",
              description:
                "Only images are allowed, click the link below to upload videos",
              variant: "destructive",
            });
          }
        }
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      {stories.length > 0 && (
        <>
          <AlertDialog>
            <AlertDialogTrigger className="absolute left-2 top-2 z-10 bg-transparent/50 rounded-full p-2">
              <X size="30" color="white" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Discard Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to discard this story? All changes will be
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
          <AlertDialog>
            <AlertDialogTrigger className="absolute right-2 top-2 z-10 bg-transparent/50 rounded-full p-2">
              <Check size="30" color="#3b82f6" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Post Story</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to post this story?
              </AlertDialogDescription>
              <AlertDialogFooter className="max-sm:flex-col mt-4">
                <AlertDialogAction onClick={() => router.push("/")}>
                  Post
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      <div
        className={`sm:h-full flex flex-col max-sm:flex-row sm:py-8 sm:px-3 gap-1 max-sm:absolute max-sm:bottom-2 z-10 ${
          stories.length ? "" : "hidden"
        }`}
      >
        <Button
          size="icon"
          variant="outline"
          className="bg-transparent/50 max-sm:border-0 sm:bg-stone-950 sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-transparent/50 p-3 h-fit w-fit sm:rounded-xl rounded-full"
        >
          <Type color="white" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-transparent/50 max-sm:border-0 sm:bg-stone-950 sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-transparent/50 p-3 h-fit w-fit sm:rounded-xl rounded-full"
        >
          <Brush color="white" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-transparent/50 max-sm:border-0 sm:bg-stone-950 sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-transparent/50 p-3 h-fit w-fit sm:rounded-xl rounded-full"
        >
          <Highlighter color="white" />
        </Button>
        <Menubar className="border-0 p-0 bg-transparent w-fit h-fit">
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Button className="bg-transparent/50 hover:bg-transparent/50 sm:hidden max-sm:border-0 p-3 h-fit w-fit rounded-full">
                <CirclePlus size="25" color="white" />
              </Button>
            </MenubarTrigger>
            <MenubarContent align="center" className="rounded-xl">
              {stories.map((story, index) => (
                <MenubarItem key={index}>
                  <NextImage
                    src={story}
                    width="50"
                    height="50"
                    alt=""
                    className="w-12 h-12 object-cover pointer-events-none select-none"
                  />
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="ring-1 ring-stone-800 flex items-center my-2 rounded-sm bg-black min-w-72 sm:h-[50rem] max-h-full h-fit sm:aspect-9/16 max-sm:h-full sm:w-fit w-full relative">
        {stories.length ? (
          <NextImage
            src={selectedFile}
            alt=""
            width="450"
            height="800"
            className="w-full h-full pointer-events-none select-none object-cover"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-6 w-full h-full border-dashed sm:border-2 border-stone-500"
            ref={dragContainer}
          >
            <Link href="/" className="absolute right-2 top-2 sm:hidden">
              <X size="30" color="white" />
            </Link>
            <CircleFadingPlus size="60" color="white" />
            <div className="flex flex-col items-center gap-3">
              <div>
                <h1 className="font-bold text-2xl tracking-tight w-full text-center text-white">
                  Add to Story
                </h1>
                <p className="text-stone-500">
                  Drop your Photos and Images here
                </p>
              </div>
              <Button className="text-black bg-stone-200 hover:bg-stone-400/90">
                <Label
                  htmlFor="new-story"
                  className="w-full text-center text-semibold cursor-pointer rounded-xl"
                >
                  Select files
                </Label>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div
        className={`h-full flex flex-col py-8 px-3 gap-1 max-sm:hidden ${
          stories.length ? "" : "hidden"
        }`}
      >
        {stories.map((file, index) => (
          <div
            key={index}
            className="w-20 h-20 relative overflow-hidden bg-transparent/50 rounded-lg border-2 flex items-center justify-center"
          >
            <button
              onClick={() => setSelectedFile(file)}
              className="w-full h-full"
            >
              <NextImage
                src={file}
                alt=""
                width="100"
                height="100"
                className="object-cover w-full h-full pointer-events-none select-none cursor-pointer"
              />
            </button>
            <button
              className="absolute top-1 right-1 bg-transparent/50 text-white rounded-full p-0.5"
              onClick={() => {
                setStories((prevStory) =>
                  prevStory.filter((_, i) => i !== index)
                );
                setSelectedFile(stories[0]);
              }}
            >
              <X size="16" />
            </button>
          </div>
        ))}
        <Button
          className={`rounded-xl mx-2 w-fit h-fit p-2 ${
            stories.length >= 5 ? "hidden" : ""
          }`}
          variant="ghost"
          size="icon"
        >
          <Label htmlFor="new-story" className="cursor-pointer">
            <CirclePlus size="50" />
          </Label>
        </Button>
      </div>
      <input
        type="file"
        onChange={(e) => {
          const inputFiles = e.target.files;
          if (inputFiles === null) return;
          if (inputFiles.length > 5) {
            e.target.files = null;
            return toast({
              title: "Warning",
              description: "You can only upload 5 files at a time",
              variant: "destructive",
            });
          }
          for (let i = 0; i < inputFiles.length; i++) {
            const file = inputFiles.item(i);
            if (file && file.type.includes("image")) {
              const img = new Image();
              img.src = URL.createObjectURL(file);
              if (inputFiles.length >= 5) {
                const removedfirstItem = stories.shift();
                if (removedfirstItem) {
                  setStories((prevStories) => [...prevStories, img.src]);
                } else {
                  setStories([img.src]);
                }
              } else {
                setStories((prevStories) => [...prevStories, img.src]);
              }
              setSelectedFile(img.src);
            } else {
              toast({
                title: "Error",
                description: "Only images are allowed",
                variant: "destructive",
              });
            }
          }
        }}
        id="new-story"
        accept="image/*"
        className="w-0 h-0 p-0 border-0 invisible"
        multiple
      />
    </div>
  );
}

export default Page;
