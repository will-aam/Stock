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
  centroCusto: string;
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
    // NOVO CAMPO: Validade do Certificado
    certificadoValidade?: Date;
  };

  integracoes: {
    whatsappToken?: string;
  };
}

export const empresas: Empresa[] = [
  {
    id: "emp-1",
    displayId: 1,
    razaoSocial: "TechVision Soluções Digitais LTDA",
    nomeFantasia: "TechVision",
    cnpj: "12.345.678/0001-90",
    ie: "123456789",
    isentoIE: false,
    im: "98765",
    regimeTributario: "lucro_presumido",
    ativa: true,
    principal: true,
    centroCusto: "1.01.001",
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
      // Cenário: OK (Vence em 2026)
      certificadoValidade: new Date("2026-12-31"),
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
    centroCusto: "2.01.005",
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
      // Cenário: AVISO (Vence em 15 dias a partir de hoje)
      certificadoValidade: new Date(
        new Date().setDate(new Date().getDate() + 15),
      ),
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
    centroCusto: "1.02.001",
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
      // Cenário: VENCIDO (Venceu mês passado)
      certificadoValidade: new Date(
        new Date().setMonth(new Date().getMonth() - 1),
      ),
    },
    integracoes: {},
  },
];

export function getEmpresaById(id: string) {
  return empresas.find((e) => e.id === id);
}
