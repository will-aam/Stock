// app/layout.tsx
import type React from "react";
// import { MobileNav } from "@/components/layout/mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar visível apenas em Desktop */}
      <AppSidebar />

      {/* A altura da tela é travada aqui (h-screen) */}
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        {/* Header Mobile */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs">
              V
            </div>
            Stock System
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </SidebarInset>

      {/* Navegação Inferior (Apenas Mobile) */}
      {/* <MobileNav /> */}
    </SidebarProvider>
  );
}
