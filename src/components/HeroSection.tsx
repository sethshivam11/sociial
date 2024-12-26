"use client";
import Image from "next/image";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ChevronRight } from "lucide-react";
import { Lobster_Two } from "next/font/google";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

function HeroSection() {
  const words = ["Memories", "Thoughts", "Stories", "Ideas", "Dreams"];

  return (
    <section className="w-full pt-24 relative flex flex-col items-center dark:bg-grid-white/[0.2] bg-grid-black/[0.2]">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col gap-2 items-center justify-center">
            <Link
              href="/sign-up"
              className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 px-2.5 py-1.5 text-xs rounded-full shadow-lg flex items-center gap-1 ring-1 ring-stone-500 hover:ring-stone-800 hover:dark:ring-stone-200 transition-colors mb-10 w-fit"
            >
              <span>Start your journey 🎉</span>
              <ChevronRight size="16" />
            </Link>
            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              className="text-4xl sm:text-7xl font-extrabold tracking-tighter bg-clip-text relative z-10 text-transparent bg-gradient-to-b from-stone-500 to-stone-900 dark:from-stone-50 dark:to-stone-200 px-2"
            >
              Welcome to&nbsp;
              <span className={lobster.className}>Sociial</span>
            </motion.h1>
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              className="sm:text-4xl text-lg font-bold tracking-tight font-serif md:mb-10 sm:mb-20 mb-0"
            >
              A place to share your
              <FlipWords words={words} />
            </motion.div>
          </div>
        }
      >
        <Image
          src="/hero-light.png"
          alt="hero"
          height="720"
          width="1080"
          className="dark:hidden rounded-2xl object-fill h-full max-sm:hidden select-none"
          draggable={false}
        />
        <Image
          src="/hero-dark.png"
          alt="hero"
          height="720"
          width="1080"
          className="hidden sm:dark:inline-block rounded-2xl object-fill h-full max-sm:hidden select-none"
          draggable={false}
        />
        <Image
          src="/phone-hero-light.jpg"
          alt="hero"
          height="720"
          width="1080"
          className="dark:hidden rounded-2xl object-cover sm:hidden select-none min-h-[40rem]"
          draggable={false}
        />
        <Image
          src="/phone-hero-dark.jpg"
          alt="hero"
          height="720"
          width="1080"
          className="hidden max-sm:dark:inline-block rounded-2xl object-cover sm:hidden select-none min-h-[40rem]"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}

export default HeroSection;
