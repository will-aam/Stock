"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  LogOut,
  Building2,
  Tag,
  ChevronRight,
  Users,
  ShoppingBag,
  ShoppingCart,
  Package,
  Banknote,
  BarChart3,
  Globe,
  Settings,
  Grid,
  Contact,
  Layers,
  Puzzle,
  Blocks,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
  const pathname = usePathname();
  // Estado para controlar qual menu está aberto (Accordion Logic)
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  // Sincroniza o menu aberto com a URL atual ao carregar ou navegar
  React.useEffect(() => {
    if (
      pathname.startsWith("/ordi") ||
      pathname.startsWith("/modulos") ||
      pathname.startsWith("/stock") ||
      pathname.startsWith("/val") ||
      pathname.startsWith("/rikko") ||
      pathname.startsWith("/countifly")
    ) {
      setOpenItem("Módulos");
    } else if (pathname.startsWith("/vendas")) {
      setOpenItem("Vendas");
    } else if (pathname.startsWith("/compras")) {
      setOpenItem("Compras & Entrada");
    } else if (pathname.startsWith("/estoque")) {
      setOpenItem("Estoque");
    } else if (pathname.startsWith("/produtos")) {
      setOpenItem("Produtos");
    } else if (pathname.startsWith("/parceiros")) {
      setOpenItem("Parceiros");
    } else if (pathname.startsWith("/financeiro")) {
      setOpenItem("Financeiro");
    } else if (pathname.startsWith("/configuracoes")) {
      setOpenItem("Configurações");
    }
  }, [pathname]);

  // Função para gerenciar a abertura exclusiva (abre um, fecha os outros)
  const handleOpenChange = (title: string, isOpen: boolean) => {
    setOpenItem(isOpen ? title : null);
  };

  // --- SUB-MENUS ---

  // Módulos (Novos Sistemas) - Reordenados com sistemas ativos primeiro
  const modulesItems = [
    // Sistemas ativos (acessíveis)
    { title: "Ordi", url: "/ordi", disabled: false },
    { title: "Val", url: "/val", disabled: false },
    { title: "Rikko", url: "/rikko", disabled: false },
    // Sistemas inativos (bloqueados)
    { title: "Brutos", url: "#", disabled: true },
    { title: "Countifly", url: "#", disabled: true },
  ];

  const salesItems = [
    { title: "PDV / Frente de Caixa", url: "/vendas/pdv" },
    { title: "Pedidos de Venda", url: "/vendas/pedidos" },
    { title: "Notas Fiscais", url: "/vendas/notas" },
    { title: "Histórico", url: "/vendas/historico" },
  ];

  const purchaseItems = [
    { title: "Entrada de Notas (XML)", url: "/compras/entrada" },
    { title: "Manifesto Destinatário", url: "/compras/manifesto" },
    { title: "Pedidos de Compra", url: "/compras/pedidos" },
  ];

  const inventoryItems = [
    { title: "Movimentação Manual", url: "/estoque/movimentacao" },
    { title: "Inventário (Balanço)", url: "/estoque/inventario" },
    { title: "Etiquetas", url: "/estoque/etiquetas" },
    { title: "Trocas & Devoluções", url: "/estoque/trocas" },
  ];

  const productSubItems = [
    { title: "Listagem Geral", url: "/produtos" },
    { title: "Classificação", url: "/produtos/classificacao" },
    { title: "Fiscal & Tributário", url: "/produtos/fiscal" },
    { title: "Unidades & Medidas", url: "/produtos/unidades" },
  ];

  const partnerItems = [
    { title: "Clientes", url: "/parceiros/clientes" },
    { title: "Fornecedores", url: "/parceiros/fornecedores" },
    { title: "Transportadoras", url: "/parceiros/transportadoras" },
  ];

  const financialItems = [
    { title: "Contas a Pagar", url: "/financeiro/pagar" },
    { title: "Contas a Receber", url: "/financeiro/receber" },
    { title: "Fluxo de Caixa", url: "/financeiro/fluxo" },
    { title: "Bancos", url: "/financeiro/bancos" },
  ];

  const settingsItems = [
    { title: "Configurações Gerais", url: "/configuracoes" },
    { title: "Backup & Dados", url: "/configuracoes/dados" },
  ];

  // Helper para renderizar Menus Colapsáveis Controlados
  const renderCollapsible = (
    title: string,
    icon: any,
    items: { title: string; url: string; disabled?: boolean }[],
  ) => (
    <Collapsible
      open={openItem === title}
      onOpenChange={(isOpen) => handleOpenChange(title, isOpen)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            {icon}
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                {subItem.disabled ? (
                  // ITEM DESATIVADO
                  <SidebarMenuSubButton className="text-muted-foreground pointer-events-none cursor-not-allowed">
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                ) : (
                  // ITEM ATIVO
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            Stock System (HUB)
          </span>
        </div>
      </SidebarHeader>
      {/* Scroll Oculto */}
      <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* 1. VISÃO GERAL */}
        <SidebarGroup>
          <SidebarGroupLabel>Visão Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard Direto */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Módulos (Acordeão) */}
              {renderCollapsible("Módulos", <Blocks />, modulesItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 2. ESTOQUE & OPERAÇÃO */}
        <SidebarGroup>
          <SidebarGroupLabel>Estoque</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderCollapsible("Produtos", <Tag />, productSubItems)}
              {renderCollapsible(
                "Compras & Entrada",
                <ShoppingCart />,
                purchaseItems,
              )}
              {renderCollapsible("Estoque", <Package />, inventoryItems)}
              {renderCollapsible("Vendas", <ShoppingBag />, salesItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 3. PARCEIROS & ACESSO */}
        <SidebarGroup>
          <SidebarGroupLabel>Parceiros & Acesso</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderCollapsible("Parceiros", <Contact />, partnerItems)}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/empresas"}
                  tooltip="Empresas"
                >
                  <Link href="/empresas">
                    <Building2 />
                    <span>Empresas (Lojas)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/usuarios"}
                  tooltip="Usuários"
                >
                  <Link href="/usuarios">
                    <Users />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 4. RELATÓRIOS (Separado) */}
        <SidebarGroup>
          <SidebarGroupLabel>Análises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/relatorios"}
                  tooltip="Relatórios"
                >
                  <Link href="/relatorios">
                    <BarChart3 />
                    <span>Relatórios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 5. GESTÃO */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderCollapsible("Financeiro", <Banknote />, financialItems)}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/loja-virtual"}
                  tooltip="Loja Virtual"
                >
                  <Link href="/loja-virtual">
                    <Globe />
                    <span>Loja Virtual</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {renderCollapsible("Configurações", <Settings />, settingsItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <div className="p-2 group-data-[collapsible=icon]:p-0">
          <div className="flex items-center gap-2 rounded-lg border p-2 bg-card text-card-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="/placeholder-user.jpg" alt="Usuário" />
              <AvatarFallback className="rounded-lg">US</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">Admin</span>
              <span className="truncate text-xs">admin@stock.com</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto group-data-[collapsible=icon]:hidden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
