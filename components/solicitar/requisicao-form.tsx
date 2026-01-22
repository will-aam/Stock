"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Trash2, Send, Building2, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFuncionarioStore } from "@/lib/funcionario-store";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import {
  getSetorById,
  getEmpresaById,
  type ItemRequisicao,
} from "@/lib/mock-data";

interface RequisicaoFormProps {
  onSuccess: (dados: {
    funcionarioNome: string;
    setorNome: string;
    empresaNome: string;
    itens: ItemRequisicao[];
    dataHora: string;
    protocolo: string;
  }) => void;
}

interface ItemForm {
  id: string;
  nome: string;
  quantidade: string;
}

export function RequisicaoForm({ onSuccess }: RequisicaoFormProps) {
  const { funcionarioLogado } = useFuncionarioStore();
  const { addRequisicao } = useRequisicoesStore();
  const [itens, setItens] = useState<ItemForm[]>([
    { id: "1", nome: "", quantidade: "1" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!funcionarioLogado) return null;

  const setor = getSetorById(funcionarioLogado.setorId);
  const empresa = getEmpresaById(funcionarioLogado.empresaId);

  const addItem = () => {
    setItens([
      ...itens,
      { id: Date.now().toString(), nome: "", quantidade: "1" },
    ]);
  };

  const removeItem = (id: string) => {
    if (itens.length > 1) {
      setItens(itens.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ItemForm, value: string) => {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const isValid = itens.every(
    (item) => item.nome.trim() && Number.parseInt(item.quantidade) > 0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = new Date();
    const protocolo = `REQ-${now.getFullYear()}${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 10000,
    )
      .toString()
      .padStart(4, "0")}`;

    const itensRequisicao: ItemRequisicao[] = itens.map((item) => ({
      nome: item.nome,
      quantidade: Number.parseInt(item.quantidade),
    }));

    addRequisicao({
      id: protocolo.toLowerCase().replace("req-", "req-"),
      funcionarioId: funcionarioLogado.id,
      setorId: funcionarioLogado.setorId,
      empresaId: funcionarioLogado.empresaId,
      status: "nova",
      itens: itensRequisicao,
      dataCriacao: now.toISOString(),
      dataAtualizacao: now.toISOString(),
    });

    setIsSubmitting(false);
    onSuccess({
      funcionarioNome: funcionarioLogado.nome,
      setorNome: setor?.nome || "",
      empresaNome: empresa?.nome || "",
      itens: itensRequisicao,
      dataHora: now.toLocaleString("pt-BR"),
      protocolo,
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header com informações do funcionário */}
      <div className="bg-muted/50 border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold text-card-foreground mb-4">
          Nova Requisição de Materiais
        </h1>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Funcionário</p>
              <p className="font-medium text-card-foreground">
                {funcionarioLogado.nome}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Setor</p>
              <p className="font-medium text-card-foreground">{setor?.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Empresa</p>
              <p className="font-medium text-card-foreground">
                {empresa?.nome}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base">Itens da Requisição</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Item
            </Button>
          </div>

          <div className="space-y-3">
            {itens.map((item, index) => (
              <div
                key={item.id}
                className="bg-muted/30 border border-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Item {index + 1}
                  </span>
                  {itens.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive-foreground hover:text-destructive-foreground hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid sm:grid-cols-[1fr_100px] gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}`} className="text-xs">
                      Nome do Item *
                    </Label>
                    <Input
                      id={`item-${item.id}`}
                      placeholder="Ex: Canetas azuis"
                      value={item.nome}
                      onChange={(e) =>
                        updateItem(item.id, "nome", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`qtd-${item.id}`} className="text-xs">
                      Qtd *
                    </Label>
                    <Input
                      id={`qtd-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) =>
                        updateItem(item.id, "quantidade", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Enviando..." : "Enviar Requisição"}
          </Button>
        </div>
      </form>
    </div>
  );
}
