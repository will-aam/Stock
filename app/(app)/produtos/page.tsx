import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProductList } from "@/components/produtos/product-list";
import { Separator } from "@/components/ui/separator";

export default function ProdutosPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-8 p-4">
        <ProductList />
      </main>
    </div>
  );
}
