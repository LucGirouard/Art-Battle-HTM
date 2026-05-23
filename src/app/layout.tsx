import type { Metadata, Viewport } from "next";
import "./globals.css";

const metadataBase =
  process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.length > 0
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Art Battle",
    template: "%s | Art Battle",
  },
  description: "Modern 1v1 sketch battles with quick room-based matchmaking.",
  applicationName: "Art Battle",
  appleWebApp: {
    capable: true,
    title: "Art Battle",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f1e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
