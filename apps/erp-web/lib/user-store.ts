// lib/user-store.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware"; // Opcional: para manter logado ao recarregar
import { Usuario } from "@/lib/mock/usuarios";

interface UserStore {
  usuarioLogado: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  // Helper para verificar permissão rápido
  hasPermission: (module: keyof Usuario["permissoes"]) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      usuarioLogado: null,

      login: (usuario) => set({ usuarioLogado: usuario }),

      logout: () => set({ usuarioLogado: null }),

      hasPermission: (module) => {
        const user = get().usuarioLogado;
        if (!user) return false;
        // Se for admin, tem acesso a tudo (opcional, ou segue a regra estrita)
        if (user.permissoes.admin) return true;
        return !!user.permissoes[module];
      },
    }),
    {
      name: "stock-user-storage", // nome da chave no localStorage
    },
  ),
);
