import { Skeleton } from "../ui/skeleton";

function StoriesLoading({ length = 6 }) {
  return Array.from({ length }).map((_, index) => (
    <div
      className="p-1 ring-1 ring-input h-fit rounded-lg relative"
      key={index}
    >
      <Skeleton className="w-24 h-28 sm:h-32 rounded-xl overflow-hidden" />
      <div className="p-1 absolute bottom-2 left-2">
        <Skeleton className="w-8 sm:w-10 h-8 sm:h-10 rounded-full ring-2 ring-white dark:ring-black" />
      </div>
    </div>
  ));
}

export default StoriesLoading;
