"use client";

import { useState } from "react";
import { Plus, Search, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyCard } from "@/components/empresas/company-card";
import { CompanyFormSheet } from "@/components/empresas/company-form-sheet";
import { empresas as initialEmpresas, Empresa } from "@/lib/mock/empresas";
import { useToast } from "@/hooks/use-toast";

export default function EmpresasPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>(initialEmpresas);

  // Estados do Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);

  // Filtragem
  const filteredEmpresas = empresas.filter(
    (emp) =>
      emp.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cnpj.includes(searchTerm) ||
      emp.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleNewCompany = () => {
    setEditingCompany(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingCompany(empresa);
    setIsSheetOpen(true);
  };

  const handleSave = (data: Partial<Empresa>) => {
    if (editingCompany) {
      // Editar
      setEmpresas((prev) =>
        prev.map((emp) =>
          emp.id === editingCompany.id ? ({ ...emp, ...data } as Empresa) : emp,
        ),
      );
      toast({
        title: "Empresa atualizada",
        description: "Dados salvos com sucesso.",
      });
    } else {
      // Criar
      const newId = `emp-${Math.floor(Math.random() * 10000)}`;
      const newDisplayId = empresas.length + 1;
      const newCompany = {
        ...data,
        id: newId,
        displayId: newDisplayId,
      } as Empresa;
      setEmpresas((prev) => [...prev, newCompany]);
      toast({
        title: "Empresa criada",
        description: "Nova unidade cadastrada.",
      });
    }
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Empresa removida",
      description: "A empresa foi removida com sucesso (simulação).",
    });
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie suas unidades, filiais e configurações fiscais.
          </p>
        </div>
        <Button onClick={handleNewCompany}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Filtros */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, razão social ou CNPJ..."
          className="pl-9 max-w-md bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filteredEmpresas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground">
          <Building className="h-10 w-10 mb-2 opacity-20" />
          <p>Nenhuma empresa encontrada.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEmpresas.map((empresa) => (
            <CompanyCard
              key={empresa.id}
              empresa={empresa}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Sheet de Formulário */}
      <CompanyFormSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialData={editingCompany}
        onSave={handleSave}
      />
    </div>
  );
}
