"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Scan, Upload, FileText, Crown, Lock, ArrowRight, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string>("")

  const modules = [
    {
      id: "inventory-query",
      title: "Contagem por Consulta",
      description: "Escaneie códigos de barras e conte produtos em tempo real",
      icon: Scan,
      href: "/inventory-query",
      premium: false,
      color: "from-blue-500 to-blue-600",
      features: ["Scanner de código de barras", "Contagem em tempo real", "Interface mobile otimizada"],
    },
    {
      id: "item-requisition",
      title: "Requisição de Itens",
      description: "Gerencie solicitações e movimentações de produtos",
      icon: FileText,
      href: "/item-requisition",
      premium: false,
      color: "from-green-500 to-green-600",
      features: ["Solicitações de produtos", "Controle de aprovações", "Histórico de movimentações"],
    },
    {
      id: "inventory-import",
      title: "Contagem por Importação",
      description: "Importe dados de estoque via CSV e planilhas",
      icon: Upload,
      href: "/inventory-import",
      premium: true,
      color: "from-purple-500 to-purple-600",
      features: ["Importação CSV avançada", "Validação automática", "Mapeamento de campos"],
    },
    {
      id: "production-orders",
      title: "Pedidos de Linha de Produção",
      description: "Controle pedidos e planejamento de produção",
      icon: Package,
      href: "/production-orders",
      premium: true,
      color: "from-orange-500 to-orange-600",
      features: ["Planejamento de produção", "Controle de materiais", "Cronograma de entregas"],
    },
  ]

  const handleModuleClick = (module: any) => {
    if (module.premium) {
      setSelectedModule(module.title)
      setPremiumModalOpen(true)
    }
  }

  const stats = [
    { name: "Produtos Cadastrados", value: "1,234", change: "+12%", changeType: "positive" },
    { name: "Contagens Realizadas", value: "89", change: "+23%", changeType: "positive" },
    { name: "Requisições Pendentes", value: "12", change: "-8%", changeType: "negative" },
    { name: "Última Sincronização", value: "2 min", change: "Agora", changeType: "neutral" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo ao Stock! Gerencie seu inventário de forma inteligente e eficiente.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Card
                key={module.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  module.premium ? "border-amber-200 dark:border-amber-800" : ""
                }`}
                onClick={() => handleModuleClick(module)}
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
                <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                      {module.premium && <Lock className="h-3 w-3 absolute top-1 right-1" />}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{module.title}</CardTitle>
                      <CardDescription className="text-white/80 mt-1">{module.description}</CardDescription>
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
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                      <Lock className="h-4 w-4 mr-2" />
                      Fazer Upgrade
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={module.href}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Acessar Módulo
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Premium Modal */}
      <Dialog open={premiumModalOpen} onOpenChange={setPremiumModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span>Recurso Premium</span>
            </DialogTitle>
            <DialogDescription>O módulo "{selectedModule}" está disponível apenas no plano Premium.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Desbloqueie recursos avançados:</h4>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• Importação avançada de dados</li>
                <li>• Relatórios personalizados</li>
                <li>• Sincronização em tempo real</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setPremiumModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
