import { PeerProvider } from "@/context/PeerProvider";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <PeerProvider>{children}</PeerProvider>;
}

export default Layout;
