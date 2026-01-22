// app/(no-sidebar)/layout.tsx
import type React from "react";

/**
 * Layout "Limpo" para páginas sem sidebar (como a Loja de Solicitação).
 * Ele NÃO adiciona nenhum header ou padding automático.
 * Quem controla o layout agora é a própria página (page.tsx).
 */
export default function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">{children}</div>
  );
}
