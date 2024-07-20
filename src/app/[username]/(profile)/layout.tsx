"use client";
import MobileNav from "@/components/MobileNav";
import {
  Bookmark,
  Grid2X2,
  Tag,
  MoreHorizontal,
  Mail,
  QrCode,
  CalendarDays,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import QRCode from "qrcode";
import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

function Profile({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_LINK || "";
  const router = useRouter();
  const location = usePathname();
  const [QR, setQR] = React.useState("");
  const [reportOpen, setReportOpen] = React.useState(false);
  const [user, setUser] = React.useState({
    _id: "1",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    fullName: "Shivam Soni",
    email: "johndoe2gmail.com",
    username: "sethshivam11",
    bio: "Passionate storyteller, aspiring novelist, and dedicated coffee enthusiast ☕️ | Traveler at heart with a penchant for discovering hidden gems around the world 🌍 | Digital marketing expert by profession, helping brands tell their stories and connect with audiences in meaningful ways 💼",
    followersCount: 20,
    followingsCount: 12,
    postsCount: 4,
    follow: true,
    isPremium: true,
  });
  const username = params.username;

  function report(postId: string, username: string) {
    console.log(`Reported post ${postId} by user ${username}`);
  }

  async function copyLink(username: string) {
    const link = `${baseUrl}/${username}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "The link has been copied to your clipboard.",
    });
  }

  const generateQR = async (text: string) => {
    try {
      setQR(await QRCode.toDataURL(`${baseUrl}/${text}`));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <MobileNav hideButtons />
      <div className="min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 container py-2 max-md:px-16 max-sm:px-2">
        <div className="flex md:flex-row flex-col md:items-center items-start justify-evenly w-full">
          <div className="flex items-center justify-center max-sm:justify-start gap-6 mt-4 px-4 max-sm:w-full">
            <Avatar className="lg:w-[200px] sm:w-[150px] w-[100px] lg:h-[200px] sm:h-[150px] h-[100px]">
              <AvatarImage
                src={user.avatar}
                className="pointer-events-none select-none"
              />
              <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center my-4">
              <p className="lg:text-4xl text-2xl tracking-tight font-extrabold w-full">
                {user.fullName}
              </p>
              <div className="text-stone-500 lg:text-xl text-lg flex items-center justify-center">
                {user.isPremium ? (
                  <Menubar className="border-0 h-fit w-fit">
                    <MenubarMenu>
                      <MenubarTrigger className="p-0 ">
                        <Image
                          src="/icons/verified.svg"
                          width="20"
                          height="20"
                          alt=""
                          className="w-5"
                        />
                      </MenubarTrigger>
                      <MenubarContent
                        className="px-6 py-4 drop-shadow-sm rounded-xl"
                        align="center"
                      >
                        <h1 className="text-xl tracking-tight font-bold">
                          Verified Account
                        </h1>
                        <p className="text-stone-500 text-sm flex items-center justify-start gap-1 my-3">
                          <Image
                            src="/icons/premium.svg"
                            width="20"
                            height="20"
                            alt=""
                            className="w-5"
                          />
                          This is a premium account
                        </p>
                        <p className="text-stone-500 text-sm flex items-center justify-start gap-1 my-3">
                          <CalendarDays /> Verified since {}
                        </p>
                        <Button
                          className="w-full rounded-xl"
                          onClick={() => router.push("/get-premium")}
                        >
                          Upgrade to Premium
                        </Button>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                ) : (
                  ""
                )}
                &nbsp;@{user.username}
              </div>
              <div className="flex items-center justify-center gap-2 max-sm:gap-4">
                {user.username === username ? (
                  <Button
                    className="my-4 py-1.5 h-fit w-fit px-3 rounded-full"
                    onClick={() => router.push("/settings/edit-profile")}
                  >
                    Edit Profile
                  </Button>
                ) : user.follow ? (
                  <Button
                    className="my-4 bg-stone-500 hover:bg-stone-600 py-1.5 h-fit w-fit px-3 rounded-full text-white"
                    onClick={() => setUser({ ...user, follow: false })}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    className="my-4 bg-blue-500 hover:bg-blue-700 py-1.5 h-fit w-fit px-3 rounded-full text-white"
                    onClick={() => setUser({ ...user, follow: true })}
                  >
                    Follow
                  </Button>
                )}
                {user.username === username ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => generateQR(user.username)}
                      >
                        <QrCode />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      hideCloseIcon
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <DialogTitle className="text-center text-2xl my-1">
                        QR Code
                      </DialogTitle>
                      <Image
                        src={QR}
                        alt="QR Code"
                        width="500"
                        height="500"
                        className="w-96 object-contain mx-auto"
                      />
                      <Button
                        onClick={(e) => {
                          const link = document.createElement("a");
                          link.href = QR;
                          link.download = `${user.fullName} QR`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        Download
                      </Button>
                      <DialogClose>Cancel</DialogClose>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => router.push(`/messages/${user._id}`)}
                  >
                    <Mail />
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    hideCloseIcon
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <DialogClose className="w-full md:px-20 py-1">
                      Share Profile
                    </DialogClose>
                    <DialogClose
                      className="w-full md:px-20 py-1"
                      onClick={() => copyLink(user.username)}
                    >
                      Copy link
                    </DialogClose>
                    <DialogClose className="w-full md:px-20 py-1 text-red-500">
                      Block
                    </DialogClose>
                    <DialogClose
                      className="text-red-500 w-full md:px-20 py-1"
                      onClick={() => setReportOpen(true)}
                    >
                      Report
                    </DialogClose>
                    <DialogClose>Cancel</DialogClose>
                  </DialogContent>
                </Dialog>
                <Dialog open={reportOpen}>
                  <DialogContent
                    className="sm:w-2/3 w-full h-fit flex flex-col bg-stone-100 dark:bg-stone-900"
                    hideCloseIcon
                  >
                    <DialogTitle className="text-center text-2xl my-1 ">
                      Report Post
                    </DialogTitle>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="report-title">Title</Label>
                        <Input
                          id="report-title"
                          placeholder="What is the issue?"
                          className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="report-description">Description</Label>
                        <Textarea
                          id="report-description"
                          placeholder="Describe the issue in detail."
                          rows={5}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-file">
                        Image
                        <span className="text-stone-500 text-sm">
                          &nbsp;(Optional)
                        </span>
                      </Label>
                      <Input
                        type="file"
                        id="report-file"
                        accept="image/*"
                        className="bg-stone-100 dark:bg-stone-900 sm:focus-within:ring-1 ring-stone-200"
                      />
                    </div>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => report(user._id, user.username)}
                      >
                        Report
                      </Button>
                      <DialogClose onClick={() => setReportOpen(false)}>
                        Cancel
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="lg:py-16 sm:py-10 py-4 text-center grid grid-cols-3 sm:gap-4 gap-3 md:w-1/3 w-full">
            <button className="flex flex-col items-center justify-center gap-2">
              <span className="block lg:text-xl text-lg">Posts</span>
              <span className="lg:text-2xl text-lg">{user.postsCount}</span>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${user.username}/followers`)}
            >
              <span className="block lg:text-xl text-lg">Followers</span>
              <span className="lg:text-2xl text-lg">{user.followersCount}</span>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${user.username}/following`)}
            >
              <span className="block lg:text-xl text-lg">Following</span>
              <span className="lg:text-2xl text-lg">
                {user.followingsCount}
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center sm:w-3/4 md:w-1/2 w-full lg:ml-36 md:ml-20 font-light text-sm my-2 max-sm:px-6">
          {user.bio}
        </div>
        <div className="flex items-center justify-evenly max-md:justify-around mt-8 sm:text-md text-sm">
          <button
            className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
              location === `/${user.username}`
                ? "after:border-2"
                : "after:border-0"
            }`}
            onClick={() => router.push(`/${user.username}`)}
          >
            <Grid2X2
              strokeWidth={location === `/${user.username}` ? "2.5" : "1"}
            />
            <span className="max-sm:hidden">Posts</span>
          </button>
          <button
            className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
              location.includes("/tagged") ? "after:border-2" : "after:border-0"
            }`}
            onClick={() => router.push(`/${user.username}/tagged`)}
          >
            <Tag strokeWidth={location.includes("/tagged") ? "2.5" : "1"} />
            <span className="max-sm:hidden">Tagged</span>
          </button>
          <button
            className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
              location.includes("/saved") ? "after:border-2" : "after:border-0"
            }`}
            onClick={() => router.push(`/${user.username}/saved`)}
          >
            <Bookmark
              strokeWidth="1"
              fill={location.includes("/saved") ? "currentColor" : "none"}
            />
            <span className="max-sm:hidden">Saved</span>
          </button>
        </div>
        <hr className="my-2 md:w-10/12 w-full mx-auto bg-stone-500 border-2 rounded-sm" />
        <div className="mx-auto md:w-4/5 w-full sm:pb-6 pb-20 sm:pt-0 mt-6">
          {children}
        </div>
      </div>
    </>
  );
}

export default Profile;
