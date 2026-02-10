// src/domain/product.ts
var ProductUnit = /* @__PURE__ */ ((ProductUnit2) => {
  ProductUnit2["UN"] = "UN";
  ProductUnit2["KG"] = "KG";
  ProductUnit2["LT"] = "LT";
  ProductUnit2["CX"] = "CX";
  ProductUnit2["FD"] = "FD";
  ProductUnit2["M"] = "M";
  ProductUnit2["M2"] = "M2";
  return ProductUnit2;
})(ProductUnit || {});

// src/domain/auth.ts
var hasPermission = (userPermissions, required) => {
  return userPermissions.includes(required);
};
var hasAnyPermission = (userPermissions, required) => {
  return required.some((p) => userPermissions.includes(p));
};
var hasAllPermissions = (userPermissions, required) => {
  return required.every((p) => userPermissions.includes(p));
};
var PERMISSIONS = {
  PRODUCTS: {
    READ: "products:read",
    WRITE: "products:write",
    DELETE: "products:delete"
  },
  COMPANIES: {
    READ: "companies:read",
    manage: "companies:manage"
  }
  // ... expandir conforme necessário
};

// src/schemas/product.schema.ts
import { z } from "zod";

// src/utils/formatters.ts
var normalizeNumeric = (value) => {
  return value.replace(/\D/g, "");
};
var formatGTIN = (value) => {
  const numeric = normalizeNumeric(value);
  return numeric;
};
var formatNCM = (value) => {
  const v = normalizeNumeric(value);
  return v.replace(/^(\d{4})(\d{2})(\d{2}).*/, "$1.$2.$3");
};
var formatCNPJ = (value) => {
  const v = normalizeNumeric(value);
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5");
};

// src/schemas/product.schema.ts
var ProductSchema = z.object({
  name: z.string().min(3, "Nome muito curto").max(120, "Nome muito longo"),
  gtin: z.string().transform(normalizeNumeric).refine((val) => [8, 12, 13, 14].includes(val.length), {
    message: "GTIN inv\xE1lido (esperado 8, 12, 13 ou 14 d\xEDgitos)"
  }),
  ncm: z.string().transform(normalizeNumeric).refine((val) => val.length === 8, {
    message: "NCM deve ter exatamente 8 d\xEDgitos"
  }),
  unit: z.nativeEnum(ProductUnit, {
    errorMap: () => ({ message: "Unidade inv\xE1lida" })
  }),
  price_cost: z.number().min(0).optional(),
  price_sell: z.number().min(0).optional()
});
export {
  PERMISSIONS,
  ProductSchema,
  ProductUnit,
  formatCNPJ,
  formatGTIN,
  formatNCM,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  normalizeNumeric
};
//# sourceMappingURL=index.mjs.map