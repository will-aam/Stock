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

  // Renderização das Etiquetas (Badges) de texto
  const renderModuleBadges = (perms: Usuario["permissoes"]) => {
    if (perms.admin) {
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant="destructive" className="hover:bg-red-600">
            ADMINISTRADOR
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
          className="bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200"
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
          className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
        >
          Ordi
        </Badge>,
      );
    }

    // CORREÇÃO: Countifly
    if (perms.countify) {
      badges.push(
        <Badge
          key="countifly"
          variant="outline"
          className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
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
          className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
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
          className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
        >
          Brutos
        </Badge>,
      );
    }

    // CORREÇÃO: Rikko
    if (perms.rico) {
      badges.push(
        <Badge
          key="rikko"
          variant="outline"
          className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200"
        >
          Rikko
        </Badge>,
      );
    }

    return <div className="flex flex-wrap gap-1.5">{badges}</div>;
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

                    {/* Acessos (Badges Coloridas) */}
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
