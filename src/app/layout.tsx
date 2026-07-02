import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nordlite Export | B2B Lighting Manufacturer",
  description:
    "Minimal export-ready lighting for hospitality, retail, and architectural projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-zinc-950">{children}</body>
    </html>
  );
}
