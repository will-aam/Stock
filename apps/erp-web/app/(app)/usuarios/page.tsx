"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { UserList } from "@/components/usuarios/user-list";
import { UserFormSheet } from "@/components/usuarios/user-form-sheet";
import { Separator } from "@/components/ui/separator";
import { Usuario, usuarios as initialUsuarios } from "@/lib/mock/usuarios";
import { useToast } from "@/hooks/use-toast";

export default function UsuariosPage() {
  const { toast } = useToast();

  // Estado local para simular banco de dados
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);

  // Controle do Sheet (Formulário)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const handleCreate = () => {
    setEditingUser(null); // Modo Criação
    setIsSheetOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario); // Modo Edição
    setIsSheetOpen(true);
  };

  const handleSave = (data: Partial<Usuario>) => {
    if (editingUser) {
      // Atualizar Existente
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? ({ ...u, ...data } as Usuario) : u,
        ),
      );
      toast({
        title: "Usuário atualizado",
        description: "As permissões e dados foram salvos.",
      });
    } else {
      // Criar Novo (Mock ID)
      const newUser = {
        ...data,
        id: `usr-${Math.floor(Math.random() * 10000)}`,
        ativo: true,
      } as Usuario;

      setUsuarios((prev) => [...prev, newUser]);
      toast({
        title: "Usuário criado",
        description: "Novo colaborador adicionado à equipe.",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-8 p-4 flex-1">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Gestão de Usuários
          </h2>
          <p className="text-muted-foreground">
            Cadastre funcionários e gerencie o acesso aos módulos do sistema
            (Stock, Countifly, etc).
          </p>
        </div>

        <Separator />

        {/* CORREÇÃO AQUI: Passando a prop 'usuarios' que faltava */}
        <UserList
          usuarios={usuarios}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      </main>

      {/* Formulário Lateral */}
      <UserFormSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialData={editingUser}
        onSave={handleSave}
      />
    </div>
  );
}
