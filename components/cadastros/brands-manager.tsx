"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Tag } from "lucide-react";
import { marcas as initialMarcas, Marca } from "@/lib/mock/produtos/marcas";
import { useToast } from "@/hooks/use-toast";

export function BrandsManager() {
  const { toast } = useToast();
  const [marcas, setMarcas] = useState<Marca[]>(initialMarcas);
  const [searchTerm, setSearchTerm] = useState("");

  // Controle do Modal de Edição/Criação
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
  const [tempName, setTempName] = useState("");

  // Filtro
  const filteredMarcas = marcas.filter((m) =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (marca?: Marca) => {
    if (marca) {
      setEditingMarca(marca);
      setTempName(marca.nome);
    } else {
      setEditingMarca(null);
      setTempName("");
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!tempName.trim()) return;

    if (editingMarca) {
      // Editar
      setMarcas((prev) =>
        prev.map((m) =>
          m.id === editingMarca.id ? { ...m, nome: tempName } : m,
        ),
      );
      toast({ description: "Marca atualizada com sucesso." });
    } else {
      // Criar
      const newMarca: Marca = {
        id: `m-${Date.now()}`,
        nome: tempName,
      };
      setMarcas((prev) => [...prev, newMarca]);
      toast({ description: "Marca criada com sucesso." });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMarcas((prev) => prev.filter((m) => m.id !== id));
    toast({ description: "Marca removida." });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar marcas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Nova Marca
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Marca</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarcas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma marca encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredMarcas.map((marca) => (
                <TableRow key={marca.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {marca.nome}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(marca)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(marca.id)}
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
              {editingMarca ? "Editar Marca" : "Nova Marca"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da Marca</Label>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Ex: Nestlé, Dell..."
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
