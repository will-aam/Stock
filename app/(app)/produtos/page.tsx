"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { ProductList } from "@/components/produtos/product-list";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProdutosPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-8 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
            <p className="text-muted-foreground">
              Gerencie o catálogo mestre de produtos e regras fiscais.
            </p>
          </div>
          <Button onClick={() => router.push("/produtos/cadastro")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <Separator />

        <ProductList />
      </main>
    </div>
  );
}
