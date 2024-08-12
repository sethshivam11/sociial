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
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import reportSlice from "./features/slices/reportSlice";
import likeSlice from "./features/slices/likeSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    like: likeSlice,
    chat: chatSlice,
    follow: followSlice,
    report: reportSlice,
    message: messageSlice,
    comment: commentSlice,
    notification: notificationSlice,
    pushNotification: pushNotificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
