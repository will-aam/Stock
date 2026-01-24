"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  Pencil,
  Trash2,
  Folder,
  CornerDownRight,
  FolderOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  categorias as initialCategorias,
  Categoria,
} from "@/lib/mock/produtos/categorias";

export function CategoriesManager() {
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);

  // Controle do Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(
    null,
  );

  // Estado do Formulário
  const [tempName, setTempName] = useState("");
  const [parentForNewSub, setParentForNewSub] = useState<string | undefined>(
    undefined,
  ); // ID do pai se for criar sub

  // --- LÓGICA DE DADOS (Árvore) ---
  // 1. Pega só as raízes (Bebidas, Limpeza...)
  const rootCategories = categorias.filter((c) => !c.paiId);

  // 2. Função para pegar os filhos de uma categoria
  const getSubcategories = (parentId: string) => {
    return categorias.filter((c) => c.paiId === parentId);
  };

  // --- AÇÕES ---

  // Abrir modal para NOVA RAIZ
  const handleNewRoot = () => {
    setEditingCategory(null);
    setTempName("");
    setParentForNewSub(undefined); // Sem pai
    setIsDialogOpen(true);
  };

  // Abrir modal para NOVA SUBCATEGORIA
  const handleNewSub = (parentId: string) => {
    setEditingCategory(null);
    setTempName("");
    setParentForNewSub(parentId); // Define quem é o pai
    setIsDialogOpen(true);
  };

  // Abrir modal para EDITAR (Qualquer uma)
  const handleEdit = (categoria: Categoria) => {
    setEditingCategory(categoria);
    setTempName(categoria.nome);
    setParentForNewSub(categoria.paiId); // Mantém o pai atual
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!tempName.trim()) return;

    if (editingCategory) {
      // Atualizar Existente
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, nome: tempName } : c,
        ),
      );
      toast({ description: "Categoria renomeada com sucesso." });
    } else {
      // Criar Nova
      const newCategory: Categoria = {
        id: `cat-${Date.now()}`,
        nome: tempName,
        paiId: parentForNewSub, // Usa o pai definido (ou undefined se for raiz)
      };
      setCategorias((prev) => [...prev, newCategory]);
      toast({
        description: parentForNewSub
          ? "Subcategoria criada."
          : "Categoria principal criada.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    // Bloqueia se tiver filhos (para não quebrar a árvore)
    const hasChildren = categorias.some((c) => c.paiId === id);
    if (hasChildren) {
      toast({
        title: "Ação Bloqueada",
        description:
          "Você precisa apagar as subcategorias antes de apagar a categoria principal.",
        variant: "destructive",
      });
      return;
    }

    setCategorias((prev) => prev.filter((c) => c.id !== id));
    toast({ description: "Categoria removida." });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg border border-dashed">
        <div className="space-y-1">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Estrutura de Categorias
          </h3>
          <p className="text-sm text-muted-foreground">
            Crie pastas principais e organize subcategorias dentro delas.
          </p>
        </div>
        <Button onClick={handleNewRoot} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Nova Categoria Principal
        </Button>
      </div>

      {/* ÁRVORE VISUAL (Accordion) */}
      <div className="space-y-2">
        {rootCategories.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Nenhuma categoria cadastrada. Comece criando uma principal.
          </div>
        )}

        <Accordion type="multiple" className="w-full space-y-2">
          {rootCategories.map((root) => {
            const subcategories = getSubcategories(root.id);

            return (
              <AccordionItem
                key={root.id}
                value={root.id}
                className="border rounded-md px-4 bg-card"
              >
                {/* LINHA DA CATEGORIA PAI */}
                <div className="flex items-center justify-between py-2">
                  <AccordionTrigger className="hover:no-underline py-2 flex-1">
                    <div className="flex items-center gap-2 text-base font-medium">
                      <Folder className="h-5 w-5 text-blue-500 fill-blue-500/20" />
                      {root.nome}
                      <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-0.5 bg-muted rounded-full">
                        {subcategories.length} subcategorias
                      </span>
                    </div>
                  </AccordionTrigger>

                  {/* Ações da Raiz */}
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNewSub(root.id);
                      }}
                      className="h-8 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar Sub
                    </Button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(root);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(root.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* CONTEÚDO (SUBCATEGORIAS) */}
                <AccordionContent className="pb-3 pt-0">
                  {subcategories.length > 0 ? (
                    <div className="pl-4 space-y-1 border-l-2 border-muted ml-2.5 mt-1">
                      {subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="group flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{sub.nome}</span>
                          </div>

                          {/* Ações da Subcategoria (Só aparecem no hover ou mobile) */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEdit(sub)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleDelete(sub.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-8 py-2 text-xs text-muted-foreground italic">
                      Nenhuma subcategoria. Clique em "Adicionar Sub" para
                      criar.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? "Renomear Categoria"
                : parentForNewSub
                  ? "Nova Subcategoria"
                  : "Nova Categoria Principal"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {parentForNewSub && !editingCategory && (
              <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/30 p-2 rounded">
                <Folder className="h-4 w-4" />
                Criando dentro de:{" "}
                <strong>
                  {categorias.find((c) => c.id === parentForNewSub)?.nome}
                </strong>
              </div>
            )}

            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={
                  parentForNewSub ? "Ex: Refrigerante" : "Ex: Bebidas"
                }
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
