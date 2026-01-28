"use client";

import { useWizardStore } from "../use-wizard-store";
import { ProductRole } from "../types";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Archive,
  Hammer,
  Factory,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

interface RoleOption {
  id: ProductRole;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string; // Classe de cor para o ícone/borda
}

const options: RoleOption[] = [
  {
    id: "revenda",
    title: "Revenda",
    description: "Compro de fornecedores para vender aos meus clientes.",
    icon: ShoppingBag,
    color: "text-blue-600 border-blue-600/20 bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "uso_interno",
    title: "Uso e Consumo",
    description: "Materiais de escritório, limpeza ou equipamentos da empresa.",
    icon: Archive,
    color:
      "text-slate-600 border-slate-600/20 bg-slate-50 dark:bg-slate-800/50",
  },
  {
    id: "insumo",
    title: "Matéria-Prima / Insumo",
    description: "Uso na produção de outros produtos (não vendo diretamente).",
    icon: Hammer,
    color:
      "text-amber-600 border-amber-600/20 bg-amber-50 dark:bg-amber-900/20",
  },
  {
    id: "produto_proprio",
    title: "Fabricação Própria",
    description: "Produto final produzido aqui (possui ficha técnica).",
    icon: Factory,
    color:
      "text-purple-600 border-purple-600/20 bg-purple-50 dark:bg-purple-900/20",
  },
  {
    id: "servico",
    title: "Serviço",
    description: "Mão de obra, entrega ou consultoria (sem estoque físico).",
    icon: Briefcase,
    color:
      "text-emerald-600 border-emerald-600/20 bg-emerald-50 dark:bg-emerald-900/20",
  },
];

export function StepRole() {
  const { data, setRole, nextStep } = useWizardStore();

  const handleSelect = (role: ProductRole) => {
    setRole(role);
    // Opcional: Avançar automaticamente ao clicar (UX ágil),
    // mas pode confundir se o usuário quiser ler.
    // Vamos manter seleção manual por enquanto.
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Qual é o papel deste item?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Essa escolha define automaticamente as regras de estoque e tributação
          iniciais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = data.role === option.id;
          const Icon = option.icon;

          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={cn(
                "relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                isSelected
                  ? `border-primary bg-primary/5 shadow-sm`
                  : "border-muted bg-card hover:border-muted-foreground/30",
              )}
            >
              {/* Ícone */}
              <div className={cn("p-3 rounded-lg shrink-0", option.color)}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Texto */}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-foreground">
                  {option.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Check de Seleção */}
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary animate-in zoom-in spin-in-12 duration-300">
                  <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
