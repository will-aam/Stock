"use client";

import { DashboardHeader } from "@/components/home/dashboard-header";
import { BrandsManager } from "@/components/cadastros/brands-manager";
import { CategoriesManager } from "@/components/cadastros/categories-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tag, FolderTree } from "lucide-react";

export default function ClassificacaoPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-5xl space-y-6 p-4 md:py-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Classificação & Atributos
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie as tabelas auxiliares (Marcas, Categorias) que organizam
            seu catálogo.
          </p>
        </div>

        <Separator />

        {/* Área de Gestão */}
        <Tabs defaultValue="marcas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="marcas" className="flex gap-2">
              <Tag className="h-4 w-4" /> Marcas
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex gap-2">
              <FolderTree className="h-4 w-4" /> Categorias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marcas" className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg border border-l-4 border-l-primary/50">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" /> Gestão de Marcas
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre os fabricantes ou marcas dos produtos (ex: Coca-Cola,
                Nestlé).
              </p>
            </div>
            <BrandsManager />
          </TabsContent>

          <TabsContent value="categorias" className="space-y-4">
            <CategoriesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
