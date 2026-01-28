// app/(app)/produtos/page.tsx
"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { ProductList } from "@/components/produtos/product-list";
import { ProductFormSheet } from "@/components/produtos/product-form-sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// Importa o tipo e o mock inicial
import { produtos as initialProdutos, Produto } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

// --- NOVOS IMPORTS DO WIZARD ---
import { ProductWizardSheet } from "@/components/produtos/wizard/product-wizard-sheet";
import { useWizardStore } from "@/components/produtos/wizard/use-wizard-store";

export default function ProdutosPage() {
  const { toast } = useToast();
  // Estado local dos produtos (simulando banco de dados)
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);

  // --- CONTROLE DO WIZARD (Zustand) ---
  const { setOpen: openWizard, reset: resetWizard } = useWizardStore();

  // --- CONTROLE DO FORMULÁRIO ANTIGO (Apenas para Edição) ---
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);

  // Abrir para CRIAR (Usa o Novo Wizard)
  const handleCreate = () => {
    resetWizard(); // Limpa o wizard para começar do zero
    openWizard(true); // Abre via Zustand
  };

  // Abrir para EDITAR (Mantém o Form Antigo por enquanto)
  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    setIsEditSheetOpen(true);
  };

  // Salvar (Simulação de Backend para o Form de Edição)
  const handleSaveEdit = (data: Partial<Produto>) => {
    if (editingProduct) {
      // ATUALIZAR
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? ({ ...p, ...data } as Produto) : p,
        ),
      );
      toast({ description: "Produto atualizado com sucesso!" });
    }
    setIsEditSheetOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-6 p-4 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Catálogo de Produtos
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie o cadastro mestre, regras fiscais e identificação dos
              itens.
            </p>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <Separator />

        {/* Lista de Produtos */}
        <ProductList
          produtos={produtos}
          onEdit={handleEdit}
          onCreate={handleCreate}
        />

        {/* 1. Formulário Antigo (Apenas para Edição) */}
        <ProductFormSheet
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          initialData={editingProduct}
          onSave={handleSaveEdit}
        />

        {/* 2. Novo Wizard (Apenas para Criação) */}
        <ProductWizardSheet />
      </main>
    </div>
  );
}
