// Interfaces
export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
}

export interface Subcategoria {
  id: string;
  nome: string;
  categoriaId: string; // O link com a categoria pai
}

// Mock de Categorias (Pais)
export const categorias: Categoria[] = [
  { id: "cat-1", nome: "Informática" },
  { id: "cat-2", nome: "Papelaria" },
  { id: "cat-3", nome: "Móveis para Escritório" },
  { id: "cat-4", nome: "Limpeza e Higiene" },
  { id: "cat-5", nome: "Matéria-Prima" },
  { id: "cat-6", nome: "Eletrodomésticos" },
];

// Mock de Subcategorias (Filhos)
export const subcategorias: Subcategoria[] = [
  // Vinculados a Informática (cat-1)
  { id: "sub-1", nome: "Periféricos (Mouse/Teclado)", categoriaId: "cat-1" },
  { id: "sub-2", nome: "Computadores e Notebooks", categoriaId: "cat-1" },
  { id: "sub-3", nome: "Monitores e Telas", categoriaId: "cat-1" },
  { id: "sub-4", nome: "Cabos e Adaptadores", categoriaId: "cat-1" },

  // Vinculados a Papelaria (cat-2)
  { id: "sub-5", nome: "Papéis (A4/Carta)", categoriaId: "cat-2" },
  { id: "sub-6", nome: "Escrita (Canetas/Lápis)", categoriaId: "cat-2" },
  { id: "sub-7", nome: "Organização (Pastas/Arquivos)", categoriaId: "cat-2" },

  // Vinculados a Móveis (cat-3)
  { id: "sub-8", nome: "Cadeiras e Poltronas", categoriaId: "cat-3" },
  { id: "sub-9", nome: "Mesas e Estações de Trabalho", categoriaId: "cat-3" },

  // Vinculados a Limpeza (cat-4)
  { id: "sub-10", nome: "Produtos Químicos", categoriaId: "cat-4" },
  { id: "sub-11", nome: "Papel Higiênico e Toalha", categoriaId: "cat-4" },

  // Vinculados a Matéria-Prima (cat-5)
  { id: "sub-12", nome: "Componentes Eletrônicos", categoriaId: "cat-5" },
  { id: "sub-13", nome: "Plásticos e Polímeros", categoriaId: "cat-5" },
];

// Helpers Úteis
export function getCategoriaById(id: string) {
  return categorias.find((c) => c.id === id);
}

export function getSubcategoriaById(id: string) {
  return subcategorias.find((s) => s.id === id);
}

export function getSubcategoriasByCategoriaId(categoriaId: string) {
  return subcategorias.filter((s) => s.categoriaId === categoriaId);
}
