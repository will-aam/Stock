"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { ProductList } from "@/components/produtos/product-list";
import { ProductFormSheet } from "@/components/produtos/product-form-sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
// Importa o tipo e o mock inicial
import { produtos as initialProdutos, Produto } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function ProdutosPage() {
  const { toast } = useToast();
  // Estado local dos produtos (simulando banco de dados)
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);

  // Controle do Sheet (Formulário)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);

  // Abrir para CRIAR
  const handleCreate = () => {
    setEditingProduct(null); // Limpa seleção
    setIsSheetOpen(true);
  };

  // Abrir para EDITAR
  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    setIsSheetOpen(true);
  };

  // Salvar (Simulação de Backend)
  const handleSave = (data: Partial<Produto>) => {
    if (editingProduct) {
      // ATUALIZAR
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? ({ ...p, ...data } as Produto) : p,
        ),
      );
      toast({ description: "Produto atualizado com sucesso!" });
    } else {
      // CRIAR NOVO
      const newProduct = {
        ...data,
        id: `prod-${Date.now()}`, // ID temporário
        createdAt: new Date(),
        updatedAt: new Date(),
        // Garante arrays vazios para evitar erro
        precos: [],
        estoque: [],
        imagens: data.imagens || [],
        codigosBarrasAdicionais: data.codigosBarrasAdicionais || [],
        fornecedores: [],
      } as Produto;

      setProdutos((prev) => [newProduct, ...prev]); // Adiciona no topo
      toast({ description: "Produto criado com sucesso!" });
    }
    setIsSheetOpen(false);
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
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/produtos/auxiliares")} // Usando window.location ou router.push
              className="w-full sm:w-auto"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </div>

        <Separator />

        {/* Lista de Produtos */}
        <ProductList
          produtos={produtos}
          onEdit={handleEdit}
          onCreate={handleCreate}
        />

        {/* Formulário (Sheet) */}
        <ProductFormSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          initialData={editingProduct}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
