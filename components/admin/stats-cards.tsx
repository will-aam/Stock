"use client";

import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Requisicao } from "@/lib/mock-data";

interface StatsCardsProps {
  requisicoes: Requisicao[];
}

export function StatsCards({ requisicoes }: StatsCardsProps) {
  const stats = {
    novas: requisicoes.filter((r) => r.status === "nova").length,
    emAtendimento: requisicoes.filter((r) => r.status === "em_atendimento")
      .length,
    concluidas: requisicoes.filter((r) => r.status === "concluida").length,
    negadas: requisicoes.filter((r) => r.status === "negada").length,
  };

  const cards = [
    {
      label: "Novas",
      value: stats.novas,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      label: "Em Atendimento",
      value: stats.emAtendimento,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      label: "Concluídas",
      value: stats.concluidas,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      label: "Negadas",
      value: stats.negadas,
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-card border ${card.borderColor} rounded-xl p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}
            >
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
