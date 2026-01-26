"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Users,
  MapPin,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Printer,
  Share2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getUsuarioById, // CORRIGIDO: Era getFuncionarioById
  getSetorById,
  getEmpresaById,
} from "@/lib/mock-data";

export default function RequisicaoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requisicoes } = useRequisicoesStore();

  // Encontrar a requisição pelo ID da URL
  const requisicao = requisicoes.find((r) => r.id === resolvedParams.id);

  if (!requisicao) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="bg-muted p-4 rounded-full">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Requisição não encontrada</h2>
          <p className="text-muted-foreground">
            A requisição que você está procurando não existe ou foi removida.
          </p>
        </div>
        <Button onClick={() => router.push("/ordi")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Lista
        </Button>
      </div>
    );
  }

  // Buscar dados relacionados usando os helpers corrigidos
  const solicitante = getUsuarioById(requisicao.funcionarioId); // CORRIGIDO
  const setor = getSetorById(requisicao.setorId);
  const empresa = getEmpresaById(requisicao.empresaId);

  return (
    <div className="flex flex-col h-full bg-muted/10">
      {/* Header da Página */}
      <header className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">
                Requisição #{requisicao.id.toUpperCase()}
              </h1>
              <Badge
                className={`${statusColors[requisicao.status]} text-white border-0`}
              >
                {statusLabels[requisicao.status]}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              Criada em {new Date(requisicao.dataCriacao).toLocaleDateString()}{" "}
              às{" "}
              {new Date(requisicao.dataCriacao).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" /> Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" /> Cancelar Requisição
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Coluna Esquerda: Itens e Observações */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Itens Solicitados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {requisicao.itens.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary font-bold w-8 h-8 rounded flex items-center justify-center text-xs shrink-0">
                          {item.quantidade}x
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.nome}</p>
                          {item.observacao && (
                            <p className="text-xs text-muted-foreground mt-0.5 italic">
                              "{item.observacao}"
                            </p>
                          )}
                        </div>
                      </div>
                      {item.tag && (
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase"
                        >
                          {item.tag}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {requisicao.observacoesGerais && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Observações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md italic">
                    "{requisicao.observacoesGerais}"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Direita: Informações Contextuais */}
          <div className="space-y-6">
            {/* Card do Solicitante */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Solicitante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {solicitante?.nome.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {solicitante?.nome || "Usuário Desconhecido"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {solicitante?.cargo || "Cargo não informado"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {empresa?.nomeFantasia || "Empresa não encontrada"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{setor?.nome || "Setor não informado"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline / Histórico (Simulado) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-4 border-l-2 border-muted space-y-6">
                  {/* Evento Atual */}
                  <div className="relative">
                    <div className="absolute -left-[21px] bg-primary h-3 w-3 rounded-full border-2 border-background" />
                    <p className="text-xs font-semibold">
                      {statusLabels[requisicao.status]}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Atualizado recentemente
                    </p>
                  </div>

                  {/* Evento Passado: Criação */}
                  <div className="relative">
                    <div className="absolute -left-[21px] bg-muted-foreground h-3 w-3 rounded-full border-2 border-background" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Requisição Criada
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(requisicao.dataCriacao).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
