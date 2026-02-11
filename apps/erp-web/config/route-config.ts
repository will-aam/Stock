export interface RouteMetadata {
  title: string;
  subtitle: string;
}

export const routeConfig: Record<string, RouteMetadata> = {
  "/produtos": {
    title: "Catálogo de Produtos",
    subtitle: "Gerencie o cadastro mestre, regras fiscais e identificação dos itens.",
  },
  "/produtos/classificacao": {
    title: "Classificação & Atributos",
    subtitle: "Gerencie as tabelas auxiliares (Marcas, Categorias) que organizam seu catálogo.",
  },
  "/produtos/fiscal": {
    title: "Gestão Fiscal & Tributária",
    subtitle: "Configure as regras de impostos (ICMS, PIS, COFINS) e tabelas padronizadas do SPED.",
  },
  "/produtos/unidades": {
    title: "Unidades & Medidas",
    subtitle: "Defina as unidades de medida padrão para controle de estoque e conversões (KG, UN, LT).",
  },
  "/estoque": {
    title: "Gestão de Estoque",
    subtitle: "Controle de saldos, movimentações e rastreabilidade por lote e validade.",
  },
  "/estoque/validade": {
    title: "Controle de Validade",
    subtitle: "Monitore produtos próximos ao vencimento e gerencie o estoque por validade.",
  },
  "/compras": {
    title: "Gestão de Compras",
    subtitle: "Cotações, pedidos de compra e gestão de fornecedores.",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Visão geral dos principais indicadores do sistema.",
  },
  "/empresas": {
    title: "Empresas & Filiais",
    subtitle: "Cadastro e configuração das empresas do grupo.",
  },
  "/usuarios": {
    title: "Gestão de Usuários",
    subtitle: "Controle de acessos, perfis e permissões.",
  },
  "/entrada": {
    title: "Entrada de Mercadorias",
    subtitle: "Registre e controle as notas fiscais de entrada.",
  },
  "/ordi": {
    title: "Ordi Configurações",
    subtitle: "Configurações do sistema Ordi.",
  },
  "/ordi/configuracoes": {
    title: "Configurações do Sistema",
    subtitle: "Personalize as configurações do sistema Ordi.",
  },
};

// Fallback para rotas não mapeadas
export const getRouteMetadata = (pathname: string): RouteMetadata => {
  // Tenta match exato primeiro
  if (routeConfig[pathname]) {
    return routeConfig[pathname];
  }

  // Tenta match por prefixo (ex: /produtos/[id]/custo -> /produtos)
  const segments = pathname.split("/").filter(Boolean);
  for (let i = segments.length; i > 0; i--) {
    const path = "/" + segments.slice(0, i).join("/");
    if (routeConfig[path]) {
      return routeConfig[path];
    }
  }

  // Fallback padrão
  return {
    title: "Stock System",
    subtitle: "Sistema de Gestão Empresarial",
  };
};
