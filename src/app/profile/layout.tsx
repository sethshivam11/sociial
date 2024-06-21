"use client"
import MobileNav from "@/components/MobileNav";
import { Bookmark, Grid2X2, Tag } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Profile({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const location = usePathname();
  const [user, setUser] = React.useState({
    _id: "1",
    avatar: "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    fullName: "John Doe",
    email: "johndoe2gmail.com",
    username: "johndoe",
    bio: "Passionate storyteller, aspiring novelist, and dedicated coffee enthusiast ☕️ | Traveler at heart with a penchant for discovering hidden gems around the world 🌍 | Digital marketing expert by profession, helping brands tell their stories and connect with audiences in meaningful ways 💼",
    followersCount: 20,
    followingsCount: 12,
    postsCount: 4,
  });

  return (
    <>
      <MobileNav unreadMessageCount={2} newNotifications={true} hideButtons={true} />
      <div className="min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 container py-2 max-md:px-16 max-sm:px-2">
        <div className="flex md:flex-row flex-col md:items-center items-start justify-evenly w-full">
          <div className="flex items-center justify-center gap-6 mt-4">
            <Image src={user.avatar} alt="Profile Picture" width="200" height="200" className="select-none pointer-events-none lg:w-[200px] sm:w-[150px] w-[100px] object-cover " />
            <div className="flex flex-col items-start justify-center my-4">
              <p className="lg:text-4xl text-2xl tracking-tight font-extrabold w-full">{user.fullName}</p>
              <p className="text-stone-500 lg:text-xl text-lg">@{user.username}</p>
            </div>
          </div>
          <div className="lg:py-16 sm:py-10 py-4 text-center grid grid-cols-3 sm:gap-4 gap-3 md:w-1/3 w-full">
            <button className="flex flex-col items-center justify-center gap-2">
              <span className="block lg:text-xl text-lg">Posts</span>
              <span className="lg:text-2xl text-lg">{user.postsCount}</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2">
              <span className="block lg:text-xl text-lg">Followers</span>
              <span className="lg:text-2xl text-lg">{user.followersCount}</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2">
              <span className="block lg:text-xl text-lg">Followings</span>
              <span className="lg:text-2xl text-lg">{user.followingsCount}</span>
            </button>


          </div>
        </div>
        <div className="flex items-center justify-center sm:w-3/4 md:w-1/2 w-full lg:ml-36 md:ml-20 font-light text-sm my-2 max-sm:px-6">{user.bio}</div>
        <div className="flex items-center justify-evenly mt-8 sm:text-md text-sm">
          <button className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-20 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${location.includes("/posts") ? "after:border-2" : "after:border-0"}`} onClick={() => router.push("/profile/posts")}>
            <Grid2X2 strokeWidth={location.includes("/posts") ? "2.5" : "1"} /> Posts
          </button>
          <button className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-20 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${location.includes("/tagged") ? "after:border-2" : "after:border-0"}`} onClick={() => router.push("/profile/tagged")}>
            <Tag strokeWidth={location.includes("/tagged") ? "2.5" : "1"} /> Tagged
          </button>
          <button className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-20 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${location.includes("/saved") ? "after:border-2" : "after:border-0"}`} onClick={() => router.push("/profile/saved")}>
            <Bookmark fill={location.includes("/saved") ? "currentColor" : "none"} /> Saved
          </button>
        </div>
        <hr className="my-2 sm:w-10/12 w-full mx-auto bg-stone-500 border-2 rounded-sm" />
        <div className="mx-auto md:w-4/5 w-full sm:pb-6 pb-20 sm:pt-0 mt-6">
          {children}
        </div>
      </div>
    </>
  )
}

export default Profile;
