"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { ProductList } from "@/components/produtos/product-list";
import { ProductFormSheet } from "@/components/produtos/product-form-sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";
import { produtos as initialProdutos, Produto } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

// --- NOVOS IMPORTS DO WIZARD ---
import { ProductWizardSheet } from "@/components/produtos/wizard/product-wizard-sheet";
import { useWizardStore } from "@/components/produtos/wizard/use-wizard-store";

export default function ProdutosPage() {
  const { toast } = useToast();

  // Estado local dos produtos
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);

  // --- CONTROLE DO WIZARD (Zustand) ---
  const { setOpen: openWizard, reset: resetWizard, setOpen } = useWizardStore();

  // --- CONTROLE DO FORMULÁRIO ANTIGO (Edição) ---
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);

  // 1. Abrir para CRIAR (Wizard)
  const handleCreate = () => {
    resetWizard();
    openWizard(true);
  };

  // 2. Abrir para EDITAR (Formulário Completo)
  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    setIsEditSheetOpen(true);
  };

  // 3. Salvar do Wizard (Criação Rápida)
  const handleWizardSave = (wizardData: any) => {
    // Aqui fazemos a "Mágica": Converter os dados simples do Wizard
    // para a estrutura complexa do Produto (com arrays de lojas, etc)

    const newProduct: any = {
      id: `prod-${Date.now()}`, // ID único temporário
      ativo: true,
      nome: wizardData.nome,
      unidade: wizardData.unidade,
      codigoBarras: wizardData.codigoBarras,
      codigoInterno: wizardData.codigoInterno,

      // Categorização
      categoriaId: wizardData.categoriaId,
      marcaId: wizardData.marcaId,

      // Fiscal
      ncm: wizardData.ncm,
      cest: wizardData.cest,
      origem: wizardData.origem || 0,
      grupoTributarioId: wizardData.grupoTributarioId,

      // Flags Logísticas
      controlaEstoque: wizardData.controlaEstoqueEscolhaUsuario ?? true,
      tipoItem: wizardData.role === "insumo" ? "01" : "00", // Exemplo de lógica automática

      // Mapeamento de Preço (Cria tabela para a Matriz/Empresa 1)
      precos: wizardData.precoVenda
        ? [
            {
              empresaId: "emp-1", // Assumindo Matriz
              precoCusto: 0,
              tabelas: [
                { id: "tab-1", nome: "Varejo", valor: wizardData.precoVenda },
              ],
            },
          ]
        : [],

      // Mapeamento de Estoque (Cria registro para a Matriz)
      estoque:
        wizardData.controlaEstoqueEscolhaUsuario !== false
          ? [
              {
                empresaId: "emp-1",
                atual: 0, // Começa zerado
                minimo: wizardData.estoqueMinimo || 0,
                localizacao: wizardData.localizacao,
              },
            ]
          : [],

      imagens: [],
      fornecedores: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Adiciona ao topo da lista
    setProdutos((prev) => [newProduct, ...prev]);

    // Toast Customizado e Bonito
    toast({
      description: (
        <div className="flex items-center gap-3">
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">Produto Cadastrado!</p>
            <p className="text-xs text-muted-foreground">
              {wizardData.nome} já está disponível para vendas.
            </p>
          </div>
        </div>
      ),
      className: "border-l-4 border-l-green-500", // Borda lateral verde para destaque
      duration: 5000,
    });

    // Fecha o Wizard
    setOpen(false);
  };

  // 4. Salvar da Edição (Formulário Antigo)
  const handleSaveEdit = (data: Partial<Produto>) => {
    if (editingProduct) {
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
        {/* Passamos a função onSave aqui! */}
        <ProductWizardSheet onSave={handleWizardSave} />
      </main>
    </div>
  );
}
