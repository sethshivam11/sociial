import { SocketProvider } from "@/context/SocketProvider";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}

export default Layout;
