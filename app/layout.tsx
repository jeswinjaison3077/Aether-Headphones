import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import CustomCursor from "@/components/CustomCursor";
import { PageTransitionProvider } from "@/components/PageTransition";
import { SoundPreloader } from "@/components/useSound";

export const metadata: Metadata = {
  title: "AETHER — Premium Scrollytelling Experience",
=======

export const metadata: Metadata = {
  title: "Evolution — Premium Scrollytelling Experience",
>>>>>>> b65688a6b4da83c578a44bdae3be623940d3f4cc
  description:
    "Witness the seamless assembly of raw performance and design. A premium scroll-linked animation experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
<<<<<<< HEAD
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
        <CustomCursor />
        <SoundPreloader />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
=======
      <body suppressHydrationWarning>{children}</body>
>>>>>>> b65688a6b4da83c578a44bdae3be623940d3f4cc
    </html>
  );
}
