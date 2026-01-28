// components/produtos/wizard/use-wizard-store.ts
import { create } from "zustand";
import { ProductRole, WizardState, WizardStep } from "./types";

interface WizardActions {
  // Navegação
  setOpen: (open: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;

  // Ações de preenchimento (Setters inteligentes)
  setRole: (role: ProductRole) => void;
  setStockControl: (control: boolean) => void;
  setOrigin: (isCompra: boolean) => void;
  updateData: (data: Partial<WizardState["data"]>) => void;
}

const initialState: WizardState = {
  currentStep: 0,
  isOpen: false,
  flags: {
    geraEstoque: true,
    vendaHabilitada: true,
    producaoHabilitada: false,
    permiteComposicao: false,
    permiteEntradaNF: true,
    requerLocalEstoque: true,
  },
  data: {
    role: null,
    nome: "",
    unidade: "UN",
    categoriaId: "",
  },
};

// Mapeamento da ordem das etapas para facilitar navegação
export const STEP_ORDER: WizardStep[] = [
  "papel", // 0
  "controle_estoque", // 1 (Condicional)
  "origem", // 2
  "dados_basicos", // 3
  "detalhes_estoque", // 4 (Condicional)
  "composicao", // 5 (Condicional)
  "fiscal", // 6
];

export const useWizardStore = create<WizardState & WizardActions>(
  (set, get) => ({
    ...initialState,

    setOpen: (open) => set({ isOpen: open }),

    setRole: (role) => {
      // APLICA AS REGRAS DA ETAPA 1 (Papel do Produto)
      let flags = { ...get().flags };

      switch (role) {
        case "revenda":
          flags.geraEstoque = true;
          flags.vendaHabilitada = true;
          flags.producaoHabilitada = false;
          flags.permiteComposicao = false;
          break;
        case "uso_interno":
          flags.geraEstoque = false; // Default off, mas editável no passo 2
          flags.vendaHabilitada = false;
          flags.producaoHabilitada = false;
          break;
        case "insumo":
          flags.geraEstoque = true;
          flags.vendaHabilitada = false;
          flags.producaoHabilitada = true;
          break;
        case "produto_proprio":
          flags.geraEstoque = true;
          flags.vendaHabilitada = true;
          flags.permiteComposicao = true; // Abre aba de receita
          break;
        case "servico":
          flags.geraEstoque = false;
          flags.vendaHabilitada = true;
          break;
      }

      set((state) => ({
        flags,
        data: { ...state.data, role },
      }));
    },

    setStockControl: (control) => {
      // APLICA REGRAS DA ETAPA 2 (Controle de Estoque)
      set((state) => ({
        flags: {
          ...state.flags,
          geraEstoque: control,
          requerLocalEstoque: control,
        },
        data: { ...state.data, controlaEstoqueEscolhaUsuario: control },
      }));
    },

    setOrigin: (isCompra) => {
      // APLICA REGRAS DA ETAPA 3 (Origem)
      set((state) => ({
        flags: {
          ...state.flags,
          permiteEntradaNF: isCompra,
          permiteComposicao: !isCompra, // Se não compra, produz (simplificação inicial)
        },
        data: { ...state.data, origemCompra: isCompra },
      }));
    },

    updateData: (newData) =>
      set((state) => ({
        data: { ...state.data, ...newData },
      })),

    nextStep: () => {
      const { currentStep, flags, data } = get();
      let next = currentStep + 1;

      // LÓGICA DE PULAR ETAPAS (SKIP)

      // Se o passo atual for 0 (Papel) e for "Revenda" ou "Produto Próprio",
      // pula o passo 1 (Controle de Estoque) pois já assumimos estoque = true
      if (currentStep === 0) {
        if (data.role === "revenda" || data.role === "produto_proprio") {
          next = 2; // Pula para Origem
        }
      }

      // Se o passo for 3 (Dados Básicos) e não gera estoque,
      // pula o passo 4 (Detalhes Estoque)
      if (currentStep === 3 && !flags.geraEstoque) {
        next = 5;
      }

      // Se o passo for 4 (ou 3 pulando o 4) e não permite composição,
      // pula o passo 5 (Composição)
      const stepBeforeComposicao = !flags.geraEstoque ? 3 : 4;
      if (currentStep === stepBeforeComposicao && !flags.permiteComposicao) {
        next = 6; // Vai para Fiscal
      }

      set({ currentStep: next });
    },

    prevStep: () => {
      const { currentStep, data, flags } = get();
      let prev = currentStep - 1;

      // LÓGICA REVERSA DE PULAR (VOLTAR)

      // Se estamos em Origem (2) e o papel é Revenda, volta para Papel (0), pulando Controle (1)
      if (currentStep === 2) {
        if (data.role === "revenda" || data.role === "produto_proprio") {
          prev = 0;
        }
      }

      // Se estamos em Fiscal (6) e não tem composição...
      if (currentStep === 6 && !flags.permiteComposicao) {
        // Se não tem estoque, volta para Dados Básicos (3)
        if (!flags.geraEstoque) prev = 3;
        // Se tem estoque, volta para Detalhes Estoque (4)
        else prev = 4;
      }

      set({ currentStep: Math.max(0, prev) });
    },

    setStep: (step) => set({ currentStep: step }),

    reset: () => set({ ...initialState, isOpen: true }), // Mantém aberto ao resetar para novo cadastro
  }),
);
