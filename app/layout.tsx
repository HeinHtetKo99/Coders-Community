import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastAlert from "@/components/ToastAlert";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Coders Community",
    template: "Coders Community | %s",
  },
  description: "A community for coders to connect and share knowledge",
  icons: {
    icon: "/logo-rounded.svg",
    apple: "/logo-rounded.svg",
    shortcut: "/logo-rounded.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`text-white bg-secondary ${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <ToastAlert />
      </body>
    </html>
  );
}
