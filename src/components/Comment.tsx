import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, SendHorizonal, Smile } from "lucide-react";
import Image from "next/image";

interface Props {
  comments: {
    user: {
      fullName: string;
      username: string;
      avatar: string;
    };
    comment: string;
  }[];
  user: {
    fullName: string;
    username: string;
    avatar: string;
  };
  commentsCount: number;
}

export default function Comment({ comments, user, commentsCount }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MessageCircle
          size="26"
          className="hover:opacity-60 sm:inline hidden"
        />
      </DialogTrigger>
      <DialogContent className="w-2/3 h-3/4 flex flex-col bg-stone-100 dark:bg-stone-900">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 rounded-lg">
            <div className="w-8 h-8">
              <Image
                width={32}
                height={32}
                src={user.avatar}
                alt=""
                className="w-full h-full rounded-full"
              />
            </div>
            <div>
              <p>{user.fullName}</p>
              <p className="text-sm text-gray-500 leading-3">
                @{user.username}
              </p>
            </div>
          </div>
        </div>
        <hr className="bg-stone-500" />
        <div className="h-full">
          {comments.map((comment, index) => {
            return (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2 p-2 rounded-lg">
                  <div className="w-10 h-10">
                    <Image
                      width={32}
                      height={32}
                      src={comment.user.avatar}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="mr-3">
                    <p className="font-semibold">{comment.user.fullName}</p>
                    <p className="text-xs text-stone-500">
                      @{comment.user.username}
                    </p>
                  </div>
                  <div>
                    <p className="">{comment.comment}</p>
                    <div className="flex gap-3 text-xs text-stone-500 dark:text-stone-400">
                      <p>
                        {commentsCount === 1
                          ? "1 like"
                          : `${commentsCount} likes`}
                      </p>
                      <button>Reply</button>
                    </div>
                  </div>
                </div>
                <Heart size="16" className="mx-2" />
              </div>
            );
          })}
        </div>
        <hr className="bg-stone-500" />
        <DialogFooter>
          <div className="flex gap-2 w-full items-center">
            <Button variant="secondary" size="sm">
              <Smile />
            </Button>
            <Input
              autoComplete="off"
              inputMode="text"
              name="comment"
              placeholder="Add a comment..."
            />
            <Button className="" size="sm">
              <SendHorizonal />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
