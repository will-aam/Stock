import type React from "react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar visível apenas em Desktop (padrão do componente Sidebar) */}
      <AppSidebar />

      <SidebarInset>
        {/* Header Mobile / Trigger do Sidebar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          {/* Opcional: Se quiser abrir o sidebar no mobile também, descomente a linha abaixo */}
          {/* <SidebarTrigger className="-ml-1" /> */}
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs">
              V
            </div>
            Val System
          </div>
        </header>

        {/* Conteúdo da Página */}
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>

      {/* Navegação Inferior (Apenas Mobile) */}
      <MobileNav />
    </SidebarProvider>
  );
}
