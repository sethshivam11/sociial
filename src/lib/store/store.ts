"use client";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userSlice from "./features/slices/userSlice";
import postSlice from "./features/slices/postSlice";
import followSlice from "./features/slices/followSlice";
import commentSlice from "./features/slices/commentSlice";
import notificationSlice from "./features/slices/notificationSlice";
import chatSlice from "./features/slices/chatSlice";
import messageSlice from "./features/slices/messageSlice";
import reportSlice from "./features/slices/reportSlice";
import storySlice from "./features/slices/storySlice";
import notificationPreferenceSlice from "./features/slices/notificationPreferenceSlice";
import callSlice from "./features/slices/callSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    call: callSlice,
    chat: chatSlice,
    story: storySlice,
    follow: followSlice,
    report: reportSlice,
    message: messageSlice,
    comment: commentSlice,
    notification: notificationSlice,
    notificationPreference: notificationPreferenceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
