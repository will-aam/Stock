"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Scale } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Corrigido path do toast se necessário
import {
  unidades as initialUnidades,
  Unidade,
} from "@/lib/mock/produtos/unidades";

export function UnitsManager() {
  const { toast } = useToast();
  const [unidades, setUnidades] = useState<Unidade[]>(initialUnidades);
  const [searchTerm, setSearchTerm] = useState("");

  // Controle do Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unidade | null>(null);

  // Form State
  const [formData, setFormData] = useState<Unidade>({
    sigla: "",
    descricao: "",
    casasDecimais: 0,
  });

  const filteredUnidades = unidades.filter(
    (u) =>
      u.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.sigla.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (unidade?: Unidade) => {
    if (unidade) {
      setEditingUnit(unidade);
      setFormData(unidade);
    } else {
      setEditingUnit(null);
      setFormData({ sigla: "", descricao: "", casasDecimais: 0 });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.sigla || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (editingUnit) {
      // Editar
      setUnidades((prev) =>
        prev.map((u) => (u.sigla === editingUnit.sigla ? formData : u)),
      );
      toast({ description: "Unidade atualizada." });
    } else {
      // Criar
      if (unidades.some((u) => u.sigla === formData.sigla)) {
        toast({
          title: "Erro",
          description: "Sigla já existe.",
          variant: "destructive",
        });
        return;
      }
      setUnidades((prev) => [...prev, formData]);
      toast({ description: "Unidade criada." });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (sigla: string) => {
    setUnidades((prev) => prev.filter((u) => u.sigla !== sigla));
    toast({ description: "Unidade removida." });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar unidades..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Nova Unidade
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sigla</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Precisão</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnidades.map((unidade) => (
              <TableRow key={unidade.sigla}>
                <TableCell className="font-bold flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  {unidade.sigla}
                </TableCell>
                <TableCell>{unidade.descricao}</TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {unidade.casasDecimais} casas decimais
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(unidade)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(unidade.sigla)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUnit ? "Editar Unidade" : "Nova Unidade"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 space-y-2">
                <Label>Sigla</Label>
                <Input
                  value={formData.sigla}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sigla: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="KG"
                  maxLength={3}
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Quilograma"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Precisão (Casas Decimais)</Label>
              <Select
                value={String(formData.casasDecimais)}
                onValueChange={(v) =>
                  setFormData({ ...formData, casasDecimais: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    0 (Inteiro) - Ex: Unidade, Caixa
                  </SelectItem>
                  <SelectItem value="1">1 (0.0)</SelectItem>
                  <SelectItem value="2">2 (0.00) - Ex: Metro</SelectItem>
                  <SelectItem value="3">3 (0.000) - Ex: Kg, Litro</SelectItem>
                  <SelectItem value="4">4 (0.0000)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Define quantas casas decimais serão aceitas ao movimentar o
                estoque.
              </p>
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
