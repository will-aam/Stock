// TABELA DE CFOP (Natureza de Operação)
// Filtrei a sua lista gigante para ter os principais de Varejo e Atacado
export interface Cfop {
  codigo: string;
  descricao: string;
  aplicacao: "dentro_estado" | "fora_estado" | "entrada" | "saida";
}

export const cfops: Cfop[] = [
  // SAÍDAS DENTRO DO ESTADO (DE)
  {
    codigo: "5102",
    descricao: "Venda de mercadoria adquirida de terceiros",
    aplicacao: "dentro_estado",
  },
  {
    codigo: "5405",
    descricao: "Venda de mercadoria sujeito a ST (Subst. Tributária)",
    aplicacao: "dentro_estado",
  },
  {
    codigo: "5910",
    descricao: "Remessa em bonificação/brinde",
    aplicacao: "dentro_estado",
  },

  // SAÍDAS FORA DO ESTADO (FE)
  {
    codigo: "6102",
    descricao: "Venda de mercadoria adquirida de terceiros",
    aplicacao: "fora_estado",
  },
  {
    codigo: "6403",
    descricao: "Venda de mercadoria sujeito a ST",
    aplicacao: "fora_estado",
  },

  // ENTRADAS
  {
    codigo: "1102",
    descricao: "Compra para comercialização",
    aplicacao: "entrada",
  },
  {
    codigo: "2102",
    descricao: "Compra para comercialização (Fora Estado)",
    aplicacao: "entrada",
  },
];

// PERFIL TRIBUTÁRIO (A "Classe Fiscal" limpa)
// Em vez de escolher CFOP no produto, o usuário escolhe isso aqui:
export interface PerfilFiscal {
  id: string;
  nome: string; // Ex: "Tributado 18%", "Substituição Tributária"

  // Regras Padrão (Simples Nacional / Lucro Presumido)
  cst: string; // Para Lucro Presumido/Real (Ex: 00, 60)
  csosn: string; // Para Simples Nacional (Ex: 101, 500)

  aliquotaIcms: number; // %
  reducaoBase?: number; // %

  // Mensagem Fiscal (Aquelas mensagens de lei)
  mensagemFiscal?: string;
}

// Baseado nos seus CSVs "tributação.csv" e "classe fiscal.csv"
export const perfisFiscais: PerfilFiscal[] = [
  {
    id: "pf-1",
    nome: "Tributado 18% (Padrão)",
    cst: "00", // Tributado integralmente
    csosn: "102", // Tributado sem permissão de crédito
    aliquotaIcms: 18,
    mensagemFiscal: "",
  },
  {
    id: "pf-2",
    nome: "Substituição Tributária (ST)",
    cst: "60", // Cobrado anteriormente por ST
    csosn: "500", // ICMS cobrado anteriormente
    aliquotaIcms: 0, // Já foi pago na indústria
    mensagemFiscal: "Imposto retido por substituição tributária",
  },
  {
    id: "pf-3",
    nome: "Isento / Não Tributado",
    cst: "40",
    csosn: "400", // Não tributada
    aliquotaIcms: 0,
    mensagemFiscal: "Isento conforme artigo...",
  },
  {
    id: "pf-4",
    nome: "Monofásico (Bebidas/Combustível)",
    cst: "61",
    csosn: "500",
    aliquotaIcms: 0,
    mensagemFiscal: "Tributação Monofásica",
  },
];

export function getPerfilFiscalById(id: string) {
  return perfisFiscais.find((p) => p.id === id);
}
