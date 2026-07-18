import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
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
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-950 text-ink-100 font-sans">
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            style: {
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ededef",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}