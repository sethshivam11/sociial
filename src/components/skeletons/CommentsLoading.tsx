import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

function CommentsLoading({ length = 5 }) {
  return (
    <ScrollArea className="h-full px-2">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="flex items-start mb-3 group gap-2 p-1">
          <Avatar>
            <AvatarFallback />
          </Avatar>
          <div className="w-full">
            <Skeleton className="w-full h-8" />
            <div className="flex gap-1 items-center text-xs mt-1 text-stone-500 dark:text-stone-400 select-none">
              <Skeleton className="w-5 h-4" />
              <Skeleton className="w-10 h-4" />
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}

export default CommentsLoading;
