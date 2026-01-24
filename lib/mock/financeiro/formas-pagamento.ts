export interface FormaPagamento {
  id: string;
  nome: string;
  taxaPadrao?: number; // Ex: 3.5% (útil para sugerir acréscimo)
  tipo: "dinheiro" | "credito" | "debito" | "pix" | "app" | "boleto";
}

export const formasPagamento: FormaPagamento[] = [
  { id: "fp-1", nome: "Dinheiro", tipo: "dinheiro", taxaPadrao: 0 },
  { id: "fp-2", nome: "Pix", tipo: "pix", taxaPadrao: 0 },
  { id: "fp-3", nome: "Cartão Crédito", tipo: "credito", taxaPadrao: 3.5 },
  { id: "fp-4", nome: "iFood", tipo: "app", taxaPadrao: 12.0 }, // Exemplo clássico de acréscimo
  { id: "fp-5", nome: "Boleto 30 Dias", tipo: "boleto", taxaPadrao: 0 },
];
