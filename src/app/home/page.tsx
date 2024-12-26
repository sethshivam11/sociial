import LandingNav from "@/components/LandingNav";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import FAQs from "@/components/FAQs";
import WobbleCardDemo from "@/components/WobbleCardDemo";
import Typewriter from "@/components/Typewriter";
import LandingFooter from "@/components/LandingFooter";

export default function Page() {
  return (
    <div className="flex flex-col items-center overflow-hidden col-span-10">
      <LandingNav />
      <HeroSection />
      <BentoGrid />
      <FAQs />
      <WobbleCardDemo />
      <Typewriter />
      <LandingFooter />
    </div>
  );
}
