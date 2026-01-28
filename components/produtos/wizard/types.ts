// components/produtos/wizard/types.ts

export type ProductRole =
  | "revenda"
  | "uso_interno"
  | "insumo"
  | "produto_proprio"
  | "servico";

export type WizardStep =
  | "papel"
  | "controle_estoque"
  | "origem"
  | "dados_basicos"
  | "detalhes_estoque"
  | "composicao"
  | "fiscal";

export interface WizardState {
  // Controle do Wizard
  currentStep: number; // Índice do passo atual (0, 1, 2...)
  isOpen: boolean;

  // Flags de Lógica (Calculados baseados nas escolhas)
  flags: {
    geraEstoque: boolean;
    vendaHabilitada: boolean;
    producaoHabilitada: boolean; // É usado na produção?
    permiteComposicao: boolean; // Tem receita/insumos?
    permiteEntradaNF: boolean; // Compra de fornecedor?
    requerLocalEstoque: boolean;
  };

  // Dados do Produto sendo construído
  data: {
    role: ProductRole | null;
    controlaEstoqueEscolhaUsuario?: boolean; // A escolha explícita do passo 2
    origemCompra?: boolean; // True = Compra, False = Produção Interna

    // Dados Essenciais
    nome: string;
    unidade: string;
    categoriaId: string;
    subcategoriaId?: string;
    marcaId?: string;
    codigoInterno?: string;
    codigoBarras?: string;

    // Dados Estoque
    estoqueMinimo?: number;
    localizacao?: string;

    // Preço
    precoVenda?: number;
    // --- CAMPOS FISCAIS (ADICIONADOS AGORA) ---
    grupoTributarioId?: string;
    ncm?: string;
    cest?: string;
    origem?: number;
  };
}
