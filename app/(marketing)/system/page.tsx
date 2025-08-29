"use client";

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
  FileText,
  Crown,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function SystemShowcasePage() {
  const modules = [
    {
      id: "inventory-query",
      title: "Contagem por Consulta",
      description: "Escaneie códigos de barras e conte produtos em tempo real",
      icon: Scan,
      features: [
        "Scanner de código de barras",
        "Contagem em tempo real",
        "Interface mobile otimizada",
        "Cadastro rápido de produtos",
      ],
      premium: false,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "item-requisition",
      title: "Requisição de Itens",
      description: "Gerencie solicitações e movimentações de produtos",
      icon: FileText,
      features: [
        "Solicitações de produtos",
        "Controle de aprovações",
        "Histórico de movimentações",
        "Notificações automáticas",
      ],
      premium: false,
      color: "from-green-500 to-green-600",
    },
    {
      id: "inventory-import",
      title: "Contagem por Importação",
      description: "Importe dados de estoque via CSV e planilhas",
      icon: Upload,
      features: [
        "Importação CSV avançada",
        "Validação automática de dados",
        "Mapeamento de campos",
        "Relatórios de importação",
      ],
      premium: true,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "production-orders",
      title: "Pedidos de Linha de Produção",
      description: "Controle pedidos e planejamento de produção",
      icon: Package,
      features: [
        "Planejamento de produção",
        "Controle de materiais",
        "Cronograma de entregas",
        "Análise de capacidade",
      ],
      premium: true,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Módulos do Sistema Stock
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça todos os módulos disponíveis no Stock. Comece com os módulos
            gratuitos e faça upgrade para acessar recursos premium.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  module.premium ? "border-amber-200 dark:border-amber-800" : ""
                }`}
              >
                {/* Premium Badge */}
                {module.premium && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}

                {/* Header with gradient background */}
                <div
                  className={`bg-gradient-to-r ${module.color} p-6 text-white`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-white/80 mt-1">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {module.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  {module.premium ? (
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    >
                      <Link href="/register">
                        <Crown className="h-4 w-4 mr-2" />
                        Fazer Upgrade
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <Link href="/register">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Acessar Gratuitamente
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Free vs Premium Comparison */}
        <div className="bg-muted/50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Gratuito vs Premium</h2>
            <p className="text-muted-foreground">
              Compare os recursos disponíveis em cada plano
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Plano Gratuito</CardTitle>
                <CardDescription>Perfeito para começar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Contagem por Consulta</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Requisição de Itens</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Scanner de código de barras</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Interface mobile otimizada</span>
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full mt-6 bg-transparent"
                  variant="outline"
                >
                  <Link href="/register">Começar Gratuitamente</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center bg-primary/5">
                <CardTitle className="text-xl flex items-center justify-center">
                  <Crown className="h-5 w-5 mr-2 text-amber-500" />
                  Plano Premium
                </CardTitle>
                <CardDescription>Recursos avançados</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Todos os recursos gratuitos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Contagem por Importação</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Pedidos de Linha de Produção</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link href="/register">
                    <Crown className="h-4 w-4 mr-2" />
                    Assinar Premium
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-8">
            Crie sua conta gratuita e comece a usar o Stock hoje mesmo
          </p>
          <Button asChild size="lg" className="px-8 py-3">
            <Link href="/register">
              <Package className="h-5 w-5 mr-2" />
              Criar Conta Gratuita
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
