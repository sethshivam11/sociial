"use client";
import { Button } from "@/components/ui/button";
import {
  Check,
  Circle,
  CircleFadingPlus,
  CirclePlus,
  Eraser,
  Paintbrush,
  Pencil,
  Plus,
  RectangleVertical,
  SquareIcon,
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
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";

interface TextItem {
  text: string;
  size: number;
  color: string;
  x: number;
  y: number;
}

function Page() {
  const router = useRouter();
  const dragContainer = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  const colors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#ffff00",
    "#0000ff",
  ];

  const [selectedFile, setSelectedFile] = React.useState<string>("");
  const [stories, setStories] = React.useState<string[]>([]);
  const [textItems, setTextItems] = React.useState<TextItem[]>([]);
  const [strokeWidth, setStrokeWidth] = React.useState(5);
  const [brush, setBrush] = React.useState(false);
  const [color, setColor] = React.useState(colors[0]);
  const [eraseMode, setEraseMode] = React.useState(false);
  function handleEraserClick() {
    if (eraseMode) {
      setEraseMode(false);
      return canvasRef.current?.eraseMode(false);
    }
    setBrush(false);
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }
  function handlePencilClick() {
    if (brush) {
      return setBrush(false);
    }
    setBrush(true);
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  }

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
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className={`sm:h-full flex flex-col max-sm:flex-row sm:py-8 sm:px-3 gap-1 justify-between max-sm:absolute max-sm:bottom-2 z-10 ${
          stories.length ? "" : "hidden"
        }`}
      >
        <div className="flex sm:flex-col gap-1">
          <Button
            size="icon"
            variant="outline"
            className={`bg-transparent/50 max-sm:border-0 sm:bg-stone-950 sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-transparent/50 p-3 h-fit w-fit sm:rounded-xl rounded-full`}
          >
            <Type color="white" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`bg-transparent/50 max-sm:border-0 sm:bg-stone-950 sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-transparent/50 p-3 h-fit w-fit sm:rounded-xl rounded-full ring-stone-200 ${
              brush ? "bg-stone-800 ring-2 hover:bg-stone-800" : "ring-0"
            }`}
            onClick={handlePencilClick}
          >
            <Pencil color="white" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`bg-transparent/50 max-sm:border-0 sm:bg-stone-950 sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-transparent/50 p-3 h-fit w-fit sm:rounded-xl rounded-full ring-stone-200 ${
              eraseMode ? "bg-stone-800 ring-2 hover:bg-stone-800" : "ring-0"
            }`}
            onClick={handleEraserClick}
          >
            <Eraser color="white" />
          </Button>
        </div>
        <div className="flex max-sm:fixed max-sm:px-2 bottom-1 left-1 flex-col gap-1">
          {brush &&
            colors.map((clr, index) => (
              <Button
                size="icon"
                variant="outline"
                className={`bg-transparent/50
                  max-sm:bg-transparent sm:bg-stone-950 max-sm:border-transparent sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-stone-500 p-0 sm:p-3 h-fit w-fit rounded-full ${
                    color === clr
                      ? "sm:ring-1 sm:ring-stone-200 max-sm:bg-stone-500"
                      : ""
                  }`}
                onClick={() => setColor(clr)}
                key={index}
              >
                <Circle
                  fill={clr}
                  color="#78716c"
                  className={`inline-block rounded-full sm:w-6 w-8 sm:h-6 h-8`}
                />
              </Button>
            ))}
        </div>
        <Menubar className="border-0 p-0 bg-transparent rounded-xl min-w-10 w-fit h-fit sm:hidden">
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Button className="bg-transparent/50 hover:bg-transparent/50 sm:hidden max-sm:border-0 p-3 h-fit rounded-full">
                <CirclePlus size="25" color="white" />
              </Button>
            </MenubarTrigger>
            <MenubarContent
              align="center"
              className="flex-row bg-transparent/50 border-0 rounded-xl min-w-10"
            >
              {stories.map((story, index) => (
                <MenubarItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedFile === story) {
                      setStories((prevStory) =>
                        prevStory.filter((_, i) => i !== index)
                      );
                      const idx = index === 0 ? 1 : 0;
                      setSelectedFile(stories[idx]);
                    } else setSelectedFile(story);
                  }}
                  className="hover:bg-transparent/20 rounded-lg cursor-pointer relative"
                >
                  {story === selectedFile && (
                    <X
                      strokeWidth="1.5"
                      className="absolute bg-transparent/50 w-14 h-14"
                    />
                  )}
                  <NextImage
                    src={story}
                    width="50"
                    height="50"
                    alt=""
                    className="w-14 h-14 object-cover pointer-events-none select-none"
                  />
                </MenubarItem>
              ))}
              <MenubarItem className="focus:bg-transparent" asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-full h-14 bg-transparent hover:bg-transparent cursor-pointer ${
                    stories.length >= 5 ? "hidden" : ""
                  }`}
                  onClick={() => inputRef.current?.click()}
                >
                  <Plus size="35" />
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="ring-1 ring-stone-800 flex items-center my-2 rounded-sm bg-black min-w-72 sm:h-[50rem] max-h-full h-fit sm:aspect-9/16 max-sm:h-full sm:w-fit w-full relative">
        {stories.length > 0 && (
          <>
            <AlertDialog>
              <AlertDialogTrigger className="absolute left-2 top-2 z-10 bg-transparent/50 rounded-full p-2">
                <X size="30" color="white" />
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
        {stories.length ? (
          <ReactSketchCanvas
            ref={canvasRef}
            backgroundImage={selectedFile}
            strokeColor={color}
            strokeWidth={brush ? strokeWidth : 0}
            eraserWidth={strokeWidth * 2}
            preserveBackgroundImageAspectRatio="xMidYMid"
            exportWithBackgroundImage={true}
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
                <h1 className="font-semibold text-2xl w-full text-center text-white">
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
        className={`h-full flex flex-col sm:justify-between justify-end max-sm:absolute max-sm:right-0 py-8 px-3 gap-1 ${
          stories.length ? "" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-1 max-sm:hidden">
          {stories.map((story, index) => (
            <div
              key={index}
              className="w-20 h-20 relative overflow-hidden bg-transparent/50 rounded-lg border-2 flex items-center justify-between"
            >
              <button
                onClick={() => {
                  setSelectedFile(story);
                  canvasRef.current?.resetCanvas();
                }}
                className="w-full h-full"
              >
                <NextImage
                  src={story}
                  alt=""
                  width="100"
                  height="100"
                  className="object-cover w-full h-full pointer-events-none select-none cursor-pointer"
                />
              </button>
              <button
                className="absolute top-1 right-1 bg-transparent/50 text-white rounded-full p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setStories((prevStory) =>
                    prevStory.filter((_, i) => i !== index)
                  );
                  if (selectedFile === story) {
                    const idx = index === 0 ? 1 : 0;
                    setSelectedFile(stories[idx]);
                  }
                }}
              >
                <X size="16" />
              </button>
            </div>
          ))}
          <Button
            className={`rounded-xl mx-2 w-fit h-fit p-2 bg-stone-800 hover:bg-stone-900 ${
              stories.length >= 5 ? "hidden" : ""
            }`}
            variant="ghost"
            size="icon"
          >
            <Label htmlFor="new-story" className="cursor-pointer">
              <CirclePlus size="50" color="white" />
            </Label>
          </Button>
        </div>
        {(brush || eraseMode) && (
          <div className="flex flex-col items-center justify-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className={`bg-transparent/50
                  sm:bg-stone-950 max-sm:border-transparent sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-stone-500 p-3 rounded-full ${
                    strokeWidth === 3
                      ? "sm:ring-1 sm:ring-stone-200 max-sm:bg-stone-500"
                      : ""
                  }`}
              onClick={() => setStrokeWidth(3)}
            >
              <Circle
                color="#78716c"
                fill={eraseMode ? "white" : color}
                className={`inline-block rounded-full sm:w-6 w-8 sm:h-6 h-8`}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={`bg-transparent/50
                  sm:bg-stone-950 max-sm:border-transparent sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-stone-500 p-2 rounded-full ${
                    strokeWidth === 6
                      ? "sm:ring-1 sm:ring-stone-200 max-sm:bg-stone-500"
                      : ""
                  }`}
              onClick={() => setStrokeWidth(6)}
            >
              <Circle
                color="#78716c"
                fill={eraseMode ? "white" : color}
                className={`inline-block rounded-full sm:w-6 w-8 sm:h-6 h-8`}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={`bg-transparent/50
                  sm:bg-stone-950 max-sm:border-transparent sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-stone-500 p-1 rounded-full ${
                    strokeWidth === 9
                      ? "sm:ring-1 sm:ring-stone-200 max-sm:bg-stone-500"
                      : ""
                  }`}
              onClick={() => setStrokeWidth(9)}
            >
              <Circle
                color="#78716c"
                fill={eraseMode ? "white" : color}
                className={`inline-block rounded-full sm:w-6 w-8 sm:h-6 h-8`}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={`bg-transparent/50
                  max-sm:bg-transparent max-sm:hover:bg-transparent sm:bg-stone-950 max-sm:border-transparent sm:border-stone-800 sm:hover:bg-stone-800 hover:bg-stone-500 p-1 sm:p-3 h-fit w-fit rounded-xl ${
                    eraseMode ? "visible" : "invisible"
                  }`}
              onClick={() => canvasRef.current?.resetCanvas()}
            >
              <Paintbrush color="white" />
            </Button>
          </div>
        )}
      </div>
      {stories.length === 0 && (
        <Link href="/" className="absolute right-2 top-2 max-sm:hidden">
          <X size="30" color="white" />
        </Link>
      )}
      <input
        type="file"
        ref={inputRef}
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
          e.target.files = null;
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
