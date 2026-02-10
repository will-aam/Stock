// lib/nfe-parser.ts

export interface NFeItem {
  index: number; // Número do item na nota
  codigoProduto: string; // Código no fornecedor
  nome: string;
  ncm: string;
  cest: string;
  cfop: string;
  unidadeComercial: string;
  quantidadeComercial: number;
  valorUnitarioComercial: number;
  unidadeTributavel: string;
  quantidadeTributavel: number;
  eanComercial: string;
  eanTributavel: string;
  valorTotal: number;
  fatorConversao: number; // qTrib / qCom
  sugerido: {
    nome: string;
    unidade: string;
    precoCusto: number;
    estoque: number;
    grupoTributario: "revenda" | "uso_interno" | "insumo";
  };
}

export interface NFeData {
  chave: string;
  numero: string;
  serie: string;
  emitente: {
    cnpj: string;
    nome: string;
    fantasia: string;
  };
  itens: NFeItem[];
}

export async function parseNFeXML(file: File): Promise<NFeData> {
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");

  // Helper para pegar valor de tag (trata namespaces simples)
  const getTagValue = (parent: Element | Document, tagName: string): string => {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || "" : "";
  };

  // Verifica se é uma NFe
  const infNFe = xmlDoc.getElementsByTagName("infNFe")[0];
  if (!infNFe) {
    throw new Error("Arquivo inválido: Tag <infNFe> não encontrada.");
  }

  // Dados do Emitente
  const emit = xmlDoc.getElementsByTagName("emit")[0];
  const emitente = {
    cnpj: getTagValue(emit, "CNPJ"),
    nome: getTagValue(emit, "xNome"),
    fantasia: getTagValue(emit, "xFant"),
  };

  // Dados Gerais
  const ide = xmlDoc.getElementsByTagName("ide")[0];
  const dadosGerais = {
    chave: infNFe.getAttribute("Id")?.replace("NFe", "") || "",
    numero: getTagValue(ide, "nNF"),
    serie: getTagValue(ide, "serie"),
  };

  // Itens (Produtos)
  const detList = xmlDoc.getElementsByTagName("det");
  const itens: NFeItem[] = [];

  for (let i = 0; i < detList.length; i++) {
    const det = detList[i];
    const prod = det.getElementsByTagName("prod")[0];
    const nItem = parseInt(det.getAttribute("nItem") || "0");

    // Extração Bruta
    const codigoProduto = getTagValue(prod, "cProd");
    const nome = getTagValue(prod, "xProd");
    const ncm = getTagValue(prod, "NCM");
    const cest = getTagValue(prod, "CEST");
    const cfop = getTagValue(prod, "CFOP");
    const uCom = getTagValue(prod, "uCom");
    const qCom = parseFloat(getTagValue(prod, "qCom"));
    const vUnCom = parseFloat(getTagValue(prod, "vUnCom"));
    const uTrib = getTagValue(prod, "uTrib");
    const qTrib = parseFloat(getTagValue(prod, "qTrib"));
    const vProd = parseFloat(getTagValue(prod, "vProd"));

    let cEAN = getTagValue(prod, "cEAN");
    if (cEAN === "SEM GTIN") cEAN = "";

    let cEANTrib = getTagValue(prod, "cEANTrib");
    if (cEANTrib === "SEM GTIN") cEANTrib = "";

    // Lógica de Conversão (CX -> UN)
    // Se qTrib > qCom, provavelmente comprou Caixa e vende Unidade
    let fator = 1;
    if (qTrib && qCom && qTrib !== qCom) {
      fator = qTrib / qCom;
    }

    // Heurística de Grupo Tributário
    let perfil: "revenda" | "uso_interno" | "insumo" = "revenda";
    const nomeLower = nome.toLowerCase();

    // Palavras-chave para uso interno
    if (
      nomeLower.includes("uso e consumo") ||
      nomeLower.includes("material de limpeza") ||
      nomeLower.includes("papel toalha") ||
      cfop === "5556" ||
      cfop === "6556" // Compra para uso/consumo
    ) {
      perfil = "uso_interno";
    }

    // Palavras-chave para insumo (Exemplo simples)
    if (cfop === "5101" || cfop === "6101") {
      // Compra para industrialização
      // (Aqui poderia refinar mais, mas vamos manter simples)
    }

    itens.push({
      index: nItem,
      codigoProduto,
      nome,
      ncm,
      cest,
      cfop,
      unidadeComercial: uCom,
      quantidadeComercial: qCom,
      valorUnitarioComercial: vUnCom,
      unidadeTributavel: uTrib,
      quantidadeTributavel: qTrib,
      eanComercial: cEAN,
      eanTributavel: cEANTrib,
      valorTotal: vProd,
      fatorConversao: fator,
      sugerido: {
        nome: nome, // Pode limpar o nome aqui se quiser (tirar espaços extras)
        unidade: fator > 1 ? uTrib : uCom, // Prefere a unidade fracionada se houver conversão
        precoCusto: vUnCom / fator, // Custo unitário real
        estoque: qTrib, // Estoque entra na menor unidade
        grupoTributario: perfil,
      },
    });
  }

  return {
    ...dadosGerais,
    emitente,
    itens,
  };
}
