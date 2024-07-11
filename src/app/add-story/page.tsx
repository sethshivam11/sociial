"use client";
import { Button } from "@/components/ui/button";
import {
  Brush,
  Check,
  CircleFadingPlus,
  Highlighter,
  Plus,
  Type,
  X,
} from "lucide-react";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

function Page() {
  const router = useRouter();
  const dragContainer = React.useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [stories, setStories] = React.useState<string[]>([]);
  const [text, setText] = React.useState<string>("");
  const [editable, setEditable] = React.useState<boolean>(false);
  const [textPosition, setTextPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 50, y: 50 });
  return (
    <div
      className="col-span-10 min-h-[100dvh] flex items-center justify-center bg-stone-900"
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
      <AlertDialog>
        <AlertDialogTrigger className="absolute right-2 top-2">
          <X size="35" />
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
      <div className="h-full flex flex-col py-8 px-3 max-sm:hidden">
        <ToggleGroup type="single" className="flex-col">
          <ToggleGroupItem value="" size="lg">
            <Type />
          </ToggleGroupItem>
          <ToggleGroupItem value="b" size="lg">
            <Brush />
          </ToggleGroupItem>
          <ToggleGroupItem value="c" size="lg">
            <Highlighter />
          </ToggleGroupItem>
          {stories.length !== 0 && (
            <ToggleGroupItem value="" size="lg">
              <Plus />
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </div>
      <div className="ring-1 ring-stone-800 flex items-center my-2 rounded-sm bg-black min-w-72 sm:h-[50rem] max-h-full h-fit sm:aspect-9/16 max-sm:h-full sm:w-fit w-full relative">
        {stories.length ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 left-0 p-2 m-1 w-fit h-fit rounded-full"
            >
              <X size="30" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 p-2 m-1 w-fit h-fit rounded-full"
            >
              <Check size="30" color="#3b82f6" />
            </Button>
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-6 w-full h-full border-dashed border-2 border-stone-500"
            ref={dragContainer}
          >
            <AlertDialog>
              <AlertDialogTrigger className="absolute right-2 top-2 sm:hidden">
                <X size="30" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Discard Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to discard this story? All changes will
                  be lost.
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
            <CircleFadingPlus size="60" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-stone-500">Drop your Photos and Images here</p>
              <Button>
                <Label
                  htmlFor="new-post"
                  className="w-full text-center text-semibold text-lg cursor-pointer rounded-xl"
                >
                  Select files
                </Label>
              </Button>
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        onChange={(e) => {
          const inputFiles = e.target.files;
          if (inputFiles === null) return;
          if (inputFiles.length > 10) {
            return toast({
              title: "Warning",
              description: "You can only upload 5 files at a time",
              variant: "destructive",
            });
          }
          for (let i = 0; i < inputFiles.length; i++) {
            const file = inputFiles.item(i);
            if (file?.type.includes("image")) {
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
                description:
                  "Only images are allowed, click the link below to upload videos",
                variant: "destructive",
              });
            }
          }
        }}
        id="new-post"
        accept="image/*"
        className="w-0 h-0 p-0 border-0 invisible"
        multiple
      />
    </div>
  );
}

export default Page;
