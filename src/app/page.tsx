import dynamic from "next/dynamic";

const MobileNav = dynamic(() => import("@/components/MobileNav"));
const Posts = dynamic(() => import("@/components/Posts"));
const Stories = dynamic(() => import("@/components/Stories"));
const Suggestions = dynamic(() => import("@/components/Suggestions"));

export default function Home() {
  return (
    <>
      <MobileNav />
      <main className="grid min-h-screen h-max xl:col-span-8 sm:col-span-9 col-span-10 sm:grid-cols-10">
        <div className="lg:col-span-7 col-span-10 sm:container overflow-x-hidden">
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
