// app/erp-web/app/(app)/produtos/page.tsx
"use client";

import { useState } from "react";
import { ProductList } from "@/components/produtos/product-list";
import { ProductFormSheet } from "@/components/produtos/product-form-sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Upload } from "lucide-react";
import { produtos as initialProdutos, Produto } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

// --- NOVOS IMPORTS DO WIZARD ---
import { ProductWizardSheet } from "@/components/produtos/wizard/product-wizard-sheet";
import { useWizardStore } from "@/components/produtos/wizard/use-wizard-store";

// --- NOVO IMPORT DA IMPORTAÇÃO XML ---
import { ProductImportSheet } from "@/components/produtos/import/product-import-sheet";

export default function ProdutosPage() {
  const { toast } = useToast();

  // Estado local dos produtos
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);

  // --- CONTROLE DO WIZARD (Zustand) ---
  const { setOpen: openWizard, reset: resetWizard, setOpen } = useWizardStore();

  // --- CONTROLE DOS SHEETS LOCAIS ---
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false); // Novo estado

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
    const newProduct: any = {
      id: `prod-${Date.now()}`,
      ativo: true,
      nome: wizardData.nome,
      unidade: wizardData.unidade,
      codigoBarras: wizardData.codigoBarras,
      codigoInterno: wizardData.codigoInterno,
      categoriaId: wizardData.categoriaId,
      subcategoriaId: wizardData.subcategoriaId,
      marcaId: wizardData.marcaId,
      ncm: wizardData.ncm,
      cest: wizardData.cest,
      origem: wizardData.origem || 0,
      grupoTributarioId: wizardData.grupoTributarioId,
      controlaEstoque: wizardData.controlaEstoqueEscolhaUsuario ?? true,
      tipoItem: wizardData.role === "insumo" ? "01" : "00",
      controlaLote: wizardData.controlaLote,
      controlaValidade: wizardData.controlaValidade,
      catalogo: {
        publicar: wizardData.apareceNoCupom ?? false,
        destaque: false,
        ordem: 99,
      },
      precos: wizardData.precoVenda
        ? [
            {
              empresaId: "emp-1",
              precoCusto: 0,
              tabelas: [
                { id: "tab-1", nome: "Varejo", valor: wizardData.precoVenda },
              ],
            },
          ]
        : [],
      estoque:
        wizardData.controlaEstoqueEscolhaUsuario !== false
          ? [
              {
                empresaId: "emp-1",
                atual: 0,
                minimo: wizardData.estoqueMinimo || 0,
                maximo: 0,
                localizacao: wizardData.localizacao,
              },
            ]
          : [],
      imagens: [],
      fornecedores: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProdutos((prev) => [newProduct, ...prev]);

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
      className: "border-l-4 border-l-green-500",
      duration: 5000,
    });

    setOpen(false);
  };

  // 4. Salvar da Importação XML (Em Massa)
  const handleImportXML = (importedProducts: any[]) => {
    // Adiciona metadados do sistema aos produtos crus do XML
    const finalProducts = importedProducts.map((p, index) => ({
      ...p,
      id: `xml-${Date.now()}-${index}`, // ID Provisório
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Garante arrays vazios para não quebrar a UI
      imagens: [],
      codigosBarrasAdicionais: [],
      precos: p.precoVenda
        ? [
            {
              empresaId: "emp-1",
              precoCusto: p.custoUltimaCompra,
              tabelas: [{ id: "tab-1", nome: "Varejo", valor: p.precoVenda }],
            },
          ]
        : [],
      estoque: p.controlaEstoque
        ? [
            {
              empresaId: "emp-1",
              atual: 0, // Nota: Importação de cadastro não deve somar estoque automaticamente por segurança
              minimo: p.estoqueMinimo,
            },
          ]
        : [],
    }));

    setProdutos((prev) => [...finalProducts, ...prev]);

    toast({
      description: (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <Upload className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">Importação Concluída!</p>
            <p className="text-xs text-muted-foreground">
              {importedProducts.length} produtos foram adicionados ao catálogo.
            </p>
          </div>
        </div>
      ),
      className: "border-l-4 border-l-blue-500",
      duration: 5000,
    });
  };

  // 5. Salvar da Edição (Formulário Antigo)
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
      <main className="container mx-auto max-w-6xl space-y-6 p-4 md:py-8">
        {/* Lista de Produtos (Agora com a Toolbar Integrada) */}
        <ProductList
          produtos={produtos}
          onEdit={handleEdit}
          onCreate={handleCreate}
          onImport={() => setIsImportSheetOpen(true)}
        />

        {/* 1. Formulário Antigo (Edição) */}
        <ProductFormSheet
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          initialData={editingProduct}
          onSave={handleSaveEdit}
        />

        {/* 2. Novo Wizard (Criação Manual) */}
        <ProductWizardSheet onSave={handleWizardSave} />

        {/* 3. Sheet de Importação XML (Criação em Massa) */}
        <ProductImportSheet
          open={isImportSheetOpen}
          onOpenChange={setIsImportSheetOpen}
          onImport={handleImportXML}
        />
      </main>
    </div>
  );
}
