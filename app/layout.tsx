import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evolution — Premium Scrollytelling Experience",
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
