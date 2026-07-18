import type { Metadata } from "next";
import { Kalam, Patrick_Hand, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const kalam = Kalam({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const patrickHand = Patrick_Hand({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LooksMax AI — Facial Analysis & Looksmaxxing",
  description:
    "AI-powered facial attractiveness analysis and personalized looksmaxxing recommendations.",
  keywords: ["facial analysis", "looksmaxxing", "AI attractiveness", "beauty analysis", "looksmax"],
  openGraph: {
    title: "LooksMax AI — Discover Your Facial Potential",
    description:
      "AI-powered facial analysis and looksmaxxing recommendations.",
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
      className={`${kalam.variable} ${patrickHand.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-pencil font-body">
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="light"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "2px solid #2d2d2d",
              borderRadius: "10px 16px 12px 14px",
              color: "#2d2d2d",
              fontFamily: "var(--font-body)",
              boxShadow: "3px 3px 0 0 #2d2d2d",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
