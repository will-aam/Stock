import { z } from "zod";
import { ProductUnit } from "../domain/product";
import { normalizeNumeric } from "../utils/formatters";

export const ProductSchema = z.object({
  name: z.string().min(3, "Nome muito curto").max(120, "Nome muito longo"),

  gtin: z
    .string()
    .transform(normalizeNumeric) // Normaliza antes de validar
    .refine((val) => [8, 12, 13, 14].includes(val.length), {
      message: "GTIN inválido (esperado 8, 12, 13 ou 14 dígitos)",
    }),

  ncm: z
    .string()
    .transform(normalizeNumeric)
    .refine((val) => val.length === 8, {
      message: "NCM deve ter exatamente 8 dígitos",
    }),

  unit: z.nativeEnum(ProductUnit, {
    errorMap: () => ({ message: "Unidade inválida" }),
  }),

  price_cost: z.number().min(0).optional(),
  price_sell: z.number().min(0).optional(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
// Cria um schema só com os campos desta tela
const Step1Schema = ProductSchema.pick({
  name: true,
  gtin: true,
  ncm: true,
  unit: true,
});

type Step1Values = z.infer<typeof Step1Schema>;
