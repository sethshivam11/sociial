"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

function Page() {
  const annualFeatures = [
    {
      title: "Verified Badge",
      description:
        " Instantly elevate your profile with our exclusive verified badge.",
    },
    {
      title: "One-Time Payment",
      description:
        "Enjoy premium status for a full year with a single payment.",
    },
    {
      title: "No Recurring Fees",
      description:
        "Your plan will not automatically renew, giving you full control.",
    },
    {
      title: "Support us",
      description:
        "Your small denomination can help us build and maintain this software",
    },
  ];

  const monthlyFeatures = [
    {
      title: "Verified Badge",
      description:
        "Instantly boost your profile with our exclusive verified badge.",
    },
    {
      title: "Affordable Monthly Payment",
      description: "Enjoy premium status for just ₹49 per month.",
    },
    {
      title: "No Long-Term Commitment",
      description: "Flexibility to renew or cancel anytime.",
    },
    {
      title: "Support us",
      description:
        "Your small denomination can help us build and maintain this software",
    },
  ];

  const [plan, setPlan] = React.useState("monthly");
  const [alertOpen, setAlertOpen] = React.useState(false);

  return (
    <div className="col-span-10 flex flex-col items-center justify-start relative bg-gradient-to-br from-sky-200 via-stone-100 to-white dark:from-sky-950 dark:via-stone-950 dark:to-black min-h-[100dvh] h-fit pb-4">
      <Link href="/" className="absolute right-2 top-2 rounded-xl">
        <X size="30" />
      </Link>
      <h1 className="lg:text-6xl md:text-5xl text-4xl font-extrabold tracking-tighter md:mt-16 md:mb-12 mt-16 mb-8">
        Upgrade to Premium
      </h1>
      <p className="text-stone-500 lg:text-xl md:text-lg lg:w-1/2 sm:w-2/3 w-4/5 text-center my-2">
        Enjoy a verified badge and support our development team, helping us
        maintain and improve the software. Thanks for your support!
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 md:mt-12 mt-5">
        <Card className="md:w-[380px] sm:w-80 max-sm:mx-4 rounded-2xl">
          <CardHeader>
            <CardTitle>Monthly Premium Plan</CardTitle>
            <CardDescription>Get Verified and Shine!</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 h-[570px]">
            <p>
              <span className="text-3xl tracking-tighter font-extrabold">
                ₹49&nbsp;
              </span>
              <span className="text-stone-500">/month</span>
            </p>
            {monthlyFeatures.map((feature, index) => (
              <div
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                key={index}
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">
                    {feature.title === "Verified Badge" ? (
                      <div className="flex items-center justify-start gap-0.5">
                        {feature.title}
                        <Image
                          src="/icons/premium.svg"
                          alt=""
                          width="20"
                          height="20"
                          className="w-5"
                        />
                      </div>
                    ) : (
                      feature.title
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full rounded-full"
              onClick={() => {
                setPlan("monthly");
                setAlertOpen(true);
              }}
            >
              Subscribe
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:w-[380px] sm:w-80 max-sm:mx-4 rounded-2xl">
          <CardHeader>
            <CardTitle>Annual Premium Plan</CardTitle>
            <CardDescription>Get Verified and Stand Out!</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 h-[570px]">
            <p>
              <span className="text-3xl tracking-tighter font-extrabold">
                ₹499&nbsp;
              </span>
              <span className="text-stone-500">/year</span>
              <span className="inline-block bg-green-500 text-background rounded-full px-2 py-0.5 ml-4 text-sm">
                Save 15%
              </span>
            </p>
            {annualFeatures.map((feature, index) => (
              <div
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                key={index}
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">
                    {feature.title === "Verified Badge" ? (
                      <div className="flex items-center justify-start gap-0.5">
                        {feature.title}
                        <Image
                          src="/icons/premium.svg"
                          alt=""
                          width="20"
                          height="20"
                          className="w-5"
                        />
                      </div>
                    ) : (
                      feature.title
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full rounded-full"
              onClick={() => {
                setPlan("yearly");
                setAlertOpen(true);
              }}
            >
              Subscribe
            </Button>
          </CardFooter>
        </Card>
      </div>
      <AlertDialog open={alertOpen}>
        <AlertDialogContent className="p-8 rounded-lg">
          <AlertDialogTitle>
            <span className="capitalize">{plan}&nbsp;</span>
            Premium Plan
          </AlertDialogTitle>
          <p>
            <span className="text-3xl tracking-tighter font-extrabold">
              {plan === "monthly" ? "₹49" : "₹499"}&nbsp;
            </span>
            <span className="text-stone-500">
              /{plan === "monthly" ? "month" : "year"}
            </span>
          </p>
          <AlertDialogDescription className="text-sm border p-2 rounded-lg">
            By clicking &apos;Confirm & Pay&apos;, you&apos;ll proceed to the payment page
            where you can complete your payment and subscribe to premium for
            just {plan === "monthly" ? "₹49/month" : "₹499/year"}.
            <br />
            Please note, this is a one-time payment for a&nbsp;
            {plan === "monthly" ? "month" : "year"} without any automatic
            renewal.
          </AlertDialogDescription>
          <AlertDialogFooter className="max-sm:flex-col">
            <AlertDialogAction className="w-full rounded-full">
              Confirm & Pay
            </AlertDialogAction>
            <AlertDialogCancel
              className="w-full rounded-full"
              onClick={() => setAlertOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Page;
