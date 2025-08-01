import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${poppins.variable} antialiased h-screen`}
      >
        <NextAuthSessionProvider>
          {children}
          <ToasterProvider />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}