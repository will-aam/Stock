// lib/mock/produtos/grupos-tributarios.ts

// Precisamos importar a interface FiscalDetalhado que definimos no index.ts
// (Como estamos em mocks separados, vou redefinir uma interface simplificada aqui
// para evitar erro de referência circular neste passo, mas no código real elas se conversam)

export interface RegraFiscalGrupo {
  // Regras de Origem e CST
  origem: number; // 0 - Nacional
  cstIpi: string;
  cstPis: string;
  cstCofins: string;

  // Alíquotas Padrão deste grupo
  aliquotaIcms: number;
  aliquotaPis: number;
  aliquotaCofins: number;

  // CFOPs Sugeridos (O sistema usa isso para sugerir na nota)
  cfopDentroEstado: string;
  cfopForaEstado: string;
}

export interface GrupoTributario {
  id: string;
  codigoInterno: string; // Ex: 001, 002
  descricao: string; // O NOME TÉCNICO: "Tributado Integralmente", "Monofásico"

  // O Enquadramento define quem pode usar esse grupo
  enquadramento:
    | "simples_nacional"
    | "lucro_real"
    | "lucro_presumido"
    | "mei"
    | "todos";

  ativo: boolean;

  // As regras que serão "herdadas" pelos produtos
  regras: RegraFiscalGrupo;
}

export const gruposTributarios: GrupoTributario[] = [
  {
    id: "gt-1",
    codigoInterno: "001",
    descricao: "Tributado Integralmente (18%)",
    enquadramento: "lucro_real", // Exemplo
    ativo: true,
    regras: {
      origem: 0,
      cstIpi: "50", // Saída Tributada
      cstPis: "01", // Operação Tributável
      cstCofins: "01",
      aliquotaIcms: 18,
      aliquotaPis: 1.65,
      aliquotaCofins: 7.6,
      cfopDentroEstado: "5102",
      cfopForaEstado: "6102",
    },
  },
  {
    id: "gt-2",
    codigoInterno: "002",
    descricao: "Monofásico - Revenda Combustível/Bebidas",
    enquadramento: "todos",
    ativo: true,
    regras: {
      origem: 0,
      cstIpi: "51", // Saída Tributada Alíquota Zero
      cstPis: "04", // Monofásico (Alíquota Zero na revenda)
      cstCofins: "04",
      aliquotaIcms: 0, // ICMS cobrado na indústria
      aliquotaPis: 0,
      aliquotaCofins: 0,
      cfopDentroEstado: "5405",
      cfopForaEstado: "6403",
    },
  },
  {
    id: "gt-3",
    codigoInterno: "003",
    descricao: "Substituição Tributária (ST)",
    enquadramento: "lucro_presumido",
    ativo: true,
    regras: {
      origem: 0,
      cstIpi: "53", // Não tributada
      cstPis: "01",
      cstCofins: "01",
      aliquotaIcms: 0, // Retido anteriormente
      aliquotaPis: 0.65,
      aliquotaCofins: 3.0,
      cfopDentroEstado: "5405",
      cfopForaEstado: "6403",
    },
  },
  {
    id: "gt-4",
    codigoInterno: "004",
    descricao: "Simples Nacional - Tributado sem perm. crédito",
    enquadramento: "simples_nacional",
    ativo: true,
    regras: {
      origem: 0,
      cstIpi: "99",
      cstPis: "99", // Outras operações
      cstCofins: "99",
      aliquotaIcms: 0, // Paga no DAS
      aliquotaPis: 0,
      aliquotaCofins: 0,
      cfopDentroEstado: "5102",
      cfopForaEstado: "6102",
    },
  },
];

export function getGrupoTributarioById(id: string) {
  return gruposTributarios.find((g) => g.id === id);
}
