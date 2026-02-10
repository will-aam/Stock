// String alias para deixar explícito
export type PermissionString = string; // Ex: 'products:read'

export interface Role {
  id: string;
  name: string;
  permissions: PermissionString[];
  inheritsFrom?: string[]; // IDs de roles que este herda
}

export interface UserSession {
  id: string;
  name: string;
  roles: string[];
  permissions: PermissionString[]; // Flattened permissions
}

// Helpers Puros
export const hasPermission = (
  userPermissions: string[],
  required: string,
): boolean => {
  return userPermissions.includes(required);
};

export const hasAnyPermission = (
  userPermissions: string[],
  required: string[],
): boolean => {
  return required.some((p) => userPermissions.includes(p));
};

export const hasAllPermissions = (
  userPermissions: string[],
  required: string[],
): boolean => {
  return required.every((p) => userPermissions.includes(p));
};

// Constantes de Permissão (Para evitar magic strings no front)
export const PERMISSIONS = {
  PRODUCTS: {
    READ: "products:read",
    WRITE: "products:write",
    DELETE: "products:delete",
  },
  COMPANIES: {
    READ: "companies:read",
    manage: "companies:manage",
  },
  // ... expandir conforme necessário
} as const;
