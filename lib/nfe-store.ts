import { create } from "zustand";
import { NotaFiscal, NfeTag, NfeManifestacao } from "@/types/nfe";

// --- MOCK DATA (Simulando o que viria da API/Sefaz) ---
const TAGS_INICIAIS: NfeTag[] = [
  { id: "t1", nome: "Escriturada", cor: "#22c55e" }, // Verde
  { id: "t2", nome: "Devolução", cor: "#f59e0b" }, // Amarelo
  { id: "t3", nome: "Bonificada", cor: "#3b82f6" }, // Azul
  { id: "t4", nome: "Pendente", cor: "#ef4444" }, // Vermelho
];

const NOTAS_MOCK: NotaFiscal[] = [
  {
    id: "nfe-1",
    chave: "35230912345678000190550010000012341000012345",
    numero: "1234",
    serie: "1",
    emitente: {
      cnpj: "12.345.678/0001-90",
      nome: "Indústria de Bebidas Golias SA",
      uf: "SP",
      ie: "123.456.789.111",
    },
    destinatario: { cnpj: "98.765.432/0001-00", nome: "Minha Empresa Matriz" },
    valores: { total: 15400.5, icms: 1800, ipi: 0, pis: 100, cofins: 300 },
    dataEmissao: new Date("2023-10-25T14:30:00"),
    dataAutorizacao: new Date("2023-10-25T14:35:00"),
    statusSefaz: "autorizada",
    manifestacao: "ciencia",
    statusSistema: "pendente",
    tags: ["t4"],
    itens: [],
  },
  {
    id: "nfe-2",
    chave: "28230998765432000110550020000567891000056789",
    numero: "56789",
    serie: "2",
    emitente: {
      cnpj: "98.765.432/0001-10",
      nome: "Distribuidora Alpha LTDA",
      uf: "SE",
      ie: "987.654.321.222",
    },
    destinatario: { cnpj: "98.765.432/0001-00", nome: "Minha Empresa Matriz" },
    valores: { total: 2350.0, icms: 200, ipi: 50, pis: 20, cofins: 60 },
    dataEmissao: new Date("2023-10-24T09:00:00"),
    dataAutorizacao: new Date("2023-10-24T09:05:00"),
    statusSefaz: "autorizada",
    manifestacao: "confirmada",
    statusSistema: "importada",
    tags: ["t1"],
    itens: [],
  },
  {
    id: "nfe-3",
    chave: "35230911122233000144550010000099991000099999",
    numero: "9999",
    serie: "1",
    emitente: {
      cnpj: "11.222.333/0001-44",
      nome: "Tech Electronics Importadora",
      uf: "SP",
      ie: "111.222.333.444",
    },
    destinatario: { cnpj: "98.765.432/0001-00", nome: "Minha Empresa Matriz" },
    valores: { total: 45000.0, icms: 5000, ipi: 2000, pis: 500, cofins: 1500 },
    dataEmissao: new Date("2023-10-20T10:00:00"),
    dataAutorizacao: new Date("2023-10-20T10:02:00"),
    statusSefaz: "cancelada",
    manifestacao: "sem_manifestacao",
    statusSistema: "erro",
    tags: ["t2"],
    itens: [],
  },
];

// --- STORE ---
interface NfeStore {
  notas: NotaFiscal[];
  tags: NfeTag[];
  selectedNotas: string[]; // IDs
  visibleColumns: string[];

  // Actions
  toggleColumn: (col: string) => void;
  toggleSelectNota: (id: string) => void;
  selectAll: (ids: string[]) => void;
  addTagToNota: (nfeId: string, tagId: string) => void;
  manifestarNota: (nfeId: string, tipo: NfeManifestacao) => void;
  importarXml: (files: File[]) => void; // Simulação Drag & Drop
}

export const useNfeStore = create<NfeStore>((set) => ({
  notas: NOTAS_MOCK,
  tags: TAGS_INICIAIS,
  selectedNotas: [],
  visibleColumns: [
    "emissao",
    "tags",
    "chave",
    "numero",
    "emitente",
    "valor",
    "status",
  ],

  toggleColumn: (col) =>
    set((state) => ({
      visibleColumns: state.visibleColumns.includes(col)
        ? state.visibleColumns.filter((c) => c !== col)
        : [...state.visibleColumns, col],
    })),

  toggleSelectNota: (id) =>
    set((state) => ({
      selectedNotas: state.selectedNotas.includes(id)
        ? state.selectedNotas.filter((n) => n !== id)
        : [...state.selectedNotas, id],
    })),

  selectAll: (ids) => set({ selectedNotas: ids }),

  addTagToNota: (nfeId, tagId) =>
    set((state) => ({
      notas: state.notas.map((n) =>
        n.id === nfeId
          ? { ...n, tags: n.tags.includes(tagId) ? n.tags : [...n.tags, tagId] }
          : n,
      ),
    })),

  manifestarNota: (nfeId, tipo) =>
    set((state) => ({
      notas: state.notas.map((n) =>
        n.id === nfeId ? { ...n, manifestacao: tipo } : n,
      ),
    })),

  importarXml: (files) => {
    // Simulação: Cria uma nota nova baseada no arquivo
    console.log("Arquivos recebidos:", files);
    // Aqui entrará a lógica real de ler o XML
  },
}));
