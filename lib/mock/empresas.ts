// lib/mock/empresas.ts

export type PricingRuleType = "individual" | "shared" | "rule_based";

export interface PricingRules {
  venda: PricingRuleType;
  custo: PricingRuleType;
  promocional: PricingRuleType;
  minimo: PricingRuleType;
}

export interface FiscalSeries {
  id: string;
  serie: string;
  pdv: string;
  numInicial: number;
  tipo: "NFe" | "NFCe" | "MDFe";
  ativo: boolean;
}

export interface Empresa {
  id: string;
  displayId: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  isentoIE: boolean;
  im: string;
  regimeTributario: "simples" | "lucro_presumido" | "lucro_real";
  ativa: boolean;
  principal: boolean;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    referencia?: string;
  };
  contato: {
    telefone: string;
    email: string;
    site?: string;
  };
  fiscal: {
    csc?: string;
    cscId?: string;
    emailEnvioXml?: string;
    series: FiscalSeries[];
  };
  regrasPreco: PricingRules;
  integracoes: {
    whatsappToken?: string;
  };
}

export const empresas: Empresa[] = [
  {
    id: "emp-1",
    displayId: 1,
    razaoSocial: "TechVision Soluções Digitais LTDA",
    nomeFantasia: "TechVision (Matriz)",
    cnpj: "12.345.678/0001-90",
    ie: "123456789",
    isentoIE: false,
    im: "98765",
    regimeTributario: "lucro_presumido",
    ativa: true,
    principal: true,
    endereco: {
      cep: "49000-000",
      logradouro: "Av. Beira Mar",
      numero: "100",
      bairro: "13 de Julho",
      cidade: "Aracaju",
      uf: "SE",
    },
    contato: {
      telefone: "(79) 99999-0001",
      email: "contato@techvision.com.br",
    },
    fiscal: {
      series: [
        {
          id: "s1",
          serie: "1",
          pdv: "01",
          numInicial: 1,
          tipo: "NFCe",
          ativo: true,
        },
      ],
    },
    regrasPreco: {
      venda: "shared",
      custo: "individual",
      promocional: "shared",
      minimo: "rule_based",
    },
    integracoes: {},
  },
  {
    id: "emp-2",
    displayId: 2,
    razaoSocial: "Alpha Distribuidora e Logística SA",
    nomeFantasia: "Alpha Distribuidora",
    cnpj: "98.765.432/0001-10",
    ie: "987654321",
    isentoIE: false,
    im: "12345",
    regimeTributario: "lucro_real",
    ativa: true,
    principal: false,
    endereco: {
      cep: "49000-100",
      logradouro: "Rodovia das Indústrias",
      numero: "500",
      bairro: "Distrito Industrial",
      cidade: "Nossa Senhora do Socorro",
      uf: "SE",
    },
    contato: {
      telefone: "(79) 3333-4444",
      email: "fiscal@alphadistribuidora.com.br",
    },
    fiscal: {
      series: [],
    },
    regrasPreco: {
      venda: "individual",
      custo: "individual",
      promocional: "individual",
      minimo: "individual",
    },
    integracoes: {},
  },
  {
    id: "emp-3",
    displayId: 3,
    razaoSocial: "Mundo Office Comércio de Papelaria LTDA",
    nomeFantasia: "Mundo Office",
    cnpj: "45.678.901/0001-23",
    ie: "ISENTO",
    isentoIE: true,
    im: "56789",
    regimeTributario: "simples",
    ativa: true,
    principal: false,
    endereco: {
      cep: "49000-200",
      logradouro: "Rua do Comércio",
      numero: "25",
      bairro: "Centro",
      cidade: "Aracaju",
      uf: "SE",
    },
    contato: {
      telefone: "(79) 98888-7777",
      email: "vendas@mundooffice.com.br",
    },
    fiscal: {
      series: [],
    },
    regrasPreco: {
      venda: "shared",
      custo: "shared",
      promocional: "shared",
      minimo: "shared",
    },
    integracoes: {},
  },
];

export function getEmpresaById(id: string) {
  return empresas.find((e) => e.id === id);
}
