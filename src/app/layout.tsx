import { CursorProvider } from "@/context/CursorContext";
import { StartMenuProvider } from "@/context/StartMenuContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Windows XP Multiplayer",
  description: "A multiplayer Windows XP simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Carrega o arquivo de configuração do Firebase */}
        <Script
          src="/config.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CursorProvider>
          <StartMenuProvider>{children}</StartMenuProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
