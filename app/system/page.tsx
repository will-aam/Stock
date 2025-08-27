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
  Upload,
  Scan,
  FileText,
  Settings,
  Crown,
  Sparkles,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import PremiumUpgradeModal from "@/components/modules/premium/premium-upgrade-modal";

export default function SystemsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalFeature, setPremiumModalFeature] = useState<string>("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const systems = [
    {
      id: "inventory-import",
      title: "Contagem por Importação",
      description:
        "Importe produtos em massa via arquivo CSV e realize contagens automatizadas",
      icon: Upload,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/10",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      status: "Premium",
      premium: true,
      features: [
        "Importação CSV em massa",
        "Validação automática de dados",
        "Relatórios de importação",
        "Histórico de uploads",
      ],
      stats: { items: "10K+", accuracy: "99.8%", time: "5min" },
    },
    {
      id: "inventory-query",
      title: "Contagem por Consulta",
      description:
        "Escaneie códigos de barras e realize contagens em tempo real",
      icon: Scan,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      borderColor: "border-blue-200 dark:border-blue-800",
      status: "Disponível",
      premium: false,
      features: [
        "Scanner de código de barras",
        "Contagem em tempo real",
        "Interface mobile otimizada",
        "Cadastro rápido de produtos",
      ],
      stats: { items: "Ilimitado", accuracy: "100%", time: "Instantâneo" },
    },
    {
      id: "item-requisition",
      title: "Requisição de Itens",
      description: "Gerencie solicitações e aprovações de itens do estoque",
      icon: FileText,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/10",
      borderColor: "border-cyan-200 dark:border-cyan-800",
      status: "Disponível",
      premium: false,
      features: [
        "Solicitações de itens",
        "Fluxo de aprovação",
        "Controle de permissões",
        "Notificações automáticas",
      ],
      stats: { requests: "500+", approval: "2min", tracking: "100%" },
    },
    {
      id: "production-orders",
      title: "Pedidos de Produção",
      description: "Controle pedidos da linha de produção e matérias-primas",
      icon: Settings,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
      borderColor: "border-purple-200 dark:border-purple-800",
      status: "Premium",
      premium: true,
      features: [
        "Gestão de pedidos",
        "Controle de matéria-prima",
        "Planejamento de produção",
        "Relatórios de eficiência",
      ],
      stats: { orders: "1K+", efficiency: "95%", time: "Real-time" },
    },
  ];

  const handlePremiumUpgrade = (feature: string) => {
    setPremiumModalFeature(feature);
    setShowPremiumModal(true);
  };

  const handleSystemAccess = (system: any) => {
    if (system.premium) {
      handlePremiumUpgrade(system.id);
    } else {
      // Navegar para o sistema
      window.location.href = `/system/${system.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex justify-center mb-8">
              <Badge className="bg-blue-600 text-white border-0 px-6 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Central de Sistemas Stock
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Escolha seu Sistema
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Acesse todos os módulos do Stock em um só lugar. Cada sistema foi
              desenvolvido para otimizar uma área específica da sua gestão de
              inventário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <Card className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Sistemas Disponíveis
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-cyan-600">2</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Sistemas Gratuitos
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-amber-600">2</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Sistemas Premium
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Disponibilidade
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {systems.map((system, index) => {
              const Icon = system.icon;
              return (
                <Card
                  key={system.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border ${
                    system.premium
                      ? "border-amber-200 dark:border-amber-800"
                      : system.borderColor
                  }`}
                >
                  {system.premium && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-500 text-white border-0">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 rounded-lg ${system.bgColor} flex items-center justify-center mb-4`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${system.color} flex items-center justify-center`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {system.title}
                      </CardTitle>
                      <Badge
                        variant={system.premium ? "secondary" : "default"}
                        className={
                          system.premium
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }
                      >
                        {system.status}
                      </Badge>
                    </div>

                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {system.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Recursos Principais:
                      </h4>
                      <ul className="space-y-2">
                        {system.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${system.color} flex items-center justify-center mr-3`}
                            >
                              <CheckCircle className="h-2.5 w-2.5 text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                      {Object.entries(system.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div
                            className={`text-lg font-bold ${system.textColor}`}
                          >
                            {value}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleSystemAccess(system)}
                      className={`w-full font-medium text-white transition-colors duration-300 ${
                        system.premium
                          ? "bg-amber-500 hover:bg-amber-600"
                          : `${system.color} ${system.hoverColor}`
                      }`}
                    >
                      {system.premium ? (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Fazer Upgrade
                        </>
                      ) : (
                        <>
                          Acessar Sistema
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-amber-600 mb-4">
                Desbloqueie Todo o Potencial do Stock
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Com o plano Premium, você tem acesso a todos os sistemas
                avançados, relatórios detalhados, backup na nuvem e muito mais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handlePremiumUpgrade("all-systems")}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Fazer Upgrade Premium
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="px-8 py-2 bg-transparent"
                >
                  <Link href="/about">
                    Comparar Planos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumUpgradeModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          feature={premiumModalFeature}
        />
      )}
    </div>
  );
}
