"use client";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/slices/userSlice";
import postSlice from "./features/slices/postSlice";
import followSlice from "./features/slices/followSlice";
import pushNotificationSlice from "./features/slices/pushNotificationSlice";
import commentSlice from "./features/slices/commentSlice";
import notificationSlice from "./features/slices/notificationSlice";
import chatSlice from "./features/slices/chatSlice";
import messageSlice from "./features/slices/messageSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    chat: chatSlice,
    follow: followSlice,
    message: messageSlice,
    comment: commentSlice,
    notification: notificationSlice,
    pushNotification: pushNotificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
