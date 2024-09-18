import { getTimeDifference } from "@/lib/helpers";
import { History } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function PostCaption({
  caption,
  createdAt,
}: {
  caption: string;
  createdAt: string;
}) {
  return (
    <>
      {caption && (
        <p className="py-1 text-sm">
          <span>{caption.slice(0, 30)}</span>
          &nbsp;
          {caption?.length > 30 && (
            <button
              className="text-stone-500 select-none"
              onClick={(e) => {
                const btn = e.target as HTMLButtonElement;
                const span = btn.parentElement?.childNodes[0] as HTMLElement;
                if (btn.textContent?.trim() === "more") {
                  span.innerHTML = caption.split("\n").join("<br />");
                  btn.innerHTML = "&nbsp;less";
                } else {
                  span.innerHTML = caption.slice(0, 30);
                  btn.innerHTML = "&nbsp;more";
                }
              }}
            >
              more
            </button>
          )}
        </p>
      )}
      {createdAt && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex gap-1 text-sm text-stone-500 mt-1 select-none">
              <History size="20" />
              {getTimeDifference(createdAt)}
            </TooltipTrigger>
            <TooltipContent>
              <p>{new Date(createdAt).toLocaleString("en-IN")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}

export default PostCaption;
