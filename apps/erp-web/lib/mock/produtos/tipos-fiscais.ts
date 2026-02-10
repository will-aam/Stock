// lib/mock/produtos/tipos-fiscais.ts

export interface TipoItem {
  codigo: string; // Ex: "00", "01"
  descricao: string;
}

// Baseado na Tabela do SPED (Fiscal)
export const tiposItem: TipoItem[] = [
  { codigo: "00", descricao: "Mercadoria para Revenda" },
  { codigo: "01", descricao: "Matéria-Prima" },
  { codigo: "02", descricao: "Embalagem" },
  { codigo: "03", descricao: "Produto em Processo" },
  { codigo: "04", descricao: "Produto Acabado" },
  { codigo: "05", descricao: "Subproduto" },
  { codigo: "06", descricao: "Produto Intermediário" },
  { codigo: "07", descricao: "Material de Uso e Consumo" },
  { codigo: "08", descricao: "Ativo Imobilizado" },
  { codigo: "09", descricao: "Serviços" },
  { codigo: "99", descricao: "Outros" },
];

export interface UnidadeComercial {
  sigla: string;
  descricao: string;
}

// Expandindo as unidades que já tínhamos
export const unidadesComerciais: UnidadeComercial[] = [
  { sigla: "UN", descricao: "Unidade" },
  { sigla: "CX", descricao: "Caixa" },
  { sigla: "KG", descricao: "Quilograma" },
  { sigla: "L", descricao: "Litro" },
  { sigla: "M", descricao: "Metro" },
  { sigla: "M2", descricao: "Metro Quadrado" },
  { sigla: "M3", descricao: "Metro Cúbico" },
  { sigla: "PAR", descricao: "Par" },
  { sigla: "PCT", descricao: "Pacote" },
  { sigla: "FD", descricao: "Fardo" },
  { sigla: "KIT", descricao: "Kit Conjunto" },
];
