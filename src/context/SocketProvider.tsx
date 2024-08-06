"use client";

import { socket } from "@/socket";
import React from "react";

const initialState = {
  connected: false,
};

const SocketContext = React.createContext(initialState);

export function SocketProvider({ children }: React.PropsWithChildren<{}>) {
  const [connected, setConnected] = React.useState(false);

//   React.useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (accessToken) {
//       document.cookie = `accessToken=${accessToken}`;
//     }
//     if (refreshToken) {
//       document.cookie = `refreshToken=${refreshToken}`;
//     }
//     function handleConnection() {
//       setConnected(true);
//       console.log("Connected to socket server");
//     }
//     function handleDisconnection() {
//       setConnected(false);
//       console.log("Disconnected from socket server");
//     }

//     socket.on("connect", handleConnection);
//     socket.on("disconnect", handleDisconnection);

//     return () => {
//       socket.off("connect", handleConnection);
//       socket.off("disconnect", handleDisconnection);
//     };
//   }, []);
  return (
    <SocketContext.Provider value={{ connected }}>
      {children}
    </SocketContext.Provider>
  );
}

