import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SendHorizontal, ShareIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import FollowersLoadingSkeleton from "./skeletons/FollowersLoading";
import { useAppSelector } from "@/lib/store/store";

interface Props {
  isVideo?: boolean;
  _id: string;
}

export default function Share({ isVideo, _id }: Props) {
  const { skeletonLoading } = useAppSelector((state) => state.follow);
  const formSchema = z.object({
    message: z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const [search, setSearch] = React.useState("");

  const followers = [
    {
      fullName: "John Doe",
      username: "johndoe",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Jane Smith",
      username: "janesmith",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Alex Johnson",
      username: "alexjohnson",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Maria Garcia",
      username: "mariagarcia",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "James Wilson",
      username: "jameswilson",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Linda Brown",
      username: "lindabrown",
      avatar: "https://github.com/shadcn.png",
    },
    {
      fullName: "Robert Davis",
      username: "robertdavis",
      avatar: "https://github.com/shadcn.png",
    },
  ];

  const [shareToPeople, setShareToPeople] = React.useState<typeof followers>(
    []
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(shareToPeople);
  }

  function sharePost(postId: string) {
    if (navigator.share === undefined) {
      console.log("WebShare API not available");
      return toast({
        title: "Error",
        description: "An error occurred while sharing the post.",
        variant: "destructive",
      });
    }
    const textToShare = {
      title: "Sociial",
      description: "Check out this post on Sociial",
      url: `${process.env.NEXT_PUBLIC_LINK}/${
        isVideo ? "video" : "post"
      }/${postId}`,
    };
    navigator.share(textToShare).catch((error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while sharing the post.",
        variant: "destructive",
      });
    });
  }

  return (
    <Dialog>
      <DialogTrigger title="Share" className="sm:hover:opacity-60">
        <Image src="/share.svg" width={30} height={30} alt="Share" />
      </DialogTrigger>
      <DialogContent
        className="sm:w-2/3 w-full sm:h-5/6 h-full flex flex-col bg-stone-100 dark:bg-stone-900"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-xl">Share post</DialogTitle>
        <Input
          value={search}
          name="search"
          autoComplete="off"
          inputMode="search"
          placeholder="Search for users"
          onChange={(e) => setSearch(e.target.value)}
        />
        <hr className="bg-stone-500 my-2" />
        <ScrollArea className="h-full p-2">
          {skeletonLoading ? (
            <FollowersLoadingSkeleton />
          ) : (
            followers.map((follower, index) => {
              return (
                <div
                  className="flex items-center justify-between w-full px-2 gap-3 mb-3 rounded-lg"
                  key={index}
                >
                  <Label
                    htmlFor={`follower-${index}`}
                    className="flex items-center gap-3 rounded-lg w-full cursor-pointer"
                  >
                    <div className="w-8 h-8">
                      <Image
                        width={32}
                        height={32}
                        src={follower.avatar}
                        alt=""
                        className="w-full h-full rounded-full pointer-events-none select-none"
                      />
                    </div>
                    <div>
                      <p className="text-lg leading-5">{follower.fullName}</p>
                      <p className="text-sm text-gray-500">
                        @{follower.username}
                      </p>
                    </div>
                  </Label>
                  <Checkbox
                    id={`follower-${index}`}
                    className="rounded-full w-5 h-5 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 data-[state=checked]:border-0"
                    onCheckedChange={(checked) => {
                      checked
                        ? setShareToPeople([...shareToPeople, follower])
                        : setShareToPeople((prevPeople) =>
                            prevPeople.filter(
                              (user) => user.username !== follower.username
                            )
                          );
                    }}
                  />
                </div>
              );
            })
          )}
        </ScrollArea>

        <DialogFooter>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex items-center justify-center sm:gap-2 gap-1"
            >
              <Button
                variant="ghost"
                size="icon"
                className="px-2"
                onClick={() => sharePost(_id)}
              >
                <ShareIcon />
              </Button>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        type="text"
                        inputMode="text"
                        placeholder="Add a message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose asChild>
                <Button
                  size="sm"
                  type="submit"
                  disabled={shareToPeople.length < 1}
                >
                  <SendHorizontal />
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
