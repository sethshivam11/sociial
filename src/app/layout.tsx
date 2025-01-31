import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "@/lib/store/provider";
import { SocketProvider } from "@/context/SocketProvider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_LINK || "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Sociial",
  description:
    "Sociial is a vibrant community where you can connect, share, and grow. Join us and start your social journey today!",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico",
  },
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Sociial",
    description:
      "Sociial is a vibrant community where you can connect, share, and grow. Join us and start your social journey today!",
    siteName: "Shivam",
    images: [
      {
        url: `${baseUrl}/opengraph-image.jpg`,
        type: "image/jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sociial",
    description:
      "Sociial is a vibrant community where you can connect, share, and grow. Join us and start your social journey today!",
    creator: "@sethshivam11",
    siteId: "765045797750706176",
    images: [
      {
        url: `${baseUrl}/opengraph-image.jpg`,
        type: "image/jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-[100dvh] grid grid-cols-10 bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreProvider>
            <SocketProvider>
              <Navbar />
              {children}
              <Toaster />
            </SocketProvider>
          </StoreProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
