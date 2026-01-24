"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { BrandsManager } from "@/components/cadastros/brands-manager";
import { CategoriesManager } from "@/components/cadastros/categories-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, FolderTree, Layers } from "lucide-react";

export default function AuxiliaresPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-5xl space-y-6 p-4 md:py-8">
        {/* Cabeçalho com Voltar */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Cadastros Auxiliares
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie as tabelas de apoio que estruturam o catálogo de
              produtos.
            </p>
          </div>
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
            {/* Futuro: <TabsTrigger value="grupos">Grupos Tributários</TabsTrigger> */}
          </TabsList>

          <TabsContent value="marcas" className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg border border-l-4 border-l-primary/50">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" /> Gestão de Marcas
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre os fabricantes ou marcas dos produtos (ex: Coca-Cola,
                Nestlé, Samsung).
              </p>
            </div>
            <BrandsManager />
          </TabsContent>

          <TabsContent value="categorias" className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg border border-l-4 border-l-blue-500/50">
              <h3 className="font-semibold flex items-center gap-2">
                <FolderTree className="h-4 w-4" /> Árvore de Categorias
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Organize seus produtos em departamentos e famílias para
                facilitar relatórios e filtros.
              </p>
            </div>
            <CategoriesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
