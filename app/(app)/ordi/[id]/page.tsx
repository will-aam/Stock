"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  User,
  Building2,
  Users,
  Clock,
  Printer,
  MessageCircle,
  Mail,
  ChevronDown,
  FileText,
  AlertTriangle,
} from "lucide-react";
// import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import {
  type StatusRequisicao,
  statusLabels,
  statusColors,
  getFuncionarioById,
  getSetorById,
  getEmpresaById,
} from "@/lib/mock-data";

export default function RequisicaoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { requisicoes, updateStatus } = useRequisicoesStore();
  const [showToast, setShowToast] = useState<string | null>(null);

  const requisicao = requisicoes.find((r) => r.id === id);

  if (!requisicao) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-card-foreground mb-2">
            Requisição não encontrada
          </h1>
          <p className="text-muted-foreground mb-4">
            A requisição que você procura não existe ou foi removida.
          </p>
          <Link href="/admin/requisicoes">
            <Button>Voltar para o Painel</Button>
          </Link>
        </div>
      </div>
    );
  }

  const funcionario = getFuncionarioById(requisicao.funcionarioId);
  const setor = getSetorById(requisicao.setorId);
  const empresa = getEmpresaById(requisicao.empresaId);

  const handleStatusChange = (newStatus: StatusRequisicao) => {
    updateStatus(requisicao.id, newStatus);
    setShowToast(`Status alterado para "${statusLabels[newStatus]}"`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAction = (action: string) => {
    setShowToast(`Ação "${action}" executada (simulação)`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const allStatuses: StatusRequisicao[] = [
    "nova",
    "em_atendimento",
    "concluida",
    "negada",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
          {showToast}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Voltar</span>
            </button>
            <div className="h-6 w-px bg-border" />
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Stock</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Cabeçalho da requisição */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-card-foreground">
                  Requisição #{requisicao.id.toUpperCase()}
                </h1>
              </div>
              <p className="text-muted-foreground">
                Criada em{" "}
                {new Date(requisicao.dataCriacao).toLocaleString("pt-BR")}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                statusColors[requisicao.status]
              }`}
            >
              {statusLabels[requisicao.status]}
            </span>
          </div>

          {/* Informações do solicitante */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span className="text-xs">Funcionário</span>
              </div>
              <p className="font-medium text-card-foreground">
                {funcionario?.nome}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {funcionario?.cpf}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Empresa</span>
              </div>
              <p className="font-medium text-card-foreground">
                {empresa?.nome}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-xs">Setor</span>
              </div>
              <p className="font-medium text-card-foreground">{setor?.nome}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Última Atualização</span>
              </div>
              <p className="font-medium text-card-foreground">
                {new Date(requisicao.dataAtualizacao).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Itens da requisição */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Itens Solicitados ({requisicao.itens.length})
          </h2>
          <div className="space-y-3">
            {requisicao.itens.map((item, index) => (
              <div
                key={index}
                className="bg-muted/30 border border-border rounded-lg p-4 flex items-start justify-between"
              >
                <div>
                  <p className="font-medium text-card-foreground">
                    {item.nome}
                  </p>
                  {item.observacoes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.observacoes}
                    </p>
                  )}
                </div>
                <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                  {item.quantidade}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Observações gerais */}
        {requisicao.observacoesGerais && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Observações
            </h2>
            <p className="text-muted-foreground bg-muted/30 rounded-lg p-4">
              {requisicao.observacoesGerais}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Ações
          </h2>
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  Alterar Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {allStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={status === requisicao.status}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        status === "nova"
                          ? "bg-blue-500"
                          : status === "em_atendimento"
                          ? "bg-yellow-500"
                          : status === "concluida"
                          ? "bg-primary"
                          : "bg-red-500"
                      }`}
                    />
                    {statusLabels[status]}
                    {status === requisicao.status && " (atual)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => handleAction("Imprimir")}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>

            <Button variant="outline" onClick={() => handleAction("WhatsApp")}>
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>

            <Button variant="outline" onClick={() => handleAction("E-mail")}>
              <Mail className="h-4 w-4 mr-2" />
              E-mail
            </Button>
          </div>
        </div>

        {/* Link para voltar */}
        <div className="mt-6 text-center">
          <Link href="/admin/requisicoes">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Painel
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
