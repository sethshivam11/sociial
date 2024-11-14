import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useState } from "react";
import { toast } from "./ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { sendAnonymousMessage } from "@/lib/store/features/slices/anonymousMessageSlice";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AnonymousDialog({ open, setOpen }: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.anonymousMessage);
  const { profile } = useAppSelector((state) => state.user);
  const formSchema = z.object({
    content: z
      .string()
      .min(1, {
        message: "Message should not be empty",
      })
      .max(1000, {
        message: "Message should not exceed 1000 characters",
      }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const [file, setFile] = useState<File | null>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target?.files) return;
    const selectedFile = e.target.files[0];
    if (
      !(
        selectedFile.type.includes("image") ||
        selectedFile.type.includes("video")
      )
    ) {
      return toast({
        title: "Invalid file",
        description: "Only image and video files supported",
        variant: "destructive",
      });
    } else {
      setFile(selectedFile);
    }
  }
  function onSubmit({ content }: z.infer<typeof formSchema>) {
    dispatch(
      sendAnonymousMessage({ content, reciever: profile._id, attachment: file })
    ).then((response) => {
      if (response.payload?.success) {
        setOpen(false);
        toast({
          title: "Message sent successfully",
        });
        form.reset();
      } else {
        toast({
          title: "Cannot send message",
          description: response.payload?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent hideCloseIcon>
        <DialogTitle>Send confession</DialogTitle>
        <DialogDescription>
          These confessions/messages will be sent to the user anonymously.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="focus-visible:ring-2 focus-visible:ring-stone-800 dark:focus-visible:ring-stone-200 "
                      placeholder="Type your message..."
                      inputMode="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="message"
              render={() => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png,image/webp,image/jpg,video/mp4"
                      onChange={handleFile}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="max-sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!loading) {
                    setOpen(false);
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || form.watch("content").length <= 0}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AnonymousDialog;
