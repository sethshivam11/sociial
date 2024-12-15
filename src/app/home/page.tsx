"use client";
import React from "react";

import LandingNav from "@/components/LandingNav";
import HeroSection from "@/components/HeroSection";
import { BentoGrid } from "@/components/BentoGrid";



export default function HeroScrollDemo() {

  return (
    <div className="flex flex-col items-center overflow-hidden col-span-10">
      <LandingNav />
      <HeroSection />
      <BentoGrid />
    </div>
  );
}
