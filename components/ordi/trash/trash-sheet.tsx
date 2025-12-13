"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, RefreshCcw, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipo para os itens da lixeira (Simulação)
interface TrashItem {
  id: string;
  item: string;
  quantity: number;
  requester: string;
  deletedAt: string; // Data ISO
  origin: "negada" | "concluida" | "cancelada";
}

interface TrashSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrashSheet({ open, onOpenChange }: TrashSheetProps) {
  const { toast } = useToast();

  // Dados Mockados (Lixo Inicial)
  const [trashItems, setTrashItems] = useState<TrashItem[]>([
    {
      id: "del-1",
      item: "Cadeira Gamer (Pedido Duplicado)",
      quantity: 1,
      requester: "João Silva",
      deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 dias atrás
      origin: "negada",
    },
    {
      id: "del-2",
      item: "500 Canetas Vermelhas",
      quantity: 500,
      requester: "Maria Souza",
      deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 28 dias atrás (quase expirando)
      origin: "negada",
    },
    {
      id: "del-3",
      item: "Mouse Pad",
      quantity: 2,
      requester: "Pedro Santos",
      deletedAt: new Date().toISOString(), // Hoje
      origin: "concluida", // Exemplo de item concluído que foi movido para lixeira manualmente
    },
  ]);

  // Função para calcular dias restantes (Regra dos 30 dias)
  const getDaysRemaining = (deletedAt: string) => {
    const deleteDate = new Date(deletedAt);
    const expirationDate = new Date(
      deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleRestore = (id: string) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item restaurado",
      description: "O pedido voltou para a coluna de origem no Kanban.",
    });
  };

  const handleDeletePermanent = (id: string) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Excluído permanentemente",
      description: "O item foi removido do sistema.",
      variant: "destructive",
    });
  };

  const handleEmptyTrash = () => {
    setTrashItems([]);
    toast({
      title: "Lixeira esvaziada",
      description: "Todos os itens foram removidos permanentemente.",
      variant: "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md flex flex-col h-full"
        side="right"
      >
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Lixeira
          </SheetTitle>
          <SheetDescription>
            Itens aqui são excluídos permanentemente após 30 dias.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground font-medium">
            {trashItems.length} itens na lixeira
          </span>
          {trashItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              onClick={handleEmptyTrash}
            >
              Esvaziar Lixeira
            </Button>
          )}
        </div>

        <Separator />

        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
          {trashItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground space-y-2 opacity-50">
              <Trash2 className="h-10 w-10" />
              <p>A lixeira está vazia.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trashItems.map((item) => {
                const daysLeft = getDaysRemaining(item.deletedAt);
                const isCritical = daysLeft <= 5;

                return (
                  <div
                    key={item.id}
                    className="group relative bg-muted/40 border rounded-lg p-3 transition-all hover:bg-muted/60 hover:shadow-sm"
                  >
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <span className="font-medium text-sm line-clamp-1">
                          {item.item}
                        </span>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Qtd: {item.quantity}</span>
                          <span>•</span>
                          <span>{item.requester}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          item.origin === "negada" ? "destructive" : "secondary"
                        }
                        className="text-[10px] h-5"
                      >
                        {item.origin === "negada" ? "Negado" : "Arquivado"}
                      </Badge>
                    </div>

                    {/* Footer do Card - Aviso de Exclusão */}
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle
                        className={`h-3 w-3 ${
                          isCritical ? "text-red-500" : "text-yellow-500"
                        }`}
                      />
                      <span
                        className={`text-[10px] ${
                          isCritical
                            ? "text-red-500 font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        Exclusão automática em {daysLeft} dias
                      </span>
                    </div>

                    {/* Ações (Aparecem ao passar o mouse ou fixas em mobile) */}
                    <div className="flex gap-2 mt-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-7 text-xs gap-1 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                        onClick={() => handleRestore(item.id)}
                      >
                        <RefreshCcw className="h-3 w-3" />
                        Restaurar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-7 text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeletePermanent(item.id)}
                      >
                        <X className="h-3 w-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
