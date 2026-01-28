"use client";

import { useWizardStore } from "../use-wizard-store";
import { cn } from "@/lib/utils";
import { Boxes, Ghost, CheckCircle2 } from "lucide-react";

export function StepStockControl() {
  const { flags, setStockControl } = useWizardStore();

  const handleSelect = (value: boolean) => {
    setStockControl(value);
  };

  const options = [
    {
      value: true,
      title: "Sim, controlar estoque",
      description:
        "Quero acompanhar entradas, saídas e saldo atual deste item.",
      icon: Boxes,
      color: "text-blue-600 border-blue-600/20 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: false,
      title: "Não controlar saldo (NGE)",
      description:
        "Item de passagem direta (Despesa). Não preciso saber quantos tenho.",
      icon: Ghost,
      color:
        "text-slate-600 border-slate-600/20 bg-slate-50 dark:bg-slate-800/50",
    },
  ];

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Deseja controlar o estoque?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Para itens de uso interno, o controle de saldo é opcional.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {options.map((option) => {
          const isSelected = flags.geraEstoque === option.value;
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
