"use client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import React from "react";
import {
  isSupported,
  onMessage,
  getMessaging,
  Messaging,
} from "firebase/messaging";
import { toast } from "@/components/ui/use-toast";
import { initializeApp } from "firebase/app";

let messaging: Messaging;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    isSupported().then((isSupported) => {
      if (isSupported) {
        onMessage(messaging, (payload) => {
          toast({
            title: payload.notification?.title,
            description: payload.notification?.body,
          });
        })
      }
    });
  }, []);
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

export { messaging };
