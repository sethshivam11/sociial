"use client";

import { newMessage } from "@/lib/store/features/slices/chatSlice";
import {
  messageReceived,
  setTyping,
} from "@/lib/store/features/slices/messageSlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { socket } from "@/socket";
import { MessageI } from "@/types/types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  connected: false,
};

const SocketContext = React.createContext(initialState);

export function SocketProvider({ children }: React.PropsWithChildren<{}>) {
  const dispatch: AppDispatch = useDispatch();
  const { chat } = useSelector((state: RootState) => state.chat);
  const [connected, setConnected] = React.useState(false);

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
      setTyping(true);
    }
    function typingEventStopped() {
      setTyping(false);
    }
    function handleMessageReceived(payload: MessageI) {
      if (chat && chat._id === payload.chat) {
        dispatch(messageReceived(payload));
      } else {
        dispatch(newMessage(payload));
      }
    }

    socket.on("connect", handleConnection);
    socket.on("disconnect", handleDisconnection);

    return () => {
      socket.off("connect", handleConnection);
      socket.off("disconnect", handleDisconnection);
      socket.disconnect();
    };
  }, [chat, dispatch]);

  return (
    <SocketContext.Provider value={{ connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => React.useContext(SocketContext);
