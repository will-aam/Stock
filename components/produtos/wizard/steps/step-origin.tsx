"use client";

import { useWizardStore } from "../use-wizard-store";
import { cn } from "@/lib/utils";
import { Truck, Factory, CheckCircle2 } from "lucide-react";

export function StepOrigin() {
  const { data, setOrigin } = useWizardStore();

  const handleSelect = (isCompra: boolean) => {
    setOrigin(isCompra);
  };

  const options = [
    {
      value: true,
      title: "Compro de Fornecedor",
      description:
        "O item chega pronto (Revenda ou Matéria-Prima) via Nota Fiscal de Entrada.",
      icon: Truck,
      color: "text-blue-600 border-blue-600/20 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: false,
      title: "Produzido Internamente",
      description:
        "O item é fabricado/manipulado aqui (Ex: Prato Feito, Bolo, Kit Montado).",
      icon: Factory,
      color:
        "text-purple-600 border-purple-600/20 bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Qual a origem deste item?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Isso define se habilitamos a entrada por XML ou a ficha técnica de
          produção.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {options.map((option) => {
          // data.origemCompra pode ser undefined inicialmente
          const isSelected = data.origemCompra === option.value;
          const Icon = option.icon;

          return (
            <div
              key={option.title}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
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
                <div className="text-primary animate-in zoom-in spin-in-12 duration-300">
                  <CheckCircle2 className="h-6 w-6 fill-primary text-primary-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
