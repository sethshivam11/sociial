"use client";
import {useState} from "react";
import {
  CameraIcon,
  ImageIcon,
  MapPin,
  MicIcon,
  Paperclip,
  FileIcon,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import CameraDialog from "@/components/CameraDialog";
import MediaDialog from "@/components/MediaDialog";
import AudioDialog from "@/components/AudioDialog";
import DocumentDialog from "@/components/DocumentDialog";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/lib/store/store";
import { sendMessage } from "@/lib/store/features/slices/messageSlice";
import { toast } from "./ui/use-toast";

interface Props {
  message: string;
  chatId: string;
}

function MessageActions({ message, chatId }: Props) {
  const dispatch = useAppDispatch();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);

  function shareLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const content = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
        dispatch(sendMessage({ content, chatId, kind: "location" })).then(
          (response) => {
            if (!response.payload?.success) {
              toast({
                title: "Error",
                description: "Something went wrong, while sharing location",
                variant: "destructive",
              });
            }
          }
        );
      },
      (err) => {
        let description = "Browser doesn't support location sharing";
        if (err.code === 1) {
          description =
            "Please allow location permissions sharing to share your location";
        } else if (err.code === 2 || err.code === 3) {
          description = "Please check your network or GPS settings";
        } else {
          description = "Request timed out. Please try again";
        }
        console.log(err);
        toast({
          title: "Cannot access location",
          description,
          variant: "destructive",
        });
      }
    );
  }

  return (
    <>
      <Menubar className="border-0 p-0">
        <MenubarMenu>
          {message.length === 0 && (
            <MenubarTrigger asChild>
              <Button type="button" variant="outline">
                <Paperclip />
              </Button>
            </MenubarTrigger>
          )}
          <MenubarContent align="center" className="rounded-xl">
            <MenubarItem
              className="rounded-lg py-2"
              onClick={() => setMediaOpen(true)}
            >
              <ImageIcon />
              &nbsp;Photos & Videos
            </MenubarItem>
            <MenubarItem
              className="rounded-lg py-2"
              onClick={() => setCameraOpen(true)}
            >
              <CameraIcon />
              &nbsp;Camera
            </MenubarItem>
            <MenubarItem
              className="rounded-lg py-2"
              onClick={() => setAudioOpen(true)}
            >
              <MicIcon />
              &nbsp;Audio
            </MenubarItem>
            <MenubarItem
              className="rounded-lg py-2"
              onClick={() => setDocumentOpen(true)}
            >
              <FileIcon />
              &nbsp;Document
            </MenubarItem>
            <MenubarItem className="rounded-lg py-2" onClick={shareLocation}>
              <MapPin />
              &nbsp;Location
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <CameraDialog open={cameraOpen} setOpen={setCameraOpen} chatId={chatId} />
      <MediaDialog open={mediaOpen} setOpen={setMediaOpen} chatId={chatId} />
      <AudioDialog open={audioOpen} setOpen={setAudioOpen} chatId={chatId} />
      <DocumentDialog open={documentOpen} setOpen={setDocumentOpen} chatId={chatId} />
    </>
  );
}

export default MessageActions;
