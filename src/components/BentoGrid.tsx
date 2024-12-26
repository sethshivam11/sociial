"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lobster_Two } from "next/font/google";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

export default function BentoGrid() {
  const features = [
    {
      title: "Seamless Connections",
      description:
        "Stay connected effortlessly with friends and followers using real-time messaging, story sharing, and smart notifications.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Share Your Moments",
      description:
        "Easily share your favorite images and videos and connect with your audience like never before.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Anonymous Confessions",
      description:
        "Share your thoughts freely and anonymously. Connect, relate, and engage without revealing your identity.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Audio/Video Calls",
      description:
        "Enjoy seamless audio and video calls with friends and family. Whether catching up or having group chats, stay connected with high-quality communication.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  
  return (
    <div className="relative pt-20 pb-10 lg:py-40 sm:px-10 px-4 max-w-7xl mx-auto">
      <div className="px-4">
        <h4 className="text-2xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Packed with thousands of features
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
        Discover endless possibilities with <span className={`${lobster.className} tracking-tight`}>Sociial</span> - designed to empower you with features that redefine connection, creativity, and community.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-96 flex-col space-y-2">
          <Image
            src="/bg-doodle-dark.jpg"
            alt=""
            width="500"
            height="500"
            className="hidden dark:inline-block h-full w-full aspect-square object-cover object-top rounded-sm"
            draggable={false}
          />
          <Image
            src="/bg-doodle-light.jpg"
            alt=""
            width="500"
            height="500"
            className="dark:hidden h-full w-full aspect-square object-cover object-bottom rounded-sm"
            draggable={false}
          />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full group/image">
      <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-96 flex-col space-y-2 relative">
          <Image
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1734261903/samples/xlsp8yxtgksuuqyyoelg.jpg"
            alt=""
            width="800"
            height="800"
            className="h-full w-full aspect-square object-cover object-[0%,20%] rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTwo = () => {
  const images1 = [
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1691474599/samples/landscapes/nature-mountains.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1691474611/samples/breakfast.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1691474595/samples/landscapes/beach-boat.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1734260005/samples/landscapes/doc2pjopbdeynx8sdcbo.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1734260043/samples/landscapes/ojoz016idck0x5nbspmo.jpg",
  ];
  const images2 = [
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1691474594/samples/landscapes/architecture-signs.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1691474610/samples/balloons.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1691474592/samples/bike.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1734260154/samples/vn8bouyglbhbv73zuajx.jpg",
    "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1734260195/samples/nfggyonet3qv14pl6qlc.jpg",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 10,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 10,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-20">
        {images1.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt=""
              width="800"
              height="800"
              className="rounded-lg h-32 w-32 md:h-40 md:w-40 object-cover flex-shrink-0"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images2.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt=""
              width="800"
              height="800"
              className="rounded-lg h-32 w-32 md:h-40 md:w-40 object-cover flex-shrink-0"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
