export interface UnidadeMedida {
  sigla: string; // UN, KG, L
  descricao: string;
  casasDecimais: number; // Ex: UN = 0, KG = 3
}

export const unidades: UnidadeMedida[] = [
  { sigla: "UN", descricao: "Unidade", casasDecimais: 0 },
  { sigla: "CX", descricao: "Caixa", casasDecimais: 0 },
  { sigla: "KG", descricao: "Quilograma", casasDecimais: 3 },
  { sigla: "L", descricao: "Litro", casasDecimais: 3 },
  { sigla: "MT", descricao: "Metro", casasDecimais: 2 },
  { sigla: "M2", descricao: "Metro Quadrado", casasDecimais: 2 },
  { sigla: "FD", descricao: "Fardo", casasDecimais: 0 },
];
