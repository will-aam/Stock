export interface Marca {
  id: string;
  nome: string;
}

export const marcas: Marca[] = [
  { id: "m-1", nome: "Dell" },
  { id: "m-2", nome: "HP" },
  { id: "m-3", nome: "Chamex" },
  { id: "m-4", nome: "Faber-Castell" },
  { id: "m-5", nome: "Nestlé" },
  { id: "m-6", nome: "Genérico" }, // Para produtos sem marca forte
];

export function getMarcaById(id: string) {
  return marcas.find((m) => m.id === id);
}
