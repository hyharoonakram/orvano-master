import type { Metadata } from "next";
import { Cinzel, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyProvider";

import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PageNavigationLoader } from "@/components/layout/PageNavigationLoader";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ORVANO | Luxury Watches & Premium Streetwear",
  description: "Bridging High-End Horology with Underground Streetwear.",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
      suppressHydrationWarning
      className={`${cinzel.variable} ${montserrat.variable} ${greatVibes.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="dns-prefetch" href="https://supabase.co" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-black text-white">
        <PageNavigationLoader />
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
