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
import {
  useState,
  createContext,
  PropsWithChildren,
  useEffect,
  useContext,
} from "react";

const initialState = {
  connected: false,
  transport: "N/A",
};

const SocketContext = createContext(initialState);

export function SocketProvider({ children }: PropsWithChildren<{}>) {
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const dispatch = useAppDispatch();
  const { chat } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      console.log("connected");
      setConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      console.log("disconnected");
      setConnected(false);
      setTransport("N/A");
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      document.cookie = `accessToken=${accessToken}`;
    }
    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}`;
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
      console.log(payload);
      console.log(chat?._id);
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
      if (chat?._id === payload.chat) {
        dispatch(reacted(payload));
      }
    }
    function handleUnreact(payload: { user: string; chat: string }) {
      if (chat?._id === payload.chat) {
        dispatch(unreacted(payload));
      }
    }
    function handleError(error: any) {
      console.log("error", error);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", handleError);
    socket.on(ChatEventEnum.MESSAGE_RECIEVED_EVENT, handleMessageReceived);
    socket.on(ChatEventEnum.MESSAGE_DELETE_EVENT, handleMessageDelete);
    socket.on(ChatEventEnum.TYPING_EVENT, typingEventStarted);
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, typingEventStopped);
    socket.on(ChatEventEnum.NEW_EDIT_EVENT, handleMessageUpdate);
    socket.on(ChatEventEnum.NEW_REACT_EVENT, handleReact);
    socket.on(ChatEventEnum.NEW_UNREACT_EVENT, handleUnreact);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("error", handleError);
      socket.off(ChatEventEnum.MESSAGE_RECIEVED_EVENT, handleMessageReceived);
      socket.off(ChatEventEnum.MESSAGE_DELETE_EVENT, handleMessageDelete);
      socket.off(ChatEventEnum.TYPING_EVENT, typingEventStarted);
      socket.off(ChatEventEnum.STOP_TYPING_EVENT, typingEventStopped);
      socket.off(ChatEventEnum.NEW_EDIT_EVENT, handleMessageUpdate);
      socket.off(ChatEventEnum.NEW_REACT_EVENT, handleReact);
      socket.off(ChatEventEnum.NEW_UNREACT_EVENT, handleUnreact);
    };
  }, [chat, dispatch]);

  return (
    <SocketContext.Provider value={{ connected, transport }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
