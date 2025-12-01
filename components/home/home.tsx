"use client";

import React from "react"; // useState não é mais necessário
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Factory,
  ScanBarcode,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Clock,
  Search,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Separator e Sheet não são mais necessários
// import { Separator } from "@/components/ui/separator";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Tipagem dos dados (sem alterações)
interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface Module {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  theme: string;
  badge?: string;
}

interface Activity {
  user: string;
  action: string;
  time: string;
  type: "info" | "success" | "warning";
}

// Componente para os cards de estatísticas (sem alterações)
const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {stat.label}
        </p>
        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
        <stat.icon size={24} />
      </div>
    </CardContent>
  </Card>
);

// Componente para os cards de módulos (sem alterações)
const ModuleCard: React.FC<{ module: Module }> = ({ module }) => (
  <Card className="group hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer relative overflow-hidden">
    <CardContent className="p-6">
      {/* Decorative Background Blur */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-${module.theme}-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}
      ></div>

      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-3 rounded-xl bg-${module.theme}-100 text-${module.theme}-600`}
          >
            <module.icon size={32} />
          </div>
          {module.badge && (
            <Badge
              variant="secondary"
              className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded shadow-sm"
            >
              {module.badge}
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {module.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {module.desc}
        </p>

        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          Acessar Módulo &rarr;
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente para a tabela de atividades (sem alterações)
const ActivityTable: React.FC<{ activities: Activity[] }> = ({
  activities,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-muted-foreground" />
        <CardTitle>Atividade Recente do Sistema</CardTitle>
      </div>
      <Button variant="link" className="text-sm p-0 h-auto">
        Ver tudo
      </Button>
    </CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{activity.user}</TableCell>
              <TableCell>{activity.action}</TableCell>
              <TableCell className="text-muted-foreground">
                {activity.time}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    activity.type === "info"
                      ? "default"
                      : activity.type === "success"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    activity.type === "info"
                      ? "bg-blue-100 text-blue-800"
                      : activity.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {activity.type === "info"
                    ? "Em andamento"
                    : activity.type === "success"
                    ? "Concluído"
                    : "Atenção"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// O componente Sidebar foi removido daqui.

// Componente principal
export function Home() {
  // Estados e lógica do sidebar foram removidos
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [activeModule, setActiveModule] = useState("dashboard");

  // Dados Mockados para o Dashboard (sem alterações)
  const stats: Stat[] = [
    {
      label: "Empresas Cadastradas",
      value: "05",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total de Itens (SKU)",
      value: "12.450",
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Requisições Pendentes",
      value: "18",
      icon: ClipboardList,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Eficiência da Linha",
      value: "94%",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // Definição dos Módulos do Sistema (sem alterações)
  const modules: Module[] = [
    {
      id: "req",
      title: "Ordi - Requisição de Materiais",
      desc: "Gestão de requisições de materiais para o setor.",
      icon: ClipboardList,
      theme: "blue",
    },
    {
      id: "prod",
      title: "Linha de Produção",
      desc: "Gestão de ordens de produção e status de maquinário.",
      icon: Factory,
      theme: "indigo",
    },
    {
      id: "count",
      title: "Coletor Digital (WMS)",
      desc: "Substitui o coletor Zebra. Contagem e conferência via câmera.",
      icon: ScanBarcode,
      theme: "orange",
      badge: "Mobile",
    },
    {
      id: "stock",
      title: "Gestão de Estoque",
      desc: "Cadastro de produtos, SKUs e inventário geral.",
      icon: Package,
      theme: "emerald",
    },
    {
      id: "partners",
      title: "Empresas & Fornecedores",
      desc: "Gerenciamento de multi-empresas e parceiros.",
      icon: Building2,
      theme: "slate",
    },
    {
      id: "users",
      title: "Gestão de Usuários",
      desc: "Permissões de acesso e cadastro de operadores.",
      icon: Users,
      theme: "slate",
    },
  ];

  const recentActivity: Activity[] = [
    {
      user: "Carlos Silva",
      action: "Iniciou contagem no Setor B",
      time: "10 min atrás",
      type: "info",
    },
    {
      user: "Ana Souza",
      action: "Aprovou Requisição #4029",
      time: "25 min atrás",
      type: "success",
    },
    {
      user: "Sistema",
      action: "Alerta de estoque baixo: Parafuso M4",
      time: "1 hora atrás",
      type: "warning",
    },
  ];

  return (
    // O layout principal foi simplificado, removendo a estrutura de flexbox do sidebar
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">Bem-vindo ao Hub de Operações</h1>
        <p className="text-muted-foreground">
          Selecione um módulo abaixo ou verifique os indicadores de hoje.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Main Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <LayoutDashboard size={20} className="text-muted-foreground" />
            Módulos Disponíveis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>

      {/* Bottom Section: Recent Activity Table */}
      <ActivityTable activities={recentActivity} />
    </div>
  );
}
