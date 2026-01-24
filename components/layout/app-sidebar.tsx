"use client";

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
import {
  Home,
  ClipboardCheck,
  User,
  LogOut,
  Building2,
  Tag,
  ChevronRight,
  Users,
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

  const mainItems = [{ title: "Início", url: "/dashboard", icon: Home }];
  const orderSystemItems = [
    { title: "Ordi ", url: "/ordi", icon: ClipboardCheck },
  ];

  // Itens simples de configuração
  const configItems = [
    { title: "Meu Perfil", url: "/perfil", icon: User },
    { title: "Empresas", url: "/empresas", icon: Building2 },
    { title: "Usuários", url: "/usuarios", icon: Users },
  ];

  // SUBITENS DE PRODUTOS (Atualizado com a nova estrutura)
  const productSubItems = [
    { title: "Listagem Geral", url: "/produtos" },
    { title: "Classificação", url: "/produtos/classificacao" }, // Marcas, Categorias
    { title: "Fiscal & Tributário", url: "/produtos/fiscal" }, // Grupos Trib, NCM, Origem
    { title: "Unidades & Medidas", url: "/produtos/unidades" }, // UN, Pesos
    // Futuro: { title: "Tabelas de Preço", url: "/produtos/tabelas-preco" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            Stock System (HUB)
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operacional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* sistema de pedidos - ordi */}
              {orderSystemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 1. ITENS SIMPLES */}
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 2. ITEM COLAPSÁVEL (Produtos Expandido) */}
              <Collapsible
                asChild
                defaultOpen={pathname.startsWith("/produtos")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Produtos">
                      <Tag />
                      <span>Produtos</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {productSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 group-data-[collapsible=icon]:p-0">
          <div className="flex items-center gap-2 rounded-lg border p-2 bg-card text-card-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="/placeholder-user.jpg" alt="Usuário" />
              <AvatarFallback className="rounded-lg">US</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">Will</span>
              <span className="truncate text-xs">will@exemplo.com</span>
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
