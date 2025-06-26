import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToasterProvider } from "@/components/ToasterProvider";
import NextAuthSessionProvider from "@/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyBuddy", 
  description: "Share and discover study materials with fellow students at Seneca College.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <NextAuthSessionProvider>
          <ThemeProvider>
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}