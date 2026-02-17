import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LawDrill - Procvičování práva",
  description: "Aplikace pro procvičování práva pomocí interaktivních otázek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
