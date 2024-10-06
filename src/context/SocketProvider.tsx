"use client";

import { ChatEventEnum } from "@/lib/helpers";
import {
  messageDeleted,
  messageReceived,
  messageUpdated,
  reacted,
  setTyping,
  unreacted,
} from "@/lib/store/features/slices/messageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { socket } from "@/socket";
import { MessageI } from "@/types/types";
import React from "react";

const initialState = {
  connected: false,
};

const SocketContext = React.createContext(initialState);

export function SocketProvider({ children }: React.PropsWithChildren<{}>) {
  const [connected, setConnected] = React.useState(false);

  const dispatch = useAppDispatch();
  const { chat } = useAppSelector((state) => state.chat);
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      document.cookie = `accessToken=${accessToken}`;
    }
    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}`;
    }
    function handleConnection() {
      setConnected(true);
      console.log("Connected to socket server");
    }
    function handleDisconnection() {
      setConnected(false);
      console.log("Disconnected from socket server");
    }
    function typingEventStarted() {
      console.log("typing started");
      setTyping(true);
    }
    function typingEventStopped() {
      console.log("typing stopped");
      setTyping(false);
    }
    function handleMessageReceived(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageReceived(payload));
      }
    }
    function handleMessageDelete(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageDeleted(payload));
      }
    }
    function handleMessageUpdate(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageUpdated(payload));
      }
    }
    function handleReact(payload: {
      user: string;
      content: string;
      chat: string;
    }) {
      console.log(payload);
      if (chat?._id === payload.chat) {
        dispatch(reacted(payload));
      }
    }
    function handleUnreact(payload: { user: string; chat: string }) {
      console.log(payload);
      if (chat?._id === payload.chat) {
        dispatch(unreacted(payload));
      }
    }

    socket.on("connect", handleConnection);
    socket.on("disconnect", handleDisconnection);
    socket.on(ChatEventEnum.MESSAGE_RECIEVED_EVENT, handleMessageReceived);
    socket.on(ChatEventEnum.MESSAGE_DELETE_EVENT, handleMessageDelete);
    socket.on(ChatEventEnum.TYPING_EVENT, typingEventStarted);
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, typingEventStopped);
    socket.on(ChatEventEnum.NEW_EDIT_EVENT, handleMessageUpdate);
    socket.on(ChatEventEnum.NEW_REACT_EVENT, handleReact);
    socket.on(ChatEventEnum.NEW_UNREACT_EVENT, handleUnreact);

    return () => {
      socket.off("connect", handleConnection);
      socket.off("disconnect", handleDisconnection);
      socket.off(ChatEventEnum.MESSAGE_RECIEVED_EVENT, handleMessageReceived);
      socket.off(ChatEventEnum.MESSAGE_DELETE_EVENT, handleMessageDelete);
      socket.off(ChatEventEnum.TYPING_EVENT, typingEventStarted);
      socket.off(ChatEventEnum.STOP_TYPING_EVENT, typingEventStopped);
      socket.off(ChatEventEnum.NEW_EDIT_EVENT, handleMessageUpdate);
      socket.off(ChatEventEnum.NEW_REACT_EVENT, handleReact);
      socket.off(ChatEventEnum.NEW_UNREACT_EVENT, handleUnreact);
    };
  }, [chat?._id, dispatch]);

  return (
    <SocketContext.Provider value={{ connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => React.useContext(SocketContext);
