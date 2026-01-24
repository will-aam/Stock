// lib/mock/produtos/tabelas-fiscais.ts

// --- CST PIS/COFINS (Tabela 4.3.3 e 4.3.4 do SPED) ---
export interface CstPisCofins {
  codigo: string;
  descricao: string;
  tipo: "entrada" | "saida";
}

export const cstPisCofins: CstPisCofins[] = [
  // SAÍDA
  {
    codigo: "01",
    descricao: "01 - Operação Tributável (alíquota normal)",
    tipo: "saida",
  },
  {
    codigo: "04",
    descricao: "04 - Operação Tributável (Monofásica - Alíquota Zero)",
    tipo: "saida",
  },
  {
    codigo: "06",
    descricao: "06 - Operação Tributável (Alíquota Zero)",
    tipo: "saida",
  },
  {
    codigo: "07",
    descricao: "07 - Operação Isenta da Contribuição",
    tipo: "saida",
  },
  { codigo: "08", descricao: "08 - Operação sem Incidência", tipo: "saida" },
  { codigo: "49", descricao: "49 - Outras Operações de Saída", tipo: "saida" },
  // ENTRADA
  {
    codigo: "50",
    descricao: "50 - Operação com Direito a Crédito",
    tipo: "entrada",
  },
  {
    codigo: "70",
    descricao: "70 - Operação sem Direito a Crédito",
    tipo: "entrada",
  },
  {
    codigo: "98",
    descricao: "98 - Outras Operações de Entrada",
    tipo: "entrada",
  },
];

// --- CST IPI (Tabela 4.5.4 e 4.5.5) ---
export interface CstIpi {
  codigo: string;
  descricao: string;
  tipo: "entrada" | "saida";
}

export const cstIpi: CstIpi[] = [
  // SAÍDA
  { codigo: "50", descricao: "50 - Saída Tributada", tipo: "saida" },
  {
    codigo: "51",
    descricao: "51 - Saída Tributada com Alíquota Zero",
    tipo: "saida",
  },
  { codigo: "52", descricao: "52 - Saída Isenta", tipo: "saida" },
  { codigo: "53", descricao: "53 - Saída Não-Tributada", tipo: "saida" },
  // ENTRADA
  {
    codigo: "00",
    descricao: "00 - Entrada com Recuperação de Crédito",
    tipo: "entrada",
  },
  {
    codigo: "01",
    descricao: "01 - Entrada Tributada com Alíquota Zero",
    tipo: "entrada",
  },
];

// --- ENQUADRAMENTO IPI ---
export const enquadramentoIpi = [
  { codigo: "999", descricao: "999 - Tributação normal IPI" },
  { codigo: "301", descricao: "301 - Imunidade (Livros, jornais...)" },
  // ... outros códigos
];
