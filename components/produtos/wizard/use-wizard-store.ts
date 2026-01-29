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
    // Defaults seguros
    apareceNoCupom: false,
    controlaLote: false,
    controlaValidade: false,
    estoqueMinimo: 0,
  },
};

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
      // --- LÓGICA DE AUTOCORREÇÃO (ETAPA 1) ---
      const currentState = get();
      let newFlags = { ...currentState.flags };
      let newData = { ...currentState.data, role };

      switch (role) {
        case "revenda":
          // Regra: Se Revenda -> Vende, Estoque, Cupom
          newFlags.geraEstoque = true;
          newFlags.vendaHabilitada = true;
          newFlags.producaoHabilitada = false;
          newFlags.permiteComposicao = false;

          newData.apareceNoCupom = true; // Auto-check
          newData.origemCompra = true; // Default: compra pra revender
          break;

        case "uso_interno":
          // Regra: Se Uso Interno -> Não Vende, Estoque Opcional (Default Off)
          newFlags.geraEstoque = false;
          newFlags.vendaHabilitada = false;
          newFlags.producaoHabilitada = false;

          newData.apareceNoCupom = false;
          newData.origemCompra = true; // Compra material de escritório
          break;

        case "insumo":
          // Regra: Insumo -> Estoque Sim, Venda Não (geralmente)
          newFlags.geraEstoque = true;
          newFlags.vendaHabilitada = false;
          newFlags.producaoHabilitada = true;

          newData.apareceNoCupom = false;
          newData.origemCompra = true; // Compra matéria-prima
          break;

        case "produto_proprio":
          // Regra: Produto Próprio -> Vende, Estoque, Composição
          newFlags.geraEstoque = true;
          newFlags.vendaHabilitada = true;
          newFlags.producaoHabilitada = true;
          newFlags.permiteComposicao = true;

          newData.apareceNoCupom = true;
          newData.origemCompra = false; // Produzido internamente
          newFlags.permiteEntradaNF = false; // Bloqueia entrada XML direta (teoricamente)
          break;
      }

      set({ flags: newFlags, data: newData });
    },

    setStockControl: (control) => {
      // --- LÓGICA DE AUTOCORREÇÃO (ETAPA 2) ---
      const currentState = get();
      let newData = {
        ...currentState.data,
        controlaEstoqueEscolhaUsuario: control,
      };

      // Se desligou o estoque, limpa as configurações avançadas
      if (!control) {
        newData.controlaLote = false;
        newData.controlaValidade = false;
        newData.estoqueMinimo = 0;
        newData.localizacao = "";
      }

      set({
        flags: {
          ...currentState.flags,
          geraEstoque: control,
          requerLocalEstoque: control,
        },
        data: newData,
      });
    },

    setOrigin: (isCompra) => {
      // --- LÓGICA DE AUTOCORREÇÃO (ETAPA 3) ---
      const currentState = get();
      let newFlags = { ...currentState.flags };

      if (!isCompra) {
        // Se produzido internamente -> Força composição
        newFlags.permiteComposicao = true;
        newFlags.permiteEntradaNF = false;
      } else {
        // Se comprado -> Habilita NF, desabilita composição (exceto se for produto proprio misto, mas vamos simplificar)
        newFlags.permiteEntradaNF = true;
        // Só desliga composição se não for produto próprio (pois produto próprio sempre tem receita)
        if (currentState.data.role !== "produto_proprio") {
          newFlags.permiteComposicao = false;
        }
      }

      set({
        flags: newFlags,
        data: { ...currentState.data, origemCompra: isCompra },
      });
    },

    updateData: (newData) =>
      set((state) => ({
        data: { ...state.data, ...newData },
      })),

    nextStep: () => {
      const { currentStep, flags, data } = get();
      let next = currentStep + 1;

      // --- LÓGICA DE PULAR ETAPAS (SKIP) ---

      // 1. Se papel = Revenda ou Produto Próprio -> PULA "Controle de Estoque" (Já é true fixo)
      if (currentStep === 0) {
        if (data.role === "revenda" || data.role === "produto_proprio") {
          next = 2; // Vai para Origem
        }
      }

      // 2. Se papel = Revenda ou Insumo -> PULA "Origem" se já definimos o default corretamente no setRole
      // (Opcional: se quiser confirmar com o usuário, mantenha. Se quiser agilizar, pule).
      // Vamos manter a pergunta de Origem apenas se for "Uso Interno" ou se quiser confirmar.
      // Mas conforme sua regra "Revenda -> produzidoInternamente = false", podemos pular se for revenda.
      if (currentStep === 0 && data.role === "revenda") {
        next = 3; // Pula Controle e Origem, vai direto para Dados Básicos
      }

      // 3. Se não gera estoque -> PULA "Detalhes de Estoque"
      if (currentStep === 3 && !flags.geraEstoque) {
        next = 5; // Tenta ir para Composição
      }

      // 4. Se não tem composição -> PULA "Ficha Técnica"
      // Nota: precisamos verificar onde estamos. Se pulamos o passo 4, 'currentStep' ainda é 3 na lógica linear?
      // Não, 'next' agora é 5. Vamos checar o destino.

      // Simplificando: vamos pegar o próximo passo válido iterando
      while (
        (next === 1 &&
          (data.role === "revenda" || data.role === "produto_proprio")) || // Skip Estoque
        (next === 2 && data.role === "revenda") || // Skip Origem (Revenda é sempre compra)
        (next === 4 && !flags.geraEstoque) || // Skip Detalhes Estoque
        (next === 5 && !flags.permiteComposicao) // Skip Receita
      ) {
        next++;
      }

      set({ currentStep: Math.min(next, STEP_ORDER.length - 1) });
    },

    prevStep: () => {
      const { currentStep, data, flags } = get();
      let prev = currentStep - 1;

      // Lógica Reversa (Voltar) - Mesma lógica do Next, mas decrementando
      while (
        (prev === 5 && !flags.permiteComposicao) ||
        (prev === 4 && !flags.geraEstoque) ||
        (prev === 2 && data.role === "revenda") ||
        (prev === 1 &&
          (data.role === "revenda" || data.role === "produto_proprio"))
      ) {
        prev--;
      }

      set({ currentStep: Math.max(0, prev) });
    },

    setStep: (step) => set({ currentStep: step }),

    reset: () => set({ ...initialState, isOpen: true }),
  }),
);
