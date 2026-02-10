"use client";

import { DashboardHeader } from "@/components/home/dashboard-header";
import { UnitsManager } from "@/components/cadastros/units-manager";
import { Separator } from "@/components/ui/separator";

export default function UnidadesPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-5xl space-y-6 p-4 md:py-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Unidades & Medidas
          </h2>
          <p className="text-sm text-muted-foreground">
            Defina as unidades de medida padrão para controle de estoque e
            conversões (KG, UN, LT).
          </p>
        </div>

        <Separator />

        <UnitsManager />
      </main>
    </div>
  );
}
