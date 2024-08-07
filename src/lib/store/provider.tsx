"use client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import React from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { toast } from "@/components/ui/use-toast";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    onMessage(messaging, (payload) => {
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });
  }, []);
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
