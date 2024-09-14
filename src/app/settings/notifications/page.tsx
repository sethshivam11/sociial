"use client";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { handleConsent } from "@/lib/helpers";
import { useAppDispatch } from "@/lib/store/store";
import { saveToken } from "@/lib/store/features/slices/pushNotificationSlice";

function Page() {
  const dispatch = useAppDispatch();
  const [savingToken, setSavingToken] = React.useState(false);
  const [consentDialog, setConsentDialog] = React.useState(false);

  async function handleSaveToken() {
    const response = await handleConsent(setSavingToken, setConsentDialog);
    if (response?.toast) {
      toast(response.toast);
    } else if(response.token) {
      dispatch(saveToken(response.token));
    }
  }

  React.useEffect(() => {
    const savedConsent = JSON.parse(
      localStorage.getItem("notificationConsent") || "{}"
    );
    if (savedConsent.consent !== true) {
      setConsentDialog(true);
    }
  }, [setConsentDialog]);

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto max-h-[100dvh] h-full xl:col-span-8 sm:col-span-9 col-span-10 w-full">
      <h1 className="text-lg sm:text-xl tracking-tight font-semibold sm:w-3/4 sm:px-8 w-full text-left sm:my-4 my-2 flex items-center gap-4">
        <Link className="sm:hidden ml-2 p-2" href="/settings">
          <ChevronLeft />
        </Link>
        Notifications
      </h1>
      <div className="sm:w-3/4 w-full px-8 space-y-8 mt-4">
        <div className="flex flex-col gap-2 py-2 w-full items-center justify-start ring-1 ring-stone-200 dark:ring-stone-800 rounded-xl">
          <Link
            href="/settings/notifications/push"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Push notifications <ChevronRight />
          </Link>
          <Link
            href="/settings/notifications/email"
            className="flex items-center justify-between w-full py-2 px-4"
          >
            Email notifications <ChevronRight />
          </Link>
        </div>
      </div>
      <AlertDialog open={consentDialog}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogTitle>Recieve Notifications</AlertDialogTitle>
          <p className="dark:text-stone-400">
            Do you want to recieve notifications for messages, comments, likes,
            and updates. You can unsubscribe anytime.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg"
              onClick={() => {
                localStorage.setItem(
                  "notificationConsent",
                  `{"consent": "false","expiry": "${
                    Date.now() + 1000 * 60 * 60 * 24 * 10
                  }"}`
                );
                setConsentDialog(false);
              }}
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg"
              onClick={handleSaveToken}
              disabled={savingToken}
            >
              {savingToken ? <Loader2 className="animate-spin" /> : "Yes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Page;
