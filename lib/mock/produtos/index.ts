import { Categoria } from "./categorias";
import { Marca } from "./marcas";
import {
  TabelaPreco,
  AgendamentoPreco,
  RegraPrecificacao,
} from "./precificacao";
import { PerfilFiscal } from "./fiscal";

// --- INTERFACES AUXILIARES ---
export interface DadosNutricionais {
  porcao: string;
  valorEnergetico: string;
  carboidratos: string;
  proteinas: string;
  gordurasTotais: string;
  sodio: string;
  contemLactose: boolean;
  contemGluten: boolean;
  alertaAltoAcucar: boolean;
  alertaGorduraSaturada: boolean;
}

export interface DadosBalanca {
  exportar: boolean;
  itemPesavel: boolean;
  diasValidade: number;
  tabelaNutricional?: DadosNutricionais;
}

export interface GradeVariacao {
  id: string;
  nome: string;
  sku: string;
  ean: string;
  estoqueAtual: number;
}

export interface ProdutoFornecedor {
  id: string;
  fornecedorId: string;
  codigoNaNota: string;
  principal: boolean;
  fatorConversao: number;
  unidadeCompra: string;
  ultimoPrecoCompra: number;
  dataUltimaCompra: Date;
}

export interface RestricaoVenda {
  apenasMaiores18: boolean;
  solicitarSupervisor: boolean;
  bloqueadoVenda: boolean;
  mensagemBloqueio?: string;
}

export interface PrecificacaoPorLoja {
  empresaId: string;
  precoCusto: number;
  custoMedio: number;
  margemLucroAlvo: number;
  markupAlvo: number;
  precoAberto: boolean;
  // CORREÇÃO: O preço de venda vem das tabelas
  tabelas: TabelaPreco[];
  agendamentos?: AgendamentoPreco[];
  regrasEspecificas?: RegraPrecificacao[];

  promocao?: {
    ativo: boolean;
    precoPromocional: number;
    dataInicio?: Date;
    dataFim?: Date;
    diasSemana?: number[];
  };
}

export interface EstoquePorLoja {
  empresaId: string;
  atual: number;
  minimo: number;
  maximo: number;
  seguranca: number;
  pontoReposicao: number;
  tempoReposicao: number;
  loteEconomicoCompra: number;
  localizacao?: string;
  curvaABC?: "A" | "B" | "C";
}

export interface EmbalagemVenda {
  id: string;
  nome: string;
  unidade: string;
  fatorConversao: number;
  codigoBarras: string;
  precoVenda?: number;
  ativo: boolean;
}

export interface FiscalDetalhado {
  perfilFiscalId?: string;
  ncm: string;
  cest?: string;
  origem: number;
  cstIpiSaida?: string;
  cstIpiEntrada?: string;
  aliquotaIpi?: number;
  codigoEnquadramentoIpi?: string;
  cstPisSaida?: string;
  cstCofinsSaida?: string;
  cstPisEntrada?: string;
  cstCofinsEntrada?: string;
  aliquotaPis?: number;
  aliquotaCofins?: number;
  cstIss?: string;
  aliquotaIss?: number;
  incideImpostoSeletivo: boolean;
  aliquotaIs?: number;
  aliquotaIbs?: number;
  aliquotaCbs?: number;
}

// O PRODUTO MESTRE
export interface Produto {
  id: string;
  ativo: boolean;
  controlaEstoque: boolean;

  nome: string;
  descricaoAuxiliar?: string;
  descricaoDetalhadaHtml?: string;
  codigoInterno: string;
  codigoBarras: string;
  codigosBarrasAdicionais: string[];
  referencia?: string;

  tipoItem: string;
  unidade: string;
  casasDecimais: number;
  categoriaId: string;
  subcategoriaId?: string;
  marcaId: string;
  centroCustoId?: string;

  tipoControle: "unitario" | "lote" | "serie";

  imagens: string[];
  catalogo: {
    publicar: boolean;
    destaque: boolean;
    ordem: number;
  };

  pesoBruto: number;
  pesoLiquido: number;
  volume?: number;
  dimensoes?: { altura: number; largura: number; comprimento: number };

  grupoTributarioId?: string;

  // DADOS DO ITEM (CORREÇÃO: Origem adicionada aqui)
  ncm: string;
  cest?: string;
  origem: number; // 0 - Nacional, 1 - Estrangeira...

  fiscalExcecao?: FiscalDetalhado;

  tipo: "simples" | "grade" | "kit" | "servico";
  variacoes?: GradeVariacao[];
  embalagens?: EmbalagemVenda[];
  balanca?: DadosBalanca;

  fornecedores: ProdutoFornecedor[];
  restricoes?: RestricaoVenda;

  precos: PrecificacaoPorLoja[];
  estoque: EstoquePorLoja[];

  createdAt: Date;
  updatedAt: Date;
}

// --- MOCK INICIAL ---
export const produtos: Produto[] = [
  {
    id: "prod-1",
    ativo: true,
    controlaEstoque: true,
    nome: "Notebook Dell Inspiron 15",
    descricaoAuxiliar: "Core i5 8GB SSD 256GB Prata",
    descricaoDetalhadaHtml: "<p>Notebook de alta performance...</p>",
    codigoInterno: "10001",
    codigoBarras: "7899876543210",
    codigosBarrasAdicionais: [],
    referencia: "I15-3000",

    tipoItem: "00",
    unidade: "UN",
    casasDecimais: 0,
    categoriaId: "cat-1",
    marcaId: "m-1",
    tipoControle: "serie",

    imagens: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000",
    ],
    catalogo: { publicar: true, destaque: true, ordem: 1 },

    grupoTributarioId: "gt-1",
    ncm: "8471.30.12",
    origem: 0, // Adicionado aqui

    pesoBruto: 2.5,
    pesoLiquido: 1.8,
    dimensoes: { altura: 2, largura: 35, comprimento: 24 },
    tipo: "simples",
    centroCustoId: "1.01",

    fornecedores: [
      {
        id: "vin-1",
        fornecedorId: "forn-dell",
        codigoNaNota: "DELL-I15-LOTE",
        principal: true,
        fatorConversao: 1,
        unidadeCompra: "UN",
        ultimoPrecoCompra: 2500.0,
        dataUltimaCompra: new Date("2023-10-01"),
      },
    ],

    precos: [
      {
        empresaId: "emp-1",
        precoCusto: 2500,
        custoMedio: 2450,
        margemLucroAlvo: 40,
        markupAlvo: 66.6,
        precoAberto: false,
        tabelas: [{ id: "tab-1", nome: "Varejo", valor: 3500.0 }],
      },
    ],
    estoque: [
      {
        empresaId: "emp-1",
        atual: 10,
        minimo: 5,
        maximo: 20,
        seguranca: 2,
        pontoReposicao: 6,
        tempoReposicao: 15,
        loteEconomicoCompra: 5,
        localizacao: "A1",
        curvaABC: "A",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod-2",
    ativo: true,
    controlaEstoque: true,
    nome: "Cerveja Pilsen Lata 350ml",
    codigoInterno: "10099",
    codigoBarras: "7891234560001",
    codigosBarrasAdicionais: [],

    tipoItem: "00",
    unidade: "UN",
    casasDecimais: 0,
    categoriaId: "cat-bebidas",
    marcaId: "m-ambev",
    tipoControle: "lote",
    imagens: [
      "https://images.unsplash.com/photo-1605218427306-633ba88c5283?auto=format&fit=crop&q=80&w=1000",
    ],
    catalogo: { publicar: true, destaque: false, ordem: 2 },

    grupoTributarioId: "gt-2",
    ncm: "2203.00.00",
    cest: "03.001.00",
    origem: 0, // Adicionado aqui

    embalagens: [
      {
        id: "emb-1",
        nome: "Pack c/ 12",
        unidade: "PCK",
        fatorConversao: 12,
        codigoBarras: "7891234560012",
        ativo: true,
      },
    ],

    pesoBruto: 0.37,
    pesoLiquido: 0.35,
    tipo: "simples",
    restricoes: {
      apenasMaiores18: true,
      solicitarSupervisor: false,
      bloqueadoVenda: false,
    },

    fornecedores: [],
    precos: [
      {
        empresaId: "emp-1",
        precoCusto: 2.0,
        custoMedio: 2.0,
        margemLucroAlvo: 50,
        markupAlvo: 100,
        precoAberto: false,
        tabelas: [{ id: "tab-1", nome: "Varejo", valor: 4.0 }],
        promocao: { ativo: true, precoPromocional: 3.5, diasSemana: [5, 6] },
      },
    ],
    estoque: [
      {
        empresaId: "emp-1",
        atual: 100,
        minimo: 24,
        maximo: 200,
        seguranca: 12,
        pontoReposicao: 48,
        tempoReposicao: 1,
        loteEconomicoCompra: 24,
        curvaABC: "A",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getProdutoById(id: string) {
  return produtos.find((p) => p.id === id);
}
