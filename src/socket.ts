"use client";

import { io } from "socket.io-client";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : "";

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
  {
    extraHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
  }
);
