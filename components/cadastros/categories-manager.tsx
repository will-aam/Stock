"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FolderTree,
  CornerDownRight,
} from "lucide-react";
import {
  categorias as initialCategorias,
  Categoria,
} from "@/lib/mock/produtos/categorias";
import { useToast } from "@/hooks/use-toast";

export function CategoriesManager() {
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [searchTerm, setSearchTerm] = useState("");

  // Controle do Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(
    null,
  );

  // Form States
  const [tempName, setTempName] = useState("");
  const [tempParentId, setTempParentId] = useState<string>("root"); // "root" = Nenhuma pai

  // Filtro
  const filteredCategorias = categorias.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategory(categoria);
      setTempName(categoria.nome);
      setTempParentId(categoria.paiId || "root");
    } else {
      setEditingCategory(null);
      setTempName("");
      setTempParentId("root");
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!tempName.trim()) return;

    const paiId = tempParentId === "root" ? undefined : tempParentId;

    if (editingCategory) {
      // Editar
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, nome: tempName, paiId } : c,
        ),
      );
      toast({ description: "Categoria atualizada." });
    } else {
      // Criar
      const newCategory: Categoria = {
        id: `cat-${Date.now()}`,
        nome: tempName,
        paiId,
      };
      setCategorias((prev) => [...prev, newCategory]);
      toast({ description: "Categoria criada." });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    // Verificar se tem filhos antes de deletar (opcional, mas boa prática)
    const hasChildren = categorias.some((c) => c.paiId === id);
    if (hasChildren) {
      toast({
        title: "Não é possível excluir",
        description: "Esta categoria possui subcategorias vinculadas.",
        variant: "destructive",
      });
      return;
    }

    setCategorias((prev) => prev.filter((c) => c.id !== id));
    toast({ description: "Categoria removida." });
  };

  // Helper para mostrar o nome da categoria pai na tabela
  const getParentName = (paiId?: string) => {
    if (!paiId) return "-";
    return categorias.find((c) => c.id === paiId)?.nome || "Desconhecida";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorias..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Nova Categoria
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria Mãe (Pai)</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategorias.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategorias.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {cat.paiId ? (
                      <CornerDownRight className="h-4 w-4 text-muted-foreground ml-2" />
                    ) : (
                      <FolderTree className="h-4 w-4 text-primary" />
                    )}
                    {cat.nome}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getParentName(cat.paiId)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(cat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da Categoria</Label>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Ex: Bebidas, Limpeza..."
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria Pai (Opcional)</Label>
              <Select value={tempParentId} onValueChange={setTempParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">-- Nenhuma (Raiz) --</SelectItem>
                  {categorias
                    .filter((c) => c.id !== editingCategory?.id) // Evitar auto-referência
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
