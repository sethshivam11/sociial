"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react"
import { Image as PostImage } from "lucide-react"

interface Post {
  link: string;
}

function Page() {
  const [loading, setLoading] = React.useState(false);
  const [posts, setPosts] = React.useState<Post[]>([]);

  return (
    <div className="flex items-center justify-start flex-wrap flex-row w-full">
      {loading ?
        Array.from({ length: 6 }).map((_, i) => {
          return (
            <div className="lg:w-1/4 w-1/3 aspect-square p-1" key={i}>
              <Skeleton className="h-full w-full" />
            </div>
          )
        })
        : (posts.length ?
          (posts.map((post, index) =>
          (<div className="lg:w-1/4 w-1/3 aspect-square p-1" key={index}>
            <Image src={post.link} width="300" height="300" className="w-full h-full object-cover rounded-sm" alt="" />
          </div>))) :
          (<div className="flex flex-col items-center justify-center w-full min-h-96 h-full">
            <PostImage size="100" className="my-4" />
            <span className="sm:text-3xl text-xl font-bold tracking-tight">Nothing Here</span>
            <span className="sm:text-lg text-base text-stone-500">
              Share your first post now
            </span>
          </div>)
        )}
    </div>
  )
}

export default Page