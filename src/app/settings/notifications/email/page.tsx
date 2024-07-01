"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  const [emailPreferences, setEmailPreferences] = React.useState({
    products: true,
    announcements: true,
    support: true,
  });

  React.useEffect(() => {
    console.log(emailPreferences);
  }, [emailPreferences]);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <h1 className="sm:w-2/3 text-xl font-semibold pt-5 max-sm:pb-4 pb-8 flex items-center gap-3 w-full max-sm:px-6">
        <Link href="/settings/notifications" className="sm:hidden">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft />
          </Button>
        </Link>
        Email Notifications
      </h1>
      <div className="sm:w-2/3 w-full max-sm:px-10 sm:space-y-8 space-y-5">
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="text-lg w-full mb-2">New Products</h2>
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
              className="w-6 h-6 accent-white"
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
              className="w-6 h-6 accent-white"
            />
            On
          </Label>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="text-lg w-full mb-2">Announcements</h2>
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
              className="w-6 h-6 accent-white"
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
              className="w-6 h-6 accent-white"
            />
            On
          </Label>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <h2 className="text-lg w-full mb-2">Support Emails</h2>
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
              className="w-6 h-6 accent-white"
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
              className="w-6 h-6 accent-white"
            />
            On
          </Label>
        </div>
      </div>
    </div>
  );
}

export default Page;
