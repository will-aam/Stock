import type React from "react";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Layout para páginas que NÃO devem exibir o sidebar.
 * Coloque as páginas que você quer sem sidebar em:
 *  app/(no-sidebar)/<sua-pasta>/page.tsx
 *
 * Observação: esse layout é um Server Component por padrão.
 */
export default function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header Mobile (similar ao app layout, sem SidebarTrigger) */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs">
            V
          </div>
          Stock System
        </div>
      </header>

      {/* Conteúdo da página */}
      <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>

      {/* Navegação Inferior (apenas mobile) — reutiliza o componente existente */}
      <MobileNav />
    </>
  );
}
