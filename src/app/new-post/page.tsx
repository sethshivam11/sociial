"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronsLeftRight, CirclePlus, X } from "lucide-react";
import * as NImage from "next/image";
import Link from "next/link";
import React from "react";
import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

function Page() {
  const [files, setFiles] = React.useState<string[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<string>("");
  const [aspect, setAspect] = useState(1 / 1); // 16/9, 4/5, 1/1
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0);

  const dragContainer = React.useRef<HTMLDivElement>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {};

  return (
    <div
      className="sm:container flex flex-col items-center justify-start max-h-[100dvh] min-h-[100dvh] col-span-10 sm:py-6"
      onDragEnter={() => {
        dragContainer.current?.classList.remove(
          "border-stone-300",
          "dark:border-stone-950"
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
          "dark:border-stone-9500"
        );
      }}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file.type.includes("image")) {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          if (files.length >= 5) {
            const removedfirstItem = files.shift();
            if (removedfirstItem) {
              setFiles([...files, img.src]);
            } else {
              setFiles([img.src]);
            }
          } else {
            setFiles([...files, img.src]);
          }
          setSelectedFile(img.src);
        }
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      <Link href="/" className="absolute right-2 top-2">
        <X size="35" />
      </Link>
      <div className="h-full lg:w-3/4 w-full rounded-xl sm:pt-4 md:px-16 sm:px-6 px-0 pb-28">
        <h1 className="font-bold text-2xl tracking-tight w-full text-center my-2">
          Create New Post
        </h1>
        {files.length ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 rounded-xl">
            <div className="w-full h-full relative">
              <Cropper
                image={selectedFile}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
                classes={{
                  cropAreaClassName: "cursor-grab active:cursor-grabbing",
                }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-evenly overflow-x-auto overflow-y-hidden h-fit">
              {files.map((file, index) => (
                <button key={index} onClick={() => setSelectedFile(file)}>
                  <NImage.default
                    src={file}
                    alt=""
                    width="100"
                    height="100"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-evenly">
              <Button size="icon" className="rounded-xl">
                <ChevronsLeftRight size="20" className="rotate-45" />
              </Button>
              <Slider
                defaultValue={[zoom * 10]}
                min={1}
                max={100}
                step={1}
                className="w-60"
                onValueChange={(value) => {setZoom(value[0]); console.log(value)}}
              />
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full border-2 border-dashed bg-stone-100 dark:bg-stone-900 border-stone-300 dark:ring-stone-950 mt-10 z-10 rounded-2xl"
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
                <input
                  type="file"
                  onChange={(e) => {
                    const inputFiles = e.target.files;
                    console.log(inputFiles);
                    if (inputFiles) {
                      Array.from(files).forEach((file) => {
                        // const img = new Image();
                        // img.src = URL.createObjectURL(file);
                        // setFiles([...files, img.src]);
                        // setSelectedFile(img.src);
                        console.log(file);
                      });
                    }
                  }}
                  id="new-post"
                  accept="image/*,video/*"
                  className="w-0 h-0 p-0 border-0"
                  multiple
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
