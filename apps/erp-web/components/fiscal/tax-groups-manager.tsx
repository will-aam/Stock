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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Layers,
  FileText,
  Percent,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Importando tipos e mocks
import {
  gruposTributarios as initialGrupos,
  GrupoTributario,
} from "@/lib/mock/produtos/grupos-tributarios";
import { cstPisCofins, cstIpi } from "@/lib/mock/produtos/tabelas-fiscais";

// Estado vazio para novo grupo
const emptyGroup: GrupoTributario = {
  id: "",
  codigoInterno: "",
  descricao: "",
  enquadramento: "todos",
  ativo: true,
  regras: {
    origem: 0,
    cstIpi: "99",
    cstPis: "01",
    cstCofins: "01",
    aliquotaIcms: 0,
    aliquotaPis: 0,
    aliquotaCofins: 0,
    cfopDentroEstado: "5102",
    cfopForaEstado: "6102",
  },
};

export function TaxGroupsManager() {
  const { toast } = useToast();
  const [grupos, setGrupos] = useState<GrupoTributario[]>(initialGrupos);
  const [searchTerm, setSearchTerm] = useState("");

  // Controle do Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GrupoTributario>(emptyGroup);
  const [isEditing, setIsEditing] = useState(false);

  const filteredGrupos = grupos.filter(
    (g) =>
      g.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.codigoInterno.includes(searchTerm),
  );

  const handleOpenSheet = (grupo?: GrupoTributario) => {
    if (grupo) {
      setEditingGroup(JSON.parse(JSON.stringify(grupo))); // Deep copy
      setIsEditing(true);
    } else {
      setEditingGroup({ ...emptyGroup, id: `gt-${Date.now()}` });
      setIsEditing(false);
    }
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (!editingGroup.descricao || !editingGroup.codigoInterno) {
      toast({
        title: "Erro",
        description: "Preencha a descrição e o código.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing) {
      setGrupos((prev) =>
        prev.map((g) => (g.id === editingGroup.id ? editingGroup : g)),
      );
      toast({ description: "Grupo tributário atualizado." });
    } else {
      setGrupos((prev) => [...prev, editingGroup]);
      toast({ description: "Grupo tributário criado." });
    }
    setIsSheetOpen(false);
  };

  const updateRegra = (field: keyof typeof emptyGroup.regras, value: any) => {
    setEditingGroup((prev) => ({
      ...prev,
      regras: { ...prev.regras, [field]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Grupo Tributário
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Cód.</TableHead>
              <TableHead>Descrição do Grupo</TableHead>
              <TableHead>Regime</TableHead>
              <TableHead>Alíq. Padrão</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrupos.map((grupo) => (
              <TableRow key={grupo.id}>
                <TableCell className="font-mono text-xs">
                  {grupo.codigoInterno}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{grupo.descricao}</span>
                    <span className="text-xs text-muted-foreground">
                      CFOP: {grupo.regras.cfopDentroEstado} /{" "}
                      {grupo.regras.cfopForaEstado}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {grupo.enquadramento.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold w-10">ICMS:</span>{" "}
                      {grupo.regras.aliquotaIcms}%
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="font-semibold w-10">PIS:</span>{" "}
                      {grupo.regras.aliquotaPis}%
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenSheet(grupo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* SHEET DE EDIÇÃO */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="w-full sm:max-w-[600px] p-0 flex flex-col"
          side="right"
        >
          <SheetHeader className="p-6 border-b shrink-0">
            <SheetTitle>
              {isEditing ? "Editar Grupo Tributário" : "Novo Grupo Tributário"}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* DADOS BÁSICOS */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 space-y-2">
                    <Label>Código *</Label>
                    <Input
                      value={editingGroup.codigoInterno}
                      onChange={(e) =>
                        setEditingGroup({
                          ...editingGroup,
                          codigoInterno: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Descrição do Grupo *</Label>
                    <Input
                      value={editingGroup.descricao}
                      onChange={(e) =>
                        setEditingGroup({
                          ...editingGroup,
                          descricao: e.target.value,
                        })
                      }
                      placeholder="Ex: Revenda Tributada 18%"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Enquadramento Permitido</Label>
                  <Select
                    value={editingGroup.enquadramento}
                    onValueChange={(v: any) =>
                      setEditingGroup({ ...editingGroup, enquadramento: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Regimes</SelectItem>
                      <SelectItem value="simples_nacional">
                        Simples Nacional
                      </SelectItem>
                      <SelectItem value="lucro_real">Lucro Real</SelectItem>
                      <SelectItem value="lucro_presumido">
                        Lucro Presumido
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="icms" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="icms">ICMS & CFOP</TabsTrigger>
                  <TabsTrigger value="pis_cofins">PIS / COFINS</TabsTrigger>
                  <TabsTrigger value="ipi">IPI</TabsTrigger>
                </TabsList>

                {/* ABA ICMS */}
                <TabsContent value="icms" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alíquota ICMS (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-9"
                          value={editingGroup.regras.aliquotaIcms}
                          onChange={(e) =>
                            updateRegra("aliquotaIcms", Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Origem Padrão</Label>
                      <Select
                        value={String(editingGroup.regras.origem)}
                        onValueChange={(v) => updateRegra("origem", Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Nacional</SelectItem>
                          <SelectItem value="1">
                            1 - Estrangeira (Imp. Direta)
                          </SelectItem>
                          <SelectItem value="2">
                            2 - Estrangeira (Adq. Interna)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                    <div className="space-y-2">
                      <Label>CFOP (Dentro do Estado)</Label>
                      <Input
                        value={editingGroup.regras.cfopDentroEstado}
                        onChange={(e) =>
                          updateRegra("cfopDentroEstado", e.target.value)
                        }
                        placeholder="Ex: 5102"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CFOP (Fora do Estado)</Label>
                      <Input
                        value={editingGroup.regras.cfopForaEstado}
                        onChange={(e) =>
                          updateRegra("cfopForaEstado", e.target.value)
                        }
                        placeholder="Ex: 6102"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ABA PIS/COFINS */}
                <TabsContent value="pis_cofins" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>CST PIS (Saída)</Label>
                    <Select
                      value={editingGroup.regras.cstPis}
                      onValueChange={(v) => updateRegra("cstPis", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cstPisCofins
                          .filter((c) => c.tipo === "saida")
                          .map((c) => (
                            <SelectItem key={c.codigo} value={c.codigo}>
                              {c.codigo} - {c.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>CST COFINS (Saída)</Label>
                    <Select
                      value={editingGroup.regras.cstCofins}
                      onValueChange={(v) => updateRegra("cstCofins", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cstPisCofins
                          .filter((c) => c.tipo === "saida")
                          .map((c) => (
                            <SelectItem key={c.codigo} value={c.codigo}>
                              {c.codigo} - {c.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alíquota PIS (%)</Label>
                      <Input
                        type="number"
                        value={editingGroup.regras.aliquotaPis}
                        onChange={(e) =>
                          updateRegra("aliquotaPis", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alíquota COFINS (%)</Label>
                      <Input
                        type="number"
                        value={editingGroup.regras.aliquotaCofins}
                        onChange={(e) =>
                          updateRegra("aliquotaCofins", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ABA IPI */}
                <TabsContent value="ipi" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>CST IPI (Saída)</Label>
                    <Select
                      value={editingGroup.regras.cstIpi}
                      onValueChange={(v) => updateRegra("cstIpi", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cstIpi
                          .filter((c) => c.tipo === "saida")
                          .map((c) => (
                            <SelectItem key={c.codigo} value={c.codigo}>
                              {c.codigo} - {c.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          <SheetFooter className="p-6 border-t mt-auto">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Regras</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
