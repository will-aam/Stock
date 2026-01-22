"use client";

import { useState } from "react";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/solicitar/login-form";
import { RequisicaoForm } from "@/components/solicitar/requisicao-form";
import { ConfirmacaoRequisicao } from "@/components/solicitar/confirmacao-requisicao";
import { useFuncionarioStore } from "@/lib/funcionario-store";
import type { ItemRequisicao } from "@/lib/mock-data";

type Step = "login" | "form" | "confirmacao";

interface RequisicaoEnviada {
  funcionarioNome: string;
  setorNome: string;
  empresaNome: string;
  itens: ItemRequisicao[];
  dataHora: string;
  protocolo: string;
}

export default function SolicitarPage() {
  const [step, setStep] = useState<Step>("login");
  const [requisicaoEnviada, setRequisicaoEnviada] =
    useState<RequisicaoEnviada | null>(null);
  const { funcionarioLogado, logout } = useFuncionarioStore();

  const handleLoginSuccess = () => {
    setStep("form");
  };

  const handleRequisicaoEnviada = (dados: RequisicaoEnviada) => {
    setRequisicaoEnviada(dados);
    setStep("confirmacao");
  };

  const handleNovaRequisicao = () => {
    setRequisicaoEnviada(null);
    setStep("form");
  };

  const handleLogout = () => {
    logout();
    setStep("login");
    setRequisicaoEnviada(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {step === "login" && <LoginForm onSuccess={handleLoginSuccess} />}
          {step === "form" && funcionarioLogado && (
            <RequisicaoForm onSuccess={handleRequisicaoEnviada} />
          )}
          {step === "confirmacao" && requisicaoEnviada && (
            <ConfirmacaoRequisicao
              dados={requisicaoEnviada}
              onNovaRequisicao={handleNovaRequisicao}
              onSair={handleLogout}
            />
          )}
        </div>
      </main>
    </div>
  );
}
