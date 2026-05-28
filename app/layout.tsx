import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina Leads",
  description: "מערכת ניהול לידים",
  applicationName: "Lumina Leads",
  appleWebApp: {
    capable: true,
    title: "Lumina Leads",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#d7baff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <meta name="google-site-verification" content="evxt-_V13_uMX57EhuJlWKX1X7JukqDYNt-ndlnKXTQ" />
      </head>
      <body className="min-h-full flex flex-col text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
