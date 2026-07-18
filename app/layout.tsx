import type { Metadata } from "next";
import "./globals.css";
import { PageTransitionProvider } from "@/components/PageTransition";
import { SoundPreloader } from "@/components/useSound";

export const metadata: Metadata = {
  title: "AETHER — Premium Scrollytelling Experience",
  description:
    "Witness the seamless assembly of raw performance and design. A premium scroll-linked animation experience.",
};

import { AuthProvider } from "@/lib/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <div className="noise-overlay" />
        <SoundPreloader />
        <AuthProvider>
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
