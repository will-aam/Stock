import { z } from 'zod';

declare enum ProductUnit {
    UN = "UN",
    KG = "KG",
    LT = "LT",
    CX = "CX",
    FD = "FD",
    M = "M",
    M2 = "M2"
}
interface Product {
    id: string;
    name: string;
    gtin: string;
    ncm: string;
    unit: ProductUnit;
    description?: string;
    categoryId?: string;
}

type PermissionString = string;
interface Role {
    id: string;
    name: string;
    permissions: PermissionString[];
    inheritsFrom?: string[];
}
interface UserSession {
    id: string;
    name: string;
    roles: string[];
    permissions: PermissionString[];
}
declare const hasPermission: (userPermissions: string[], required: string) => boolean;
declare const hasAnyPermission: (userPermissions: string[], required: string[]) => boolean;
declare const hasAllPermissions: (userPermissions: string[], required: string[]) => boolean;
declare const PERMISSIONS: {
    readonly PRODUCTS: {
        readonly READ: "products:read";
        readonly WRITE: "products:write";
        readonly DELETE: "products:delete";
    };
    readonly COMPANIES: {
        readonly READ: "companies:read";
        readonly manage: "companies:manage";
    };
};

declare const ProductSchema: z.ZodObject<{
    name: z.ZodString;
    gtin: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    ncm: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    unit: z.ZodNativeEnum<typeof ProductUnit>;
    price_cost: z.ZodOptional<z.ZodNumber>;
    price_sell: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    gtin: string;
    ncm: string;
    unit: ProductUnit;
    price_cost?: number | undefined;
    price_sell?: number | undefined;
}, {
    name: string;
    gtin: string;
    ncm: string;
    unit: ProductUnit;
    price_cost?: number | undefined;
    price_sell?: number | undefined;
}>;
type ProductFormValues = z.infer<typeof ProductSchema>;

declare const normalizeNumeric: (value: string) => string;
declare const formatGTIN: (value: string) => string;
declare const formatNCM: (value: string) => string;
declare const formatCNPJ: (value: string) => string;

export { PERMISSIONS, type PermissionString, type Product, type ProductFormValues, ProductSchema, ProductUnit, type Role, type UserSession, formatCNPJ, formatGTIN, formatNCM, hasAllPermissions, hasAnyPermission, hasPermission, normalizeNumeric };
