import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CompanyList } from "@/components/empresas/company-list";
import { Separator } from "@/components/ui/separator";

export default function EmpresasPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-8 p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Gerenciar Empresas
          </h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie suas filiais e unidades de negócio.
          </p>
        </div>

        <Separator />

        <CompanyList />
      </main>
    </div>
  );
}
