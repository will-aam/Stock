"use client";

import {
  Building2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Empresa } from "@/lib/mock/empresas";

interface CompanyCardProps {
  empresa: Empresa;
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: string) => void;
}

export function CompanyCard({ empresa, onEdit, onDelete }: CompanyCardProps) {
  return (
    <Card className="group relative flex flex-col justify-between p-4 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md h-full">
      {/* Cabeçalho Compacto */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex gap-3 items-center min-w-0 flex-1">
          {/* Ícone */}
          <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* NOME DA EMPRESA COM TRUNCATE (Reticências) */}
              <h3
                className="font-semibold text-sm leading-none truncate max-w-full"
                title={empresa.nomeFantasia} // Tooltip nativo ao passar o mouse
              >
                {empresa.nomeFantasia}
              </h3>

              {empresa.principal && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 px-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 shrink-0"
                >
                  Principal
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 font-mono">
              ID: {String(empresa.displayId).padStart(3, "0")}
            </p>
          </div>
        </div>

        {/* Menu de Ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
            >
              <span className="sr-only">Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Gerenciar</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(empresa)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar dados
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(empresa.id)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info Secundária */}
      <div className="space-y-2 mt-auto">
        <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          {/* CNPJ com Label */}
          <span className="truncate">
            <span className="font-medium text-foreground mr-1">CNPJ:</span>
            {empresa.cnpj}
          </span>

          {/* Status */}
          <div
            className={`flex items-center gap-1 text-[10px] uppercase font-medium ${empresa.ativa ? "text-green-600" : "text-muted-foreground"}`}
          >
            {empresa.ativa ? (
              <>
                Ativa{" "}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
              </>
            ) : (
              <>
                Inativa <XCircle className="h-3 w-3" />
              </>
            )}
          </div>
        </div>

        {/* Localização */}
        <div className="pt-2 border-t flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1 shrink-0" />
          <span
            className="truncate"
            title={`${empresa.endereco.cidade} - ${empresa.endereco.uf}`}
          >
            {empresa.endereco.cidade} - {empresa.endereco.uf}
          </span>
        </div>
      </div>
    </Card>
  );
}
