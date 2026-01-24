// lib/mock/usuarios.ts

export interface UserPermissions {
  stock: boolean; // Acesso básico ao sistema (Login)
  ordi: boolean; // Gestão de Uso e Consumo
  countifly: boolean; // Inventário/Coletor
  val: boolean; // Assistente de Compras
  brutos: boolean; // Engenharia de Produto
  rikko: boolean; // Requisições Internas
  admin: boolean; // Super admin (acessa configurações globais)
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string; // URL da imagem ou null
  cpf?: string; // Opcional no visual, mas importante para RH/Fiscal
  ativo: boolean;

  // Vínculos Corporativos
  empresaId: string;
  setorId: string;
  cargo: string;

  // Segurança
  senha?: string; // Apenas para simulação

  // Acessos
  permissoes: UserPermissions;

  // Dados Pessoais (Ocultos na listagem principal)
  telefone?: string;
  dataNascimento?: string;
}

export const usuarios: Usuario[] = [
  {
    id: "usr-1",
    nome: "Will Santos",
    email: "will@techvision.com.br",
    avatar: "https://github.com/shadcn.png", // Placeholder
    cpf: "123.456.789-00",
    ativo: true,
    empresaId: "emp-1", // TechVision (Matriz)
    setorId: "set-3", // TI
    cargo: "Desenvolvedor Fullstack",
    permissoes: {
      stock: true,
      ordi: true,
      countifly: true,
      val: true,
      brutos: true,
      rikko: true,
      admin: true,
    },
    telefone: "(79) 99999-9999",
  },
  {
    id: "usr-2",
    nome: "Milene Andrade",
    email: "milene@alphadistribuidora.com.br",
    avatar: "", // Sem avatar, usaremos as iniciais
    cpf: "987.654.321-00",
    ativo: true,
    empresaId: "emp-2", // Alpha Distribuidora
    setorId: "set-6", // Financeiro
    cargo: "Gerente Financeira",
    permissoes: {
      stock: true,
      ordi: true, // Pode aprovar pedidos
      countifly: false,
      val: true, // Precisa ver compras
      brutos: false,
      rikko: true,
      admin: false,
    },
  },
  {
    id: "usr-3",
    nome: "Carlos Oliveira",
    email: "carlos@mundooffice.com.br",
    cpf: "111.222.333-44",
    ativo: true,
    empresaId: "emp-3", // Mundo Office
    setorId: "set-9", // Comercial
    cargo: "Vendedor",
    permissoes: {
      stock: true,
      ordi: false,
      countifly: true, // Faz contagem de estoque
      val: false,
      brutos: false,
      rikko: false,
      admin: false,
    },
  },
  {
    id: "usr-4",
    nome: "Ana Paula Costa",
    email: "ana.paula@techvision.com.br",
    ativo: false, // Usuário inativo
    empresaId: "emp-1",
    setorId: "set-2", // RH
    cargo: "Analista de RH",
    permissoes: {
      stock: false,
      ordi: false,
      countifly: false,
      val: false,
      brutos: false,
      rikko: false,
      admin: false,
    },
  },
];

// Helpers
export function getUsuarioById(id: string) {
  return usuarios.find((u) => u.id === id);
}

export function getUsuariosByEmpresa(empresaId: string) {
  return usuarios.filter((u) => u.empresaId === empresaId);
}

// NOVO HELPER ADICIONADO PARA CORRIGIR O ERRO
export function getUsuariosBySetor(setorId: string) {
  return usuarios.filter((u) => u.setorId === setorId);
}
