// Copiado de cd-fisc/types/produto-fiscal.ts
export type TipoItemFiscal =
  | "mercadoria_revenda"
  | "materia_prima"
  | "embalagem"
  | "uso_consumo_essencial"
  | "uso_consumo_suplementar"
  | "outros";

export interface CodigoBarras {
  id: string;
  codigo: string;
  adicionadoEm: string;
}

export interface Fornecedor {
  id: string;
  codigoFornecedor: string;
  nomeFornecedor: string;
  unidadeMedida: string;
  codigoReferenciaItem: string;
}

export interface HistoricoCompra {
  id: string;
  produtoId: string;
  fornecedorId: string;
  nomeFornecedor: string;
  data: string;
  quantidadeTotal: number;
  quantidadeConvertidaUnd: number;
  valorTotalNF: number;
  precoBrutoUnd: number;
  custoLiquidoUnd: number;
  custoMedioUnd?: number;
}

export interface PrecificacaoProduto {
  produtoId: string;
  baseCusto: "custo_medio" | "custo_ultima_compra";
  custoBase: number;
  margemLucroPercentual: number;
  precoVendaUnitario: number;
  atualizadoEm: string;
}

export interface ProdutoFiscal {
  id: string;

  // Dados Principais
  nome: string;
  grupo?: string;
  marca?: string;
  codigoBarras: string;
  codigosBarrasVinculados?: CodigoBarras[];
  unidadeMedidaComercial: string;
  unidadeTributavel?: string;
  fatorConversao: number;
  imagemUrl?: string;

  // Fiscal e Precificação
  tipoItem: TipoItemFiscal;
  ncm: string;
  cest?: string;
  origemMercadoria: string;

  // ICMS
  icmsCstEntrada: string;
  icmsCstSaida: string;
  icmsAliquota: number;
  icmsModalidadeBC?: string;
  icmsReducaoBC?: number;
  icmsST: boolean;
  icmsMvaOriginal?: number;
  icmsMvaAjustado?: number;
  icmsGeraCredito: boolean;

  // PIS/COFINS
  pisCstEntrada: string;
  pisCstSaida: string;
  pisAliquota: number;
  cofinsCstEntrada: string;
  cofinsCstSaida: string;
  cofinsAliquota: number;
  pisCofinsGeraCredito: boolean;

  // IPI
  ipiEnquadramento?: string;
  ipiCst?: string;
  ipiAliquota?: number;
  ipiGeraCredito: boolean;

  // Precificação
  margemLucroSugerida?: number;
  custoOperacionalPercentual?: number;
  observacoes?: string;

  // Fornecedores
  fornecedores?: Fornecedor[];

  // Histórico e Precificação (Opcionais no objeto principal)
  historicoCompras?: HistoricoCompra[];
  precificacoes?: PrecificacaoProduto[];

  criadoEm: string;
}
