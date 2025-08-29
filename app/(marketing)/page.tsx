"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Scan,
  Upload,
  Download,
  History,
  BarChart3,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Smartphone,
  Cloud,
  FileSpreadsheet,
  Database,
  Settings,
  Crown,
  Sparkles,
} from "lucide-react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      category: "Conferência de Estoque",
      items: [
        {
          icon: Scan,
          title: "Scanner de Código de Barras",
          description: "Escaneie códigos de barras com a câmera do dispositivo",
        },
        {
          icon: Smartphone,
          title: "Interface Mobile Otimizada",
          description: "Design responsivo perfeito para tablets e smartphones",
        },
        {
          icon: Package,
          title: "Cadastro Rápido",
          description: "Registre produtos não encontrados instantaneamente",
        },
        {
          icon: Settings,
          title: "Múltiplos Locais",
          description: "Gerencie diferentes lojas e depósitos",
        },
      ],
    },
    {
      category: "Gestão de Dados",
      items: [
        {
          icon: Upload,
          title: "Importação CSV",
          description: "Importe produtos em massa via arquivo CSV",
        },
        {
          icon: Database,
          title: "Armazenamento Local",
          description: "Dados salvos localmente para acesso offline",
        },
        {
          icon: Cloud,
          title: "Sincronização",
          description: "Sincronize dados entre dispositivos",
          premium: true,
        },
        {
          icon: Shield,
          title: "Backup Automático",
          description: "Backup automático dos dados na nuvem",
          premium: true,
        },
      ],
    },
    {
      category: "Relatórios e Análises",
      items: [
        {
          icon: Download,
          title: "Exportação de Contagens",
          description: "Exporte relatórios em CSV e PDF",
          premium: true,
        },
        {
          icon: BarChart3,
          title: "Dashboard Analítico",
          description: "Visualize estatísticas e tendências",
          premium: true,
        },
        {
          icon: History,
          title: "Histórico Completo",
          description: "Acesse histórico de todas as contagens",
          premium: true,
        },
        {
          icon: FileSpreadsheet,
          title: "Relatórios Personalizados",
          description: "Crie relatórios customizados por período",
          premium: true,
        },
      ],
    },
  ]

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para pequenos negócios",
      features: [
        "Scanner de código de barras",
        "Cadastro rápido de produtos",
        "Importação CSV básica",
        "Armazenamento local",
        "Interface mobile otimizada",
        "Suporte por email",
      ],
      cta: "Começar Gratuitamente",
      href: "/register",
      popular: false,
    },
    {
      name: "Premium",
      price: "R$ 29",
      period: "/mês",
      description: "Para empresas que precisam de mais recursos",
      features: [
        "Todos os recursos gratuitos",
        "Exportação de contagens (CSV/PDF)",
        "Histórico completo de contagens",
        "Backup automático na nuvem",
        "Sincronização entre dispositivos",
        "Dashboard analítico avançado",
        "Relatórios personalizados",
        "Suporte prioritário",
        "Múltiplos usuários",
      ],
      cta: "Assinar Premium",
      href: "/register",
      popular: true,
    },
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Gerente de Loja",
      company: "Supermercado Central",
      content: "O Stock revolucionou nossa gestão de inventário. Reduzimos o tempo de contagem em 70%.",
      rating: 5,
    },
    {
      name: "João Santos",
      role: "Proprietário",
      company: "Farmácia Saúde",
      content: "Interface intuitiva e funciona perfeitamente no tablet. Recomendo para qualquer negócio.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      role: "Coordenadora de Estoque",
      company: "Loja de Roupas Fashion",
      content: "Os relatórios detalhados nos ajudam a tomar decisões mais assertivas sobre o estoque.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex justify-center mb-6">
              <Badge className="bg-primary text-primary-foreground border-0 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Sistema de Inventário Inteligente
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
              Revolucione seu
              <br />
              Controle de Estoque
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistema completo de inventário com scanner de código de barras, relatórios inteligentes e sincronização em
              tempo real. Simplifique sua gestão de estoque hoje mesmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 py-3 text-lg">
                <Link href="/register">
                  <Package className="h-5 w-5 mr-2" />
                  Começar Gratuitamente
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                <Link href="/about">
                  Saiba Mais
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Completos para sua Empresa</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra todas as funcionalidades que tornam o Stock a melhor escolha para gestão de inventário
            </p>
          </div>

          {features.map((category, categoryIndex) => (
            <div key={category.category} className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card
                      key={index}
                      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        feature.premium ? "border-amber-200 dark:border-amber-800" : ""
                      }`}
                    >
                      {feature.premium && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                            feature.premium
                              ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20"
                              : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              feature.premium ? "text-amber-600 dark:text-amber-400" : "text-primary"
                            }`}
                          />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos que Crescem com seu Negócio</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades. Comece gratuitamente e faça upgrade quando precisar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? "border-2 border-primary shadow-lg scale-105" : "hover:-translate-y-1"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <CardHeader className={plan.popular ? "pt-12" : ""}>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 text-lg">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full py-3 text-lg" variant={plan.popular ? "default" : "outline"}>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empresas de todos os tamanhos confiam no Stock para gerenciar seus inventários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-primary rounded-2xl p-12 text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para Revolucionar seu Inventário?</h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de empresas que já otimizaram sua gestão de estoque com o Stock. Comece gratuitamente
              hoje mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="px-8 py-3 text-lg">
                <Link href="/register">
                  <Package className="h-5 w-5 mr-2" />
                  Começar Gratuitamente
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                <Link href="/contact">Falar com Vendas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
