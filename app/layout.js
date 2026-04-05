import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MentorMeet",
  description: "Üniversite seçmeden önce o meslekten biriyle konuş",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <meta name="theme-color" content="#1a2744" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MentorMeet" />
      </head>
      <body className="min-h-full flex flex-col" style={{backgroundColor: '#f8f7f4'}}>{children}</body>
    </html>
  )
}