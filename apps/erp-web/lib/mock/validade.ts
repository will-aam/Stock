// lib/mock/validade.ts

export type StatusValidade = "vencido" | "critico" | "atencao" | "ok";

export interface LoteValidade {
  id: string;
  produto: string;
  imagem: string;
  lote: string;
  quantidade: number;
  unidade: string;
  validade: string; // YYYY-MM-DD
  diasParaVencer: number;
  status: StatusValidade;
  custoUnitario: number;
  localizacao: string;
}

export const lotesValidade: LoteValidade[] = [
  {
    id: "1",
    produto: "Iogurte Natural Integral 170g",
    imagem: "/milk-carton.png",
    lote: "L-2023-A",
    quantidade: 15,
    unidade: "UN",
    validade: "2024-02-09", // Ontem (exemplo)
    diasParaVencer: -1,
    status: "vencido",
    custoUnitario: 2.5,
    localizacao: "Geladeira 01 - Prateleira 2",
  },
  {
    id: "2",
    produto: "Queijo Mussarela Fatiado 500g",
    imagem: "/placeholder.jpg",
    lote: "L-2023-B",
    quantidade: 40,
    unidade: "PCT",
    validade: "2024-02-15", // Daqui a 5 dias
    diasParaVencer: 5,
    status: "critico",
    custoUnitario: 18.0,
    localizacao: "Câmara Fria B",
  },
  {
    id: "3",
    produto: "Presunto Cozido",
    imagem: "/placeholder.jpg",
    lote: "L-2023-C",
    quantidade: 12,
    unidade: "KG",
    validade: "2024-02-25", // Daqui a 15 dias
    diasParaVencer: 15,
    status: "atencao",
    custoUnitario: 35.0,
    localizacao: "Câmara Fria A",
  },
  {
    id: "4",
    produto: "Leite Longa Vida Integral 1L",
    imagem: "/milk-carton.png",
    lote: "L-2023-D",
    quantidade: 120,
    unidade: "UN",
    validade: "2024-06-10",
    diasParaVencer: 120,
    status: "ok",
    custoUnitario: 4.2,
    localizacao: "Estoque Seco - Corredor 3",
  },
  {
    id: "5",
    produto: "Requeijão Cremoso Tradicional",
    imagem: "/placeholder.jpg",
    lote: "L-2023-E",
    quantidade: 8,
    unidade: "UN",
    validade: "2024-02-12", // Daqui a 2 dias
    diasParaVencer: 2,
    status: "critico",
    custoUnitario: 8.5,
    localizacao: "Geladeira 02",
  },
];
