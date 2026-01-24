export interface Categoria {
  id: string;
  nome: string;
  paiId?: string;
}

export const categorias: Categoria[] = [
  { id: "cat-1", nome: "Informática" },
  { id: "cat-2", nome: "Papelaria" },
  { id: "cat-3", nome: "Móveis para Escritório" },
  { id: "cat-4", nome: "Limpeza e Higiene" },
  { id: "cat-5", nome: "Matéria-Prima" },
];

export function getCategoriaById(id: string) {
  return categorias.find((c) => c.id === id);
}
