"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export default function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Stay Connected with the World
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
          Build meaningful relationships, share your moments, and engage with a vibrant community of like-minded individuals. Whether it&apos;s friends, family, or new acquaintances, Sociial makes staying connected effortless.
          </p>
        </div>
        <Image
          src="/hero-light.png"
          width={500}
          height={500}
          alt=""
          className="dark:hidden absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
        <Image
          src="/hero-dark.png"
          width={500}
          height={500}
          alt=""
          className="hidden dark:inline-block absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
        Unleash Your Creativity and Share
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
        Express yourself through stories, posts, and unique visuals. From personal updates to creative projects, Sociial gives you the freedom to showcase your ideas in your own way.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Explore Endless Possibilities
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Dive into a world of diverse content, trending topics, and inspiring creators. Sociial helps you discover what’s new, exciting, and worth your attention every day.
          </p>
        </div>
        <Image
          src="/hero-light.png"
          width={500}
          height={500}
          alt=""
          className="dark:hidden absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
        <Image
          src="/hero-dark.png"
          width={500}
          height={500}
          alt=""
          className="hidden dark:inline-block absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
