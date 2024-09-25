"use client";
import MobileNav from "@/components/MobileNav";
import {
  Bookmark,
  Grid2X2,
  MoreHorizontal,
  Mail,
  QrCode,
  Loader2,
  Tv,
  GalleryVertical,
} from "lucide-react";
import { notFound, usePathname, useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import QRCode from "qrcode";
import Image from "next/image";
import ReportDialog from "@/components/ReportDialog";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  followUser,
  getFollowings,
  unfollowUser,
} from "@/lib/store/features/slices/followSlice";
import {
  blockUser,
  getProfile,
  unblockUser,
} from "@/lib/store/features/slices/userSlice";
import ProfileLoading from "@/components/skeletons/ProfileLoading";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Profile({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const dispatch = useAppDispatch();
  const {
    user,
    profile,
    skeletonLoading,
    isLoggedIn,
    loading: userLoading,
  } = useAppSelector((state) => state.user);
  const { followings, loading } = useAppSelector((state) => state.follow);
  const baseUrl = process.env.NEXT_PUBLIC_LINK || "";
  const router = useRouter();
  const location = usePathname();
  const [QR, setQR] = React.useState("");
  const [userNotFound, setUserNotFound] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [blockDialog, setBlockDialog] = React.useState(false);
  const username = params.username;

  function handleBlock() {
    dispatch(blockUser(profile._id)).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot block user",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  function handleUnblock() {
    dispatch(unblockUser(profile._id)).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Cannot unblock user",
          description: response.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  async function copyLink(username: string) {
    const link = `${baseUrl}/${username}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "The link has been copied to your clipboard.",
    });
  }

  async function generateQR(text: string) {
    try {
      setQR(await QRCode.toDataURL(`${baseUrl}/${text}`));
    } catch (err) {
      console.error(err);
    }
  }

  function handleFollow(username: string) {
    if (!isLoggedIn) {
      return toast({
        title: "Please login!",
        description: "You need to be logged in to follow users.",
        action: (
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        ),
      });
    }
    dispatch(followUser({ username })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Error",
          description: "An error occurred while trying to follow this user.",
          variant: "destructive",
        });
      }
    });
  }

  function handleUnfollow(username: string) {
    dispatch(unfollowUser({ username })).then((response) => {
      if (!response.payload?.success) {
        toast({
          title: "Error",
          description: "An error occurred while trying to unfollow this user.",
          variant: "destructive",
        });
      }
    });
  }

  function handleQRDownload() {
    const link = document.createElement("a");
    link.href = QR;
    link.download = `${profile.fullName} QR`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getButton(): React.ReactNode {
    if (user.username === username)
      return (
        <Button
          className="my-4 py-1.5 h-fit w-fit px-3 rounded-full"
          onClick={() => router.push("/settings/edit-profile")}
        >
          Edit Profile
        </Button>
      );
    else if (user.blocked.includes(profile._id))
      return (
        <Button
          className="my-4 bg-blue-500 hover:bg-blue-700 py-1.5 min-h-9 w-24 px-3 rounded-full text-white"
          onClick={() => handleUnblock()}
          disabled={userLoading}
        >
          {userLoading ? <Loader2 className="animate-spin" /> : "Unblock"}
        </Button>
      );
    else
      return followings.some(
        (following) => following.username === profile.username
      ) ? (
        <Button
          className="my-4 bg-stone-500 hover:bg-stone-600 py-1.5 min-h-9 w-24 px-3 rounded-full text-white"
          onClick={() => handleUnfollow(profile.username)}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Unfollow"}
        </Button>
      ) : (
        <Button
          className="my-4 bg-blue-500 hover:bg-blue-700 py-1.5 min-h-9 w-24 px-3 rounded-full text-white"
          onClick={() => handleFollow(profile.username)}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Follow"}
        </Button>
      );
  }

  React.useEffect(() => {
    dispatch(getFollowings({ username }));

    if (username)
      dispatch(getProfile({ username })).then((response) => {
        if (response.payload?.message === "User not found")
          setUserNotFound(true);
      });
  }, [username, dispatch]);

  React.useEffect(() => {
    if (userNotFound) notFound();
  }, [userNotFound]);

  return (
    <>
      <MobileNav hideButtons />
      <div className="min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 container py-2 max-md:px-16 max-sm:px-2">
        {skeletonLoading ? (
          <ProfileLoading />
        ) : (
          <>
            <div className="flex md:flex-row flex-col md:items-center items-start justify-evenly w-full">
              <div className="flex items-center justify-center max-sm:justify-start gap-6 mt-4 px-4 max-sm:w-full">
                <Avatar className="lg:w-[200px] sm:w-[150px] w-[100px] lg:h-[200px] sm:h-[150px] h-[100px]">
                  <AvatarImage
                    src={profile.avatar}
                    className="pointer-events-none select-none"
                  />
                  <AvatarFallback>
                    {nameFallback(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center my-4">
                  <p className="lg:text-4xl text-2xl tracking-tight font-extrabold w-full min-h-8">
                    {profile.fullName}
                  </p>
                  <div className="text-stone-500 lg:text-xl text-lg flex items-center justify-center">
                    @{profile.username}
                  </div>
                  <div className="flex items-center justify-center gap-2 max-sm:gap-4 select-none">
                    {getButton()}
                    {profile.username === user.username ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => generateQR(profile.username)}
                          >
                            <QrCode />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
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
                            className="w-96 object-contain mx-auto rounded-xl"
                          />
                          <Button onClick={handleQRDownload}>Download</Button>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                          if (!isLoggedIn) {
                            toast({
                              title: "Please login!",
                              description:
                                "You need to login to chat to the user.",
                              action: (
                                <Button onClick={() => router.push("/sign-in")}>
                                  Sign In
                                </Button>
                              ),
                            });
                          } else {
                            router.push(`/messages/${profile._id}`);
                          }
                        }}
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
                        <DialogClose
                          className="w-full md:px-20 py-1"
                          onClick={() => {
                            if (navigator) {
                              navigator
                                .share({
                                  title: profile.fullName,
                                  text: `See @${profile.username}'s profile on Sociial`,
                                  url: `${baseUrl}/${profile.username}`,
                                })
                                .catch((err) => console.log(err));
                            } else {
                              toast({
                                title: "Share feature is not supported",
                                description:
                                  "You can try copying the link and sharing it manually.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Share Profile
                        </DialogClose>
                        <DialogClose
                          className="w-full md:px-20 py-1"
                          onClick={() => copyLink(profile.username)}
                        >
                          Copy link
                        </DialogClose>
                        {profile.username !== user.username && (
                          <>
                            <DialogClose
                              className={`w-full md:px-20 py-1 ${
                                user.blocked.includes(profile._id)
                                  ? "text-blue-500"
                                  : "text-red-500"
                              }`}
                              onClick={() => {
                                if (!isLoggedIn) {
                                  toast({
                                    title: "Please login!",
                                    description:
                                      "You need to login to report this user.",
                                    action: (
                                      <Button
                                        onClick={() => router.push("/sign-in")}
                                      >
                                        Sign In
                                      </Button>
                                    ),
                                  });
                                }
                                setBlockDialog(true);
                              }}
                            >
                              {user.blocked.includes(profile._id)
                                ? "Unblock"
                                : "Block"}
                            </DialogClose>
                            <DialogClose
                              className="text-red-500 w-full md:px-20 py-1"
                              onClick={() => {
                                if (!isLoggedIn) {
                                  toast({
                                    title: "Please login!",
                                    description:
                                      "You need to login to report this user.",
                                    action: (
                                      <Button
                                        onClick={() => router.push("/sign-in")}
                                      >
                                        Sign In
                                      </Button>
                                    ),
                                  });
                                } else setReportOpen(true);
                              }}
                            >
                              Report
                            </DialogClose>
                          </>
                        )}
                        <DialogClose>Cancel</DialogClose>
                      </DialogContent>
                    </Dialog>
                    <ReportDialog
                      open={reportOpen}
                      setOpen={setReportOpen}
                      entityId={profile._id}
                      type="user"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:py-16 sm:py-10 py-4 text-center grid grid-cols-3 sm:gap-4 gap-3 md:w-1/3 w-full">
                <button className="flex flex-col items-center justify-center gap-2">
                  <span className="block lg:text-xl text-lg">Posts</span>
                  <span className="lg:text-2xl text-lg">
                    {profile.postsCount}
                  </span>
                </button>
                <button
                  className="flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push(`/${profile.username}/followers`)}
                >
                  <span className="block lg:text-xl text-lg">Followers</span>
                  <span className="lg:text-2xl text-lg">
                    {profile.followersCount}
                  </span>
                </button>
                <button
                  className="flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push(`/${profile.username}/following`)}
                >
                  <span className="block lg:text-xl text-lg">Following</span>
                  <span className="lg:text-2xl text-lg">
                    {profile.followingCount}
                  </span>
                </button>
              </div>
            </div>
            <div className="sm:w-3/4 md:w-1/2 w-full lg:ml-36 md:ml-20 font-light text-left text-sm my-2 max-sm:px-6">
              {profile.bio}
            </div>
            <div className="flex items-center justify-evenly max-md:justify-around mt-8 sm:text-md text-sm">
              <button
                className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
                  !location.includes("/saved") &&
                  !location.includes("/vids") &&
                  !location.includes("/feed")
                    ? "after:border-2"
                    : "after:border-0"
                }`}
                onClick={() => router.push(`/${profile.username}`)}
              >
                <Grid2X2
                  strokeWidth={
                    location === `/${profile.username}` ? "2.5" : "1"
                  }
                />
                <span className="max-sm:hidden">Posts</span>
              </button>
              <button
                className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
                  location.includes("/feed")
                    ? "after:border-2"
                    : "after:border-0"
                }`}
                onClick={() => router.push(`/${profile.username}/feed`)}
              >
                <GalleryVertical
                  strokeWidth={
                    location === `/${profile.username}/feed` ? "2.5" : "1"
                  }
                />
                <span className="max-sm:hidden">Feed</span>
              </button>
              <button
                className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
                  location.includes("/vids")
                    ? "after:border-2"
                    : "after:border-0"
                }`}
                onClick={() => router.push(`/${profile.username}/vids`)}
              >
                <Tv
                  strokeWidth={
                    location === `/${profile.username}/vids` ? "2.5" : "1"
                  }
                />
                <span className="max-sm:hidden">Videos</span>
              </button>
              {user.username === profile.username && (
                <button
                  className={`flex items-center justify-center gap-2 relative after:rounded-sm sm:after:w-28 after:w-16 after:absolute after:top-8 after:border-stone-800 after:dark:border-stone-200 ${
                    location.includes("/saved")
                      ? "after:border-2"
                      : "after:border-0"
                  }`}
                  onClick={() => router.push(`/${profile.username}/saved`)}
                >
                  <Bookmark
                    strokeWidth="1"
                    fill={location.includes("/saved") ? "currentColor" : "none"}
                  />
                  <span className="max-sm:hidden">Saved</span>
                </button>
              )}
            </div>
            <hr className="my-2 md:w-10/12 w-full mx-auto bg-stone-500 border-2 rounded-sm" />
          </>
        )}
        <AlertDialog open={blockDialog} onOpenChange={setBlockDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>
              <Avatar className="mx-auto w-20 h-20">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>
                  {nameFallback(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                {user.blocked.includes(profile._id) ? "Unblock" : "Block"}
                &nbsp;
                {profile.fullName}
                &nbsp;&#183;&nbsp;
                <span className="text-stone-500">@{profile.username}</span>
                &nbsp;
              </div>
            </AlertDialogTitle>
            <AlertDialogFooter className="grid grid-cols-1 gap-2 sm:space-x-0">
              <AlertDialogAction
                disabled={userLoading}
                onClick={() => {
                  if (user.blocked.includes(profile._id)) {
                    handleUnblock();
                  } else {
                    handleBlock();
                  }
                }}
                className={
                  user.blocked.includes(profile._id)
                    ? ""
                    : "bg-destructive hover:bg-destructive/80 text-white"
                }
              >
                {userLoading ? (
                  <Loader2 className="animate-spin" />
                ) : user.blocked.includes(profile._id) ? (
                  "Unblock"
                ) : (
                  "Block"
                )}
              </AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="mx-auto md:w-4/5 w-full sm:pb-6 pb-20 sm:pt-0 mt-6">
          {children}
        </div>
      </div>
    </>
  );
}

export default Profile;
