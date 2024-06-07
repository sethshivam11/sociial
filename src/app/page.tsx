import MobileNav from "@/components/MobileNav";
import Posts from "@/components/Posts";
import Stories from "@/components/Stories";
import Suggestions from "@/components/Suggestions";

export default function Home() {
  return (
    <>
      <MobileNav />
      <main className="grid min-h-screen h-max xl:col-span-8 md:col-span-7 sm:col-span-8 col-span-10 sm:grid-cols-10">
        <div className="xl:col-span-7 col-span-10 sm:container overflow-x-hidden">
          <div className="max-w-[650px] mx-auto">
            <Stories />
            <Posts />
          </div>
        </div>
        <Suggestions />
      </main>
    </>
  );
}
