"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  PERMISSIONS: () => PERMISSIONS,
  ProductSchema: () => ProductSchema,
  ProductUnit: () => ProductUnit,
  formatCNPJ: () => formatCNPJ,
  formatGTIN: () => formatGTIN,
  formatNCM: () => formatNCM,
  hasAllPermissions: () => hasAllPermissions,
  hasAnyPermission: () => hasAnyPermission,
  hasPermission: () => hasPermission,
  normalizeNumeric: () => normalizeNumeric
});
module.exports = __toCommonJS(index_exports);

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
var import_zod = require("zod");

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
var ProductSchema = import_zod.z.object({
  name: import_zod.z.string().min(3, "Nome muito curto").max(120, "Nome muito longo"),
  gtin: import_zod.z.string().transform(normalizeNumeric).refine((val) => [8, 12, 13, 14].includes(val.length), {
    message: "GTIN inv\xE1lido (esperado 8, 12, 13 ou 14 d\xEDgitos)"
  }),
  ncm: import_zod.z.string().transform(normalizeNumeric).refine((val) => val.length === 8, {
    message: "NCM deve ter exatamente 8 d\xEDgitos"
  }),
  unit: import_zod.z.nativeEnum(ProductUnit, {
    errorMap: () => ({ message: "Unidade inv\xE1lida" })
  }),
  price_cost: import_zod.z.number().min(0).optional(),
  price_sell: import_zod.z.number().min(0).optional()
});
var Step1Schema = ProductSchema.pick({
  name: true,
  gtin: true,
  ncm: true,
  unit: true
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map