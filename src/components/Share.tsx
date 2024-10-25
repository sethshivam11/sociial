import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2Icon, Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import FollowersLoadingSkeleton from "./skeletons/FollowersLoading";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { getFollowers } from "@/lib/store/features/slices/followSlice";
import Link from "next/link";
import { sendPost } from "@/lib/store/features/slices/messageSlice";

interface Props {
  isVideo?: boolean;
  _id: string;
}

const icons = {
  whatsapp: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 448 512"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  ),
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 512 512"
    >
      <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
    </svg>
  ),
  linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 448 512"
    >
      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
    </svg>
  ),
  telegram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 496 512"
    >
      <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
    </svg>
  ),
  x: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 512 512"
    >
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  ),
};

export default function Share({ isVideo, _id }: Props) {
  const dispatch = useAppDispatch();
  const { skeletonLoading, followers } = useAppSelector(
    (state) => state.follow
  );
  const { user } = useAppSelector((state) => state.user);
  const { loading } = useAppSelector((state) => state.message);

  const [search, setSearch] = useState("");
  const [shareToPeople, setShareToPeople] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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
  function handleSend(postId: string) {
    if (!shareToPeople.length) return;
    dispatch(sendPost({ postId, people: shareToPeople }))
      .then((response) => {
        if (!response.payload?.success) {
          toast({
            title: "Cannot share",
            description: response.payload?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setDialogOpen(false);
        setShareToPeople([]);
      });
  }
  async function handleCopy(postId: string) {
    const link = `${process.env.NEXT_PUBLIC_LINK || ""}/post/${postId}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  }

  useEffect(() => {
    if (dialogOpen) {
      dispatch(getFollowers({ userId: user._id }));
    } else {
      setShareToPeople([]);
    }
  }, [dispatch, dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger title="Share" className="sm:hover:opacity-60 dark:invert">
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
                        ? setShareToPeople([...shareToPeople, follower._id])
                        : setShareToPeople((prevPeople) =>
                            prevPeople.filter((user) => user !== follower._id)
                          );
                    }}
                  />
                </div>
              );
            })
          )}
        </ScrollArea>

        <DialogFooter>
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            <div className="flex justify-between items-center gap-2 w-full overflow-y-auto py-2 no-scrollbar">
              <div className="flex flex-col justify-center items-center gap-0.5 text-xs">
                <DialogClose asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(_id)}
                  >
                    <Link2Icon size="20" />
                  </Button>
                </DialogClose>
                Copy Link
              </div>
              <Link
                href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_LINK}/post/${_id}`}
                target="_blank"
                className="flex flex-col justify-center items-center gap-0.5 text-xs"
              >
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-black dark:text-white"
                  >
                    {icons.whatsapp}
                  </Button>
                </DialogClose>
                WhatsApp
              </Link>
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_LINK}/post/${_id}`}
                target="_blank"
                className="flex flex-col justify-center items-center gap-0.5 text-xs"
              >
                <DialogClose asChild>
                  <Button variant="outline" size="icon">
                    {icons.facebook}
                  </Button>
                </DialogClose>
                Facebook
              </Link>
              <Link
                href={`https://x.com/share?text=See+this+post+on+Sociial+&url=${process.env.NEXT_PUBLIC_LINK}/post/${_id}`}
                target="_blank"
                className="flex flex-col justify-center items-center gap-0.5 text-xs"
              >
                <DialogClose asChild>
                  <Button variant="outline" size="icon">
                    {icons.x}
                  </Button>
                </DialogClose>
                X
              </Link>
              <Link
                href={`https://telegram.me/share/url?url=${process.env.NEXT_PUBLIC_LINK}/post/${_id}`}
                target="_blank"
                className="flex flex-col justify-center items-center gap-0.5 text-xs"
              >
                <DialogClose asChild>
                  <Button variant="outline" size="icon">
                    {icons.telegram}
                  </Button>
                </DialogClose>
                Telegram
              </Link>
              <Link
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_LINK}/post/${_id}`}
                target="_blank"
                className="flex flex-col justify-center items-center gap-0.5 text-xs"
              >
                <DialogClose asChild>
                  <Button variant="outline" size="icon">
                    {icons.linkedin}
                  </Button>
                </DialogClose>
                LinkedIn
              </Link>
              <div className="flex flex-col justify-center items-center gap-0.5 text-xs min-w-10">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => sharePost(_id)}
                  >
                    <Share2 size="20" />
                  </Button>
                </DialogClose>
                Share
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => handleSend(_id)}
              disabled={!shareToPeople.length || loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
