import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClassificationManager } from "@/components/produtos/classification-manager";
import { Separator } from "@/components/ui/separator";

export default function ClassificacaoPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-4xl space-y-8 p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Classificação de Produtos
          </h2>
          <p className="text-muted-foreground">
            Gerencie as Categorias e Subcategorias para organizar seu estoque.
          </p>
        </div>

        <Separator />

        <ClassificationManager />
      </main>
    </div>
  );
}
