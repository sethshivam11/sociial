import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

function Page() {
  const premiumDetails = {
    plan: "Yearly",
    status: "Active",
    expiry: "11:12:03 PM, 12/12/2024",
    lastPayment: "11:12:03 PM, 12/12/2023",
    price: "₹49",
  };

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <h1 className="text-lg tracking-tight font-semibold sm:w-3/4 sm:px-8 w-full text-left sm:my-4 my-2 flex items-center gap-4">
        <Link href="/settings" className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl ml-2 hover:bg-background"
          >
            <ArrowLeft />
          </Button>
        </Link>
        Premium
      </h1>
      <div className="sm:w-3/4 w-full px-8 space-y-8 mt-2 max-sm:mt-4">
        <h1 className="font-bold text-xl">Current Plan</h1>
        <div className="grid grid-cols-2 gap-2 overflow-x-auto h-fit relative">
          <div>Plan</div>
          <div>{premiumDetails.plan}</div>
          <div>Status</div>
          <div>{premiumDetails.status}</div>
          <div>Expiry</div>
          <div>{premiumDetails.expiry}</div>
          <div>Price</div>
          <div>{premiumDetails.price}</div>
          <div>Last Payment</div>
          <div>{premiumDetails.lastPayment}</div>
        </div>
        <h1 className="font-bold text-xl">Checkout more plans</h1>
        <div className="grid grid-cols-2 gap-2 overflow-x-auto h-fit relative">
          <div>Plan</div>
          <div>{premiumDetails.plan === "monthly" ? "Yearly" : "Monthly"}</div>
          <div>Perks</div>
          <div className="flex items-center justify-start gap-0.5">
            Verified Badge
            <Image src="/icons/premium.svg" alt="" width="24" height="24" />
          </div>
          <div>Price</div>
          <div>{premiumDetails.price === "₹49" ? "₹499" : "₹49"}</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
