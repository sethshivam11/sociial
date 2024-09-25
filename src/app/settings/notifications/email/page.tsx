"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  getPreferences,
  updatePreferences,
} from "@/lib/store/features/slices/notificationPreference";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  const dispatch = useAppDispatch();
  const { emailNotifications, loading } = useAppSelector(
    (state) => state.notificationPreference
  );
  const [emailPreferences, setEmailPreferences] = React.useState({
    products: true,
    announcements: true,
    support: true,
  });

  function handleUpdatePreference() {
    dispatch(updatePreferences(emailPreferences)).then((response) => {
      if (response.payload?.success) {
        const { products, announcements, support } =
          response.payload.data.emails;
        setEmailPreferences({
          products,
          announcements,
          support,
        });
        toast({
          title: "Preferences updated",
          description: "Your email preferences have been updated",
        });
      } else {
        toast({
          title: "Cannot update preferences",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    });
  }

  React.useEffect(() => {
    dispatch(getPreferences()).then((response) => {
      if (response.payload?.success) {
        const { products, announcements, support } =
          response.payload.data.emails;
        setEmailPreferences({
          products,
          announcements,
          support,
        });
      }
    });
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <h1 className="text-lg tracking-tight font-semibold sm:w-2/3 w-full text-left sm:my-4 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings/notifications">
          <ChevronLeft />
        </Link>
        Email Notifications
      </h1>
      <p className="text-stone-500 text-sm text-left sm:w-2/3 w-full">
        Important emails about your account and activity on the platform will be
        sent to you even if you opt out of all the options below.
      </p>
      <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5 mt-6">
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">New Products</h2>
          <Label
            htmlFor="products-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="products-off"
              name="products"
              checked={!emailPreferences.products}
              onChange={(e) =>
                setEmailPreferences({
                  ...emailPreferences,
                  products: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="products-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="products-on"
              name="products"
              checked={emailPreferences.products}
              onChange={(e) =>
                setEmailPreferences({
                  ...emailPreferences,
                  products: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Announcements</h2>
          <Label
            htmlFor="announcements-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="announcements-off"
              name="announcements"
              checked={!emailPreferences.announcements}
              onChange={(e) =>
                setEmailPreferences({
                  ...emailPreferences,
                  announcements: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="announcements-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="announcements-on"
              name="announcements"
              checked={emailPreferences.announcements}
              onChange={(e) =>
                setEmailPreferences({
                  ...emailPreferences,
                  announcements: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="w-full mb-2">Support Emails</h2>
          <Label
            htmlFor="support-off"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="support-off"
              name="support"
              checked={!emailPreferences.support}
              onChange={(e) =>
                setEmailPreferences({
                  ...emailPreferences,
                  support: e.target.checked ? false : true,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            Off
          </Label>
          <Label
            htmlFor="support-on"
            className="flex gap-2 items-center justify-start font-light cursor-pointer w-full"
          >
            <input
              type="radio"
              id="support-on"
              name="support"
              checked={emailPreferences.support}
              onChange={(e) =>
                setEmailPreferences({
                  ...emailPreferences,
                  support: e.target.checked ? true : false,
                })
              }
              className="w-6 h-6 accent-black dark:accent-white"
            />
            On
          </Label>
        </div>
        <Button
          size="lg"
          onClick={handleUpdatePreference}
          disabled={
            loading ||
            Object.keys(emailPreferences).every(
              (key) =>
                emailPreferences[key as keyof typeof emailPreferences] ===
                emailNotifications[key as keyof typeof emailNotifications]
            )
          }
        >
          Update Preferences
        </Button>
      </div>
    </div>
  );
}

export default Page;
