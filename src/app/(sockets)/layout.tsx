import { SocketProvider } from "@/context/SocketProvider";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}

export default Layout;
