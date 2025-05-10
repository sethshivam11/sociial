import dynamic from "next/dynamic";

const LandingNav = dynamic(() => import("../../components/LandingNav"));
const HeroSection = dynamic(() => import("../../components/HeroSection"));
const BentoGrid = dynamic(() => import("../../components/BentoGrid"));
const FAQs = dynamic(() => import("../../components/FAQs"));
const WobbleCardDemo = dynamic(() => import("../../components/WobbleCardDemo"));
const Typewriter = dynamic(() => import("../../components/Typewriter"));
const Footer = dynamic(() => import("../../components/Footer"));

export default function Page() {

  return (
    <div className="flex flex-col items-center overflow-hidden col-span-10">
      <LandingNav />
      <HeroSection />
      <BentoGrid />
      <FAQs />
      <WobbleCardDemo />
      <Typewriter />
      <Footer />
    </div>
  );
}
