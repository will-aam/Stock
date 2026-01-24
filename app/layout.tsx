import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock System",
  description: "Sistema de Gestão de Estoque",
  icons: {
    icon: "/icon.svg",
  },
};

// Nova forma de exportar viewport e themeColor no Next.js 14+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
