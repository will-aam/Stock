"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { ProductFormFiscal } from "@/components/produtos/product-form-fiscal";
import { ProdutoFiscal } from "@/types/produto-fiscal";
import { Separator } from "@/components/ui/separator";

export default function CadastroProdutoPage() {
  const router = useRouter();

  const handleSave = (produto: ProdutoFiscal) => {
    console.log("Produto salvo (simulação):", produto);
    // Aqui entrará a lógica de salvar no banco futuramente
    // Após salvar, redireciona para a listagem
    router.push("/produtos");
  };

  const handleCancel = () => {
    // Ao cancelar, volta para a listagem
    router.push("/produtos");
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-4xl space-y-8 p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Novo Produto Fiscal
          </h2>
          <p className="text-muted-foreground">
            Preencha os dados fiscais e cadastrais do item.
          </p>
        </div>

        <Separator />

        <ProductFormFiscal onSave={handleSave} onCancel={handleCancel} />
      </main>
    </div>
  );
}
