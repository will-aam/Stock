"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, FolderTree, Tag, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Tipo para Categoria
type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

// Tipo para Subcategoria
type Subcategory = {
  id: string;
  name: string;
};

export function ClassificationManager() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Bebidas",
      subcategories: [
        { id: "1-1", name: "Refrigerantes" },
        { id: "1-2", name: "Sucos" },
        { id: "1-3", name: "Águas" },
        { id: "1-4", name: "Cervejas" },
      ],
    },
    {
      id: "2",
      name: "Laticínios",
      subcategories: [
        { id: "2-1", name: "Leites" },
        { id: "2-2", name: "Iogurtes" },
        { id: "2-3", name: "Queijos" },
      ],
    },
    {
      id: "3",
      name: "Mercearia",
      subcategories: [
        { id: "3-1", name: "Arroz e Feijão" },
        { id: "3-2", name: "Massas" },
        { id: "3-3", name: "Óleos e Azeites" },
      ],
    },
  ]);

  // Estados para modais
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");

  // Adicionar Categoria Pai
  const handleAddCategory = () => {
    if (!newItemName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newItemName,
      subcategories: [],
    };

    setCategories([...categories, newCategory]);
    setNewItemName("");
    setIsCategoryModalOpen(false);
    toast({
      title: "Categoria criada",
      description: `${newCategory.name} foi adicionada.`,
    });
  };

  // Adicionar Subcategoria
  const handleAddSubcategory = () => {
    if (!newItemName.trim() || !selectedParentId) return;

    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedParentId) {
        return {
          ...cat,
          subcategories: [
            ...cat.subcategories,
            { id: Date.now().toString(), name: newItemName },
          ],
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setNewItemName("");
    setIsSubcategoryModalOpen(false);
    toast({
      title: "Subcategoria criada",
      description: `${newItemName} foi adicionada.`,
    });
  };

  // Função auxiliar para abrir modal de subcategoria
  const openSubcategoryModal = (parentId: string) => {
    setSelectedParentId(parentId);
    setNewItemName("");
    setIsSubcategoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Estrutura de Categorias</h3>
          <p className="text-sm text-muted-foreground">
            Organize seus produtos em níveis para facilitar a busca e
            relatórios.
          </p>
        </div>

        <Dialog
          open={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
        >
          <DialogTrigger asChild>
            <Button className="mobile-button">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria Principal</DialogTitle>
              <DialogDescription>
                Crie um grupo principal (ex: Bebidas, Limpeza).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Nome da Categoria</Label>
                <Input
                  id="cat-name"
                  placeholder="Ex: Padaria"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="mobile-optimized"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddCategory}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Subcategoria (Controlado via estado para saber o pai) */}
      <Dialog
        open={isSubcategoryModalOpen}
        onOpenChange={setIsSubcategoryModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Subcategoria</DialogTitle>
            <DialogDescription>
              Adicionando em:{" "}
              <span className="font-semibold text-primary">
                {categories.find((c) => c.id === selectedParentId)?.name}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sub-name">Nome da Subcategoria</Label>
              <Input
                id="sub-name"
                placeholder="Ex: Pães Doces"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="mobile-optimized"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubcategoryModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddSubcategory}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lista de Categorias (Accordion) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-muted-foreground" />
            Árvore de Classificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              Nenhuma categoria cadastrada.
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium text-base">
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="ml-2 font-normal">
                        {category.subcategories.length} subcategorias
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-4 bg-muted/20 rounded-b-md">
                    <div className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-2 bg-background rounded-md border shadow-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{sub.name}</span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {category.subcategories.length === 0 && (
                        <p className="text-sm text-muted-foreground italic py-2">
                          Nenhuma subcategoria.
                        </p>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 border-dashed border border-muted-foreground/30 text-muted-foreground hover:text-primary hover:bg-primary/5"
                        onClick={() => openSubcategoryModal(category.id)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Adicionar Subcategoria em {category.name}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
