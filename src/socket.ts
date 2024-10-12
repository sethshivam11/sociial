"use client";

import { io } from "socket.io-client";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
  {
    extraHeaders: {
      Authorization: `Bearer ${token || ""}`,
    },
  }
);
