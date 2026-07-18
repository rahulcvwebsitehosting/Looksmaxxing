import type { Metadata } from "next";
import { Lexend, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
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
      className={`${lexend.variable} ${sourceSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="light"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #e6e8ec",
              color: "#0f172a",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}