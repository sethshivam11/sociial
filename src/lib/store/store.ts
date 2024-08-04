"use client";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/slices/userSlice";
import postSlice from "./features/slices/postSlice";
import followSlice from "./features/slices/followSlice";
import pushNotificationSlice from "./features/slices/pushNotificationSlice";
import commentSlice from "./features/slices/commentSlice";
import notificationSlice from "./features/slices/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    follow: followSlice,
    comment: commentSlice,
    notification: notificationSlice,
    pushNotification: pushNotificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
