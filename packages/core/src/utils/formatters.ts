// Remove caracteres não numéricos (Normalização canônica)
export const normalizeNumeric = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Formatação para exibição (Display only)
export const formatGTIN = (value: string): string => {
  const numeric = normalizeNumeric(value);
  // Simples retorno visual ou lógica específica se quiser separar EAN-13
  return numeric;
};

export const formatNCM = (value: string): string => {
  const v = normalizeNumeric(value);
  return v.replace(/^(\d{4})(\d{2})(\d{2}).*/, "$1.$2.$3");
};

export const formatCNPJ = (value: string): string => {
  const v = normalizeNumeric(value);
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5");
};
