import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google"; // Mudamos para Public Sans
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Configuração da nova fonte
const publicSans = Public_Sans({
  subsets: ["latin"],
  // Carregamos pesos variados para garantir boa hierarquia no ERP
  weight: ["300", "400", "500", "600", "700"],
  // Definimos uma variável CSS para usar no Tailwind
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Stock System",
  description: "Sistema de Gestão de Estoque",
  icons: {
    icon: "/icon.svg",
  },
};

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
      {/* Adicionamos a variável da fonte e 'antialiased' para suavizar */}
      <body className={`${publicSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
