import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LooksMax AI — Facial Analysis & Looksmaxxing",
  description:
    "AI-powered facial attractiveness analysis and personalized looksmaxxing recommendations. Upload a photo or use your camera.",
  keywords: ["facial analysis", "looksmaxxing", "AI attractiveness", "beauty analysis", "looksmax"],
  openGraph: {
    title: "LooksMax AI — Discover Your Facial Potential",
    description:
      "AI-powered facial analysis and looksmaxxing recommendations. Upload a photo or use your camera.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#e4e4e7",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}