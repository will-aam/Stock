// Dashboard dos sistemas
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Scan,
  Upload,
  ClipboardList,
  Factory,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3,
  Search,
  ShoppingCart,
} from "lucide-react";

export default function SystemsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const systems = [
    {
      id: "inventory-import",
      title: "Contagem por Importação",
      description:
        "Importe planilhas e realize contagens em massa de forma automatizada",
      icon: Upload,
      color: "from-blue-500 to-blue-600",
      bgColor:
        "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      features: [
        "Importação de arquivos CSV/Excel",
        "Validação automática de dados",
        "Processamento em lote",
        "Relatórios de importação",
        "Histórico de operações",
      ],
      href: "/inventory-import",
      status: "Disponível",
    },
    {
      id: "inventory-query",
      title: "Contagem por Consulta",
      description:
        "Sistema de bipagem e contagem em tempo real com scanner integrado",
      icon: Scan,
      color: "from-green-500 to-green-600",
      bgColor:
        "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      features: [
        "Scanner de código de barras",
        "Contagem em tempo real",
        "Interface mobile otimizada",
        "Validação instantânea",
        "Sincronização automática",
      ],
      href: "/inventory-query",
      status: "Disponível",
    },
    {
      id: "item-requisition",
      title: "Requisição de Itens",
      description: "Gerencie solicitações e aprovações de itens do estoque",
      icon: ClipboardList,
      color: "from-purple-500 to-purple-600",
      bgColor:
        "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      features: [
        "Solicitações estruturadas",
        "Fluxo de aprovação",
        "Controle de permissões",
        "Histórico de requisições",
        "Notificações automáticas",
      ],
      href: "/item-requisition",
      status: "Disponível",
    },
    {
      id: "production-orders",
      title: "Pedidos de Produção",
      description: "Controle completo dos pedidos da linha de produção",
      icon: Factory,
      color: "from-orange-500 to-orange-600",
      bgColor:
        "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      features: [
        "Gestão de ordens de produção",
        "Controle de materiais",
        "Acompanhamento em tempo real",
        "Relatórios de produtividade",
        "Integração com estoque",
      ],
      href: "/production-orders",
      status: "Disponível",
    },
  ];

  const quickStats = [
    {
      title: "Sistemas Ativos",
      value: "4",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Acesso Liberado",
      value: "100%",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Relatórios",
      value: "15+",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Integrações",
      value: "8",
      icon: ArrowRight,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div
              className={`text-center mb-12 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex justify-center mb-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sistemas Stock
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Central de Sistemas
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Acesse todos os módulos do sistema Stock. Cada ferramenta foi
                desenvolvida para otimizar diferentes aspectos da gestão de
                estoque e produção.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-4">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.title}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Systems Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Módulos Disponíveis
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Escolha o sistema que melhor atende sua necessidade atual. Todos
                os módulos estão liberados para uso completo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {systems.map((system, index) => {
                const Icon = system.icon;
                return (
                  <Card
                    key={system.id}
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {system.status}
                      </Badge>
                    </div>

                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${system.bgColor} opacity-50 group-hover:opacity-70 transition-opacity`}
                    />

                    <CardHeader className="relative z-10 pb-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${system.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {system.title}
                      </CardTitle>

                      <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                        {system.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10 space-y-6">
                      {/* Features List */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Principais Recursos:
                        </h4>
                        <ul className="space-y-2">
                          {system.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <Button
                        asChild
                        className={`w-full bg-gradient-to-r ${system.color} hover:opacity-90 text-white py-3 text-lg group-hover:scale-105 transition-transform`}
                      >
                        <Link href={system.href}>
                          Acessar Sistema
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Recursos Integrados
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Todos os sistemas compartilham recursos avançados para uma
                experiência unificada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Relatórios Unificados
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Visualize dados de todos os sistemas em relatórios
                    consolidados e dashboards interativos
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Busca Global
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Encontre informações em qualquer sistema através de uma
                    busca unificada e inteligente
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Integração Total
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Dados sincronizados entre todos os módulos para uma gestão
                    completa e eficiente
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para Começar?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Todos os sistemas estão liberados e prontos para uso. Escolha o
                módulo que melhor atende sua necessidade atual.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="px-8 py-3 text-lg"
                >
                  <Link href="/inventory-query">
                    <Scan className="h-5 w-5 mr-2" />
                    Começar com Scanner
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  <Link href="/inventory-import">
                    <Upload className="h-5 w-5 mr-2" />
                    Importar Planilha
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
