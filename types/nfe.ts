export type NfeStatus = "autorizada" | "cancelada" | "denegada";
export type NfeManifestacao =
  | "sem_manifestacao"
  | "ciencia"
  | "confirmada"
  | "desconhecida"
  | "nao_realizada";
export type NfeStatusSistema = "pendente" | "importada" | "erro";

export interface NfeTag {
  id: string;
  nome: string;
  cor: string; // hex code
}

export interface NfeItem {
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface NotaFiscal {
  id: string; // ID interno
  chave: string; // 44 dígitos
  numero: string;
  serie: string;

  emitente: {
    cnpj: string;
    nome: string;
    uf: string;
    ie: string;
  };

  destinatario: {
    cnpj: string;
    nome: string;
  };

  valores: {
    total: number;
    icms: number;
    ipi: number;
    pis: number;
    cofins: number;
  };

  dataEmissao: Date;
  dataAutorizacao: Date;

  statusSefaz: NfeStatus;
  manifestacao: NfeManifestacao;
  statusSistema: NfeStatusSistema;

  tags: string[]; // IDs das tags
  itens: NfeItem[];
  xmlUrl?: string;
  pdfUrl?: string;
}
