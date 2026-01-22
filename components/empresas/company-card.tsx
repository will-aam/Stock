"use client";

import {
  Building2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Empresa } from "@/lib/mock-data";

interface CompanyCardProps {
  empresa: Empresa;
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: string) => void;
}

export function CompanyCard({ empresa, onEdit, onDelete }: CompanyCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-all duration-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {/* Avatar / Ícone da Empresa */}
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm leading-none">
                {empresa.nomeFantasia}
              </h3>
              {empresa.principal && (
                <Badge
                  variant="default"
                  className="text-[10px] h-4 px-1 bg-blue-600 hover:bg-blue-700"
                >
                  Matriz
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ID: #{String(empresa.displayId).padStart(3, "0")}
            </p>
          </div>
        </div>

        {/* Menu de Ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(empresa)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
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
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid gap-2">
          {/* Info Principal */}
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">CNPJ:</span>{" "}
            {empresa.cnpj}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {empresa.endereco.cidade} - {empresa.endereco.uf}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-2">
          {empresa.ativa ? (
            <Badge
              variant="outline"
              className="text-green-600 border-green-200 bg-green-50 text-[10px] gap-1"
            >
              <CheckCircle2 className="h-3 w-3" /> Ativa
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground text-[10px] gap-1"
            >
              <XCircle className="h-3 w-3" /> Inativa
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground capitalize">
            {empresa.regimeTributario.replace("_", " ")}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
