import { getTimeDifference } from "@/lib/helpers";
import { History } from "lucide-react";
import React from "react";

function PostCaption({
  caption,
  createdAt,
}: {
  caption: string;
  createdAt: string;
}) {
  return (
    caption && (
      <p className="py-1 text-sm">
        <span
          dangerouslySetInnerHTML={{
            __html: caption.slice(0, 30).split("\n").join("<br>"),
          }}
        ></span>
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
                span.innerHTML = caption
                  .slice(0, 30)
                  .split("\n")
                  .join("<br />");
                btn.innerHTML = "&nbsp;more";
              }
            }}
          >
            more
          </button>
        )}
        <span className="flex gap-1 text-stone-500 mt-1">
          {createdAt && (
            <>
              <History size="20" />
              {getTimeDifference(createdAt)}
            </>
          )}
        </span>
      </p>
    )
  );
}

export default PostCaption;
