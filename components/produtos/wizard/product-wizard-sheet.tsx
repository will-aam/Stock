// components/produtos/wizard/product-wizard-sheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, X, PackagePlus } from "lucide-react";
import { useWizardStore, STEP_ORDER } from "./use-wizard-store";
import { cn } from "@/lib/utils";

// --- IMPORTAÇÃO DAS ETAPAS ---
import { StepRole } from "./steps/step-role";
import { StepStockControl } from "./steps/step-stock-control";
import { StepOrigin } from "./steps/step-origin";
import { StepBasicData } from "./steps/step-basic-data";
import { StepStockDetails } from "./steps/step-stock-details";
import { StepComposition } from "./steps/step-composition";
import { StepFiscal } from "./steps/step-fiscal";

// Nova interface para aceitar a função de salvar
interface ProductWizardSheetProps {
  onSave?: (data: any) => void;
}

export function ProductWizardSheet({ onSave }: ProductWizardSheetProps) {
  const { isOpen, setOpen, currentStep, nextStep, prevStep, data } =
    useWizardStore();

  const stepTitles = [
    "Definição do Produto",
    "Controle de Estoque",
    "Origem do Item",
    "Dados Essenciais",
    "Gestão de Estoque",
    "Ficha Técnica",
    "Configuração Fiscal",
  ];

  const progress = ((currentStep + 1) / STEP_ORDER.length) * 100;

  const renderStepContent = () => {
    const stepName = STEP_ORDER[currentStep];

    switch (stepName) {
      case "papel":
        return <StepRole />;
      case "controle_estoque":
        return <StepStockControl />;
      case "origem":
        return <StepOrigin />;
      case "dados_basicos":
        return <StepBasicData />;
      case "detalhes_estoque":
        return <StepStockDetails />;
      case "composicao":
        return <StepComposition />;
      case "fiscal":
        return <StepFiscal />;
      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  const isNextDisabled = () => {
    const stepName = STEP_ORDER[currentStep];
    if (stepName === "papel" && !data.role) return true;
    if (stepName === "dados_basicos" && !data.nome) return true;
    return false;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        className="w-full sm:max-w-[650px] p-0 flex flex-col bg-background border-l shadow-2xl"
        side="right"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* --- HEADER --- */}
        <SheetHeader className="px-6 py-5 border-b shrink-0 space-y-4 bg-muted/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary/10 p-1.5 rounded-md">
                <PackagePlus className="h-5 w-5 text-primary" />
              </span>
              Novo Produto
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted/80"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>
                Passo {currentStep + 1} de {STEP_ORDER.length}
              </span>
              <span className="text-primary font-bold">
                {stepTitles[currentStep]}
              </span>
            </div>
            <div className="h-2 w-full bg-muted/50 overflow-hidden rounded-full">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* --- CORPO (SCROLLBAR VISÍVEL AGORA) --- */}
        {/* Removemos as classes que escondiam o scrollbar */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-950/10  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStepContent()}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <SheetFooter className="px-6 py-4 border-t bg-background shrink-0 flex-row gap-3 sm:justify-between sm:space-x-0">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 sm:flex-none w-full sm:w-[120px] gap-2 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>

          {currentStep === STEP_ORDER.length - 1 ? (
            <Button
              className="flex-1 sm:flex-none w-full sm:w-[180px] gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
              onClick={() => {
                if (onSave) onSave(data); // Chama a função real passada pelo pai
              }}
            >
              <Save className="h-4 w-4" /> Concluir Cadastro
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={isNextDisabled()}
              className={cn(
                "flex-1 sm:flex-none w-full sm:w-[140px] gap-2 shadow-sm transition-all",
                isNextDisabled() ? "opacity-50" : "hover:translate-x-1",
              )}
            >
              Próximo <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
