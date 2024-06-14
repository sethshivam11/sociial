import MobileNav from "@/components/MobileNav";
import Posts from "@/components/Posts";
import Stories from "@/components/Stories";
import Suggestions from "@/components/Suggestions";

export default function Home() {
  const unreadMessageCount = 0;
  return (
    <>
      <MobileNav unreadMessageCount={unreadMessageCount} />
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
