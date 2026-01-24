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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  IdCard,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Usuario } from "@/lib/mock/usuarios";
import { getEmpresaById } from "@/lib/mock/empresas";
import { getSetorById } from "@/lib/mock/setores";
import { useToast } from "@/hooks/use-toast";

interface UserListProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onCreate: () => void;
}

export function UserList({ usuarios, onEdit, onCreate }: UserListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = usuarios.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cargo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDownloadFicha = (nome: string) => {
    toast({ description: `Baixando ficha completa de ${nome}...` });
  };

  const handleGerarCracha = (nome: string) => {
    toast({ description: `Gerando PDF para crachá de ${nome}...` });
  };

  // Renderização das Etiquetas (Badges) de texto - VERSÃO MELHORADA
  const renderModuleBadges = (perms: Usuario["permissoes"]) => {
    if (perms.admin) {
      return (
        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className="border-red-300 text-red-600 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 px-2 py-0.5 text-xs font-medium"
          >
            ADMIN
          </Badge>
        </div>
      );
    }

    const badges = [];

    if (perms.stock) {
      badges.push(
        <Badge
          key="stock"
          variant="outline"
          className="border-gray-300 text-gray-600 bg-gray-50/50 dark:bg-gray-950/20 dark:border-gray-700 dark:text-gray-400 px-2 py-0.5 text-xs font-medium"
        >
          Stock
        </Badge>,
      );
    }

    if (perms.ordi) {
      badges.push(
        <Badge
          key="ordi"
          variant="outline"
          className="border-blue-300 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-700 dark:text-blue-400 px-2 py-0.5 text-xs font-medium"
        >
          Ordi
        </Badge>,
      );
    }

    if (perms.countifly) {
      badges.push(
        <Badge
          key="countifly"
          variant="outline"
          className="border-orange-300 text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-700 dark:text-orange-400 px-2 py-0.5 text-xs font-medium"
        >
          Countifly
        </Badge>,
      );
    }

    if (perms.val) {
      badges.push(
        <Badge
          key="val"
          variant="outline"
          className="border-emerald-300 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium"
        >
          Val
        </Badge>,
      );
    }

    if (perms.brutos) {
      badges.push(
        <Badge
          key="brutos"
          variant="outline"
          className="border-purple-300 text-purple-600 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-700 dark:text-purple-400 px-2 py-0.5 text-xs font-medium"
        >
          Brutos
        </Badge>,
      );
    }

    if (perms.rico) {
      badges.push(
        <Badge
          key="rico"
          variant="outline"
          className="border-indigo-300 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-700 dark:text-indigo-400 px-2 py-0.5 text-xs font-medium"
        >
          Rikko
        </Badge>,
      );
    }

    return <div className="flex flex-wrap gap-1">{badges}</div>;
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ferramentas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuário..."
            className="pl-9 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onCreate} size="sm" className="h-9">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="min-w-[150px]">Colaborador</TableHead>
              <TableHead className="hidden md:table-cell min-w-[140px]">
                Empresa
              </TableHead>
              <TableHead className="hidden md:table-cell w-[120px]">
                Setor
              </TableHead>
              <TableHead className="min-w-[200px]">Acessos Liberados</TableHead>
              <TableHead className="text-right w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const empresa = getEmpresaById(user.empresaId);
                const setor = getSetorById(user.setorId);

                return (
                  <TableRow key={user.id} className="group">
                    {/* Avatar */}
                    <TableCell className="py-2 pr-0">
                      <Avatar className="h-8 w-8 rounded-md border bg-muted">
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback className="text-xs font-medium text-muted-foreground rounded-md">
                          {user.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    {/* Nome e Cargo */}
                    <TableCell className="py-2">
                      <div className="flex flex-col">
                        <span
                          className="font-medium text-sm truncate max-w-[180px]"
                          title={user.nome}
                        >
                          {user.nome}
                        </span>
                        <span
                          className="text-[11px] text-muted-foreground truncate max-w-[180px]"
                          title={user.cargo}
                        >
                          {user.cargo}
                        </span>
                      </div>
                    </TableCell>

                    {/* Empresa */}
                    <TableCell className="hidden md:table-cell py-2">
                      <span
                        className="text-xs truncate block max-w-[150px]"
                        title={empresa?.nomeFantasia}
                      >
                        {empresa?.nomeFantasia || "-"}
                      </span>
                    </TableCell>

                    {/* Setor */}
                    <TableCell className="hidden md:table-cell py-2">
                      <span className="text-xs truncate block max-w-[120px] bg-muted/50 px-2 py-0.5 rounded w-fit">
                        {setor?.nome || "-"}
                      </span>
                    </TableCell>

                    {/* Acessos (Badges Coloridas) - VERSÃO MELHORADA */}
                    <TableCell className="py-2">
                      {renderModuleBadges(user.permissoes)}
                    </TableCell>

                    {/* Ações */}
                    <TableCell className="text-right py-2 pl-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>
                            Ações do Usuário
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Pencil className="w-4 h-4 mr-2" /> Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadFicha(user.nome)}
                          >
                            <Download className="w-4 h-4 mr-2" /> Baixar Ficha
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGerarCracha(user.nome)}
                          >
                            <IdCard className="w-4 h-4 mr-2" /> Gerar Crachá
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
