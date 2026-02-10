export type ProductRole =
  | "revenda"
  | "uso_interno"
  | "insumo"
  | "produto_proprio";
// "servico" removido conforme solicitado

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
  currentStep: number;
  isOpen: boolean;

  // Flags de Lógica (Calculados/Derivados)
  flags: {
    geraEstoque: boolean;
    vendaHabilitada: boolean;
    producaoHabilitada: boolean;
    permiteComposicao: boolean;
    permiteEntradaNF: boolean; // Se false, oculta opções de compra
    requerLocalEstoque: boolean;
  };

  // Dados do Produto
  data: {
    role: ProductRole | null;
    controlaEstoqueEscolhaUsuario?: boolean; // Decisão explícita (Sim/Não)
    origemCompra?: boolean; // true = Comprado, false = Produzido

    // Dados Essenciais
    nome: string;
    unidade: string;
    categoriaId: string;
    subcategoriaId?: string;
    marcaId?: string;
    codigoInterno?: string;
    codigoBarras?: string;

    // Opções de Venda (Novos)
    apareceNoCupom?: boolean;

    // Dados Estoque (Novos)
    estoqueMinimo?: number;
    localizacao?: string; // Equivalente a depósito padrão
    controlaLote?: boolean;
    controlaValidade?: boolean;

    // Preço
    precoVenda?: number;

    // Fiscal
    grupoTributarioId?: string;
    ncm?: string;
    cest?: string;
    origem?: number;
  };
}
