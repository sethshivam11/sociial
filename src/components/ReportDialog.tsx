import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { z } from "zod";
import { descriptionSchema, titleSchema } from "@/schemas/reportSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  resetForm,
  submitReport,
} from "@/lib/store/features/slices/reportSlice";
import { toast } from "./ui/use-toast";
import { Info, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  entityId?: string;
  type:
    | "post"
    | "comment"
    | "user"
    | "chat"
    | "problem"
    | "story"
    | "confession";
}

function ReportDialog({ open, setOpen, entityId, type }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [image, setImage] = useState<File | null>(null);
  const { loading, submitted } = useAppSelector((state) => state.report);
  const formSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    dispatch(
      submitReport({
        title: data.title,
        description: data.description,
        kind: type,
        user: user._id,
        entityId,
        image,
      }),
    )
      .then(({ payload }) => {
        if (payload?.success) return;
        toast({
          title: "Error",
          description: payload?.message || "Something went wrong!",
          variant: "destructive",
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Something went wrong!",
          variant: "destructive",
        });
      });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) setOpen(open);
      }}
    >
      <DialogContent className="sm:w-2/3 w-full h-fit flex flex-col bg-stone-100 dark:bg-stone-900">
        {submitted ? (
          <>
            <DialogTitle className="text-center text-2xl my-1">
              Report Submitted
            </DialogTitle>
            <Info size="100" className="mx-auto" />
            <p className="opacity-90 text-justify">
              We&apos;re very sorry for your bad experience with us. Thank you
              for reporting this issue. We will look into it as soon as
              possible. We will inform you about the status of your report via
              email.
            </p>
            <DialogFooter>
              <Button
                variant="link"
                onClick={() => {
                  form.reset();
                  dispatch(resetForm());
                }}
              >
                Submit Another Report
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogTitle className="text-center text-2xl my-1">
              Report Post
            </DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          className="sm:focus-within:ring-1"
                          placeholder="What is the issue?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-background"
                          placeholder="Describe the issue in detail"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Image (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          placeholder="Describe the issue in detail"
                          accept="image/png,image/jpg,image/jpeg,image/webp"
                          onChange={(e) =>
                            setImage(e.target.files?.[0] || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Report"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReportDialog;
