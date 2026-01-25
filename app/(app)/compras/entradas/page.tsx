// app/(app)/compras/entradas/page.tsx
"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Settings,
  Download,
  Upload,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag as TagIcon,
  Eye,
  RefreshCw,
  ChevronDown,
  Building2,
  Copy,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useNfeStore } from "@/lib/nfe-store";
import { empresas } from "@/lib/mock/empresas";
import { useToast } from "@/hooks/use-toast";

// Utilitário para formatar moeda
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    val,
  );

// Helper para status do certificado
const getCertificateStatus = (validade?: Date) => {
  if (!validade)
    return { color: "bg-gray-300", label: "Não Configurado", pulse: false };

  const hoje = new Date();
  const diffTime = validade.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { color: "bg-red-500", pulse: true };
  if (diffDays <= 30) return { color: "bg-yellow-500", pulse: false };
  return { color: "bg-green-500", pulse: false };
};

export default function EntradaNotasPage() {
  const {
    notas,
    tags,
    selectedNotas,
    visibleColumns,
    toggleSelectNota,
    selectAll,
    manifestarNota,
  } = useNfeStore();
  const { toast } = useToast();

  // Estado inicial pode continuar como "todas"
  const [empresaSelecionada, setEmpresaSelecionada] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const notasFiltradas = notas.filter((n) => {
    let matchEmpresa = false;

    if (empresaSelecionada === "todas") {
      matchEmpresa = true;
    } else {
      const empresa = empresas.find((e) => e.id === empresaSelecionada);
      if (empresa) {
        // Compara o CNPJ da nota com o CNPJ da empresa selecionada
        matchEmpresa = n.destinatario.cnpj === empresa.cnpj;
      }
    }

    const matchSearch =
      n.chave.includes(searchTerm) ||
      n.emitente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.numero.includes(searchTerm);

    return matchEmpresa && matchSearch;
  });

  const handleSelectAll = () => {
    if (selectedNotas.length === notasFiltradas.length) {
      selectAll([]);
    } else {
      selectAll(notasFiltradas.map((n) => n.id));
    }
  };

  // --- ARRASTAR E SOLTAR ---
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast({
      title: "XMLs Identificados",
      description: `${e.dataTransfer.files.length} arquivos prontos para processamento.`,
    });
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-60px)] bg-background relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* OVERLAY DE DRAG & DROP */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary flex items-center justify-center">
          <div className="bg-background p-8 rounded-xl shadow-xl flex flex-col items-center animate-bounce">
            <Upload className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-primary">
              Solte os XMLs aqui
            </h2>
            <p className="text-muted-foreground">
              Importação automática iniciada
            </p>
          </div>
        </div>
      )}

      {/* --- HEADER: SELEÇÃO DE EMPRESA (TABELA ALINHADA) --- */}
      <header className=" px-6 py-4 flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Select
            value={empresaSelecionada}
            onValueChange={setEmpresaSelecionada}
          >
            <SelectTrigger className="w-auto min-w-[350px] h-12 pl-2 pr-3 text-left">
              <div className="flex items-center gap-3 w-full">
                {/* Ícone Fixo Esquerdo (sem background) */}
                <div className="shrink-0 flex items-center justify-center">
                  {empresaSelecionada === "todas" ? (
                    <Layers className="h-5 w-5 text-primary" />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                {/* CONTEÚDO DA LINHA SELECIONADA (GRID) */}
                <SelectValue placeholder="Selecione a empresa">
                  {empresaSelecionada === "todas" ? (
                    <div className="flex items-center h-full w-full">
                      <span className="font-bold uppercase text-foreground text-sm tracking-tight">
                        VISÃO GERAL - TODAS AS EMPRESAS
                      </span>
                    </div>
                  ) : (
                    (() => {
                      const emp = empresas.find(
                        (e) => e.id === empresaSelecionada,
                      );
                      const status = getCertificateStatus(
                        emp?.fiscal.certificadoValidade,
                      );

                      return (
                        <div className="flex items-center w-full gap-2">
                          {" "}
                          {/* Coluna 1: Nome */}
                          <div
                            className="col-span-5 truncate font-bold uppercase text-foreground text-sm"
                            title={emp?.nomeFantasia}
                          >
                            {emp?.nomeFantasia}
                          </div>
                          {/* Coluna 2: CNPJ */}
                          <div className="col-span-4 flex items-center border-l order/50 pl-4 h-5">
                            <span className="truncate text-muted-foreground font-mono font-medium text-sm">
                              {emp?.cnpj}
                            </span>
                          </div>
                          {/* Coluna 3: Status (Apenas Bolinha Visual no Trigger) */}
                          <div className="col-span-3 flex justify-end items-center pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground uppercase hidden xl:inline-block">
                                {status.label}
                              </span>
                              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                                {status.pulse && (
                                  <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.color}`}
                                  ></span>
                                )}
                                <span
                                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.color}`}
                                ></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </SelectValue>
              </div>
            </SelectTrigger>

            {/* --- CONTEÚDO DO DROPDOWN (LISTA ABERTA) --- */}
            <SelectContent className="min-w-[650px] p-0" align="start">
              {/* OPÇÃO 1: TODAS */}
              <SelectItem
                value="todas"
                className="pl-3 py-3 cursor-pointer  last:border-0 focus:bg-accent data-[state=checked]:bg-accent [&>span:first-child]:hidden"
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Ícone Alinhado (sem background) */}
                  <div className="shrink-0 flex items-center justify-center w-5">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="grid grid-cols-12 gap-4 w-full items-center">
                    <div className="col-span-5 font-bold uppercase text-foreground text-sm">
                      TODAS
                    </div>
                    <div className="col-span-7 text-xs text-muted-foreground">
                      Visualizar visão geral consolidadada
                    </div>
                  </div>
                </div>
              </SelectItem>

              {/* LISTA DE EMPRESAS */}
              {empresas.map((e) => {
                const status = getCertificateStatus(
                  e.fiscal.certificadoValidade,
                );

                return (
                  <SelectItem
                    key={e.id}
                    value={e.id}
                    className="pl-3 py-3 cursor-pointer  last:border-0 focus:bg-accent data-[state=checked]:bg-accent [&>span:first-child]:hidden"
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Ícone da Empresa (sem background) */}
                      <div className="shrink-0 flex items-center justify-center w-5">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>

                      {/* Grid de Dados */}
                      <div className="grid grid-cols-12 gap-4 w-full items-center">
                        {/* Coluna 1 */}
                        <div
                          className="col-span-5 truncate font-bold uppercase text-foreground text-sm"
                          title={e.nomeFantasia}
                        >
                          {e.nomeFantasia}
                        </div>

                        {/* Coluna 2 */}
                        <div className="col-span-4 truncate text-muted-foreground font-mono text-sm border-l order/50 pl-4">
                          {e.cnpj}
                        </div>

                        {/* Coluna 3 */}
                        <div className="col-span-3 flex items-center justify-end gap-3">
                          <span
                            className={`text-xs font-mono font-medium ${status.pulse ? "text-white" : "text-foreground"}`}
                          >
                            {e.fiscal.certificadoValidade
                              ? e.fiscal.certificadoValidade.toLocaleDateString()
                              : "-"}
                          </span>
                          <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                            {status.pulse && (
                              <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.color}`}
                              ></span>
                            )}
                            <span
                              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.color}`}
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* BOTÕES LATERAIS */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
        </div>
      </header>

      {/* --- TOOLBAR DE FILTROS --- */}
      <div className="px-6 py-4 border-b space-y-4 shrink-0 bg-muted/10">
        {/* Linha 1: Busca e Datas */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por Chave, Número, Emitente ou Valor..."
              className="pl-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-background p-1 rounded-md border">
            <Button variant="ghost" size="sm" className="text-xs">
              Hoje
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              7 dias
            </Button>
            <Button variant="secondary" size="sm" className="text-xs shadow-sm">
              30 dias
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Linha 2: Ações em Massa e Colunas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedNotas.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar XML/PDF
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedNotas.length === 0}
                >
                  <TagIcon className="h-4 w-4 mr-2" />
                  Etiquetar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Aplicar Etiqueta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tags.map((tag) => (
                  <DropdownMenuItem key={tag.id} className="gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.cor }}
                    />
                    {tag.nome}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedNotas.length > 0 && (
              <span className="text-sm text-muted-foreground ml-2">
                {selectedNotas.length} selecionadas
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked>
                Emissão
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Etiquetas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Chave</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Emitente
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Valor</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- TABELA DE NOTAS --- */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10 shadow-sm backdrop-blur-md">
            <tr>
              <th className="p-4 w-10">
                <Checkbox
                  checked={
                    selectedNotas.length === notasFiltradas.length &&
                    notasFiltradas.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Emissão</th>
              <th className="p-4 font-medium">Emitente</th>
              <th className="p-4 font-medium">Chave de Acesso</th>
              <th className="p-4 font-medium text-right">Valor Total</th>
              <th className="p-4 font-medium text-center">Etiquetas</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {notasFiltradas.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-10 text-center text-muted-foreground"
                >
                  Nenhuma nota encontrada neste período.
                  <br />
                  <span className="text-xs">
                    Arraste um XML para importar manualmente.
                  </span>
                </td>
              </tr>
            ) : (
              notasFiltradas.map((nota) => (
                <tr
                  key={nota.id}
                  className="hover:bg-muted/30 group transition-colors"
                >
                  <td className="p-4">
                    <Checkbox
                      checked={selectedNotas.includes(nota.id)}
                      onCheckedChange={() => toggleSelectNota(nota.id)}
                    />
                  </td>

                  {/* STATUS & MANIFESTAÇÃO */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div title="Status Sefaz">
                        {nota.statusSefaz === "autorizada" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>

                      <div
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border cursor-pointer
                          ${nota.manifestacao === "ciencia" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : ""}
                          ${nota.manifestacao === "confirmada" ? "bg-green-100 text-green-700 border-green-300" : ""}
                          ${nota.manifestacao === "sem_manifestacao" ? "bg-gray-100 text-gray-500 border-gray-300" : ""}
                        `}
                        title={`Manifestação: ${nota.manifestacao}`}
                      >
                        {nota.manifestacao === "ciencia" && "Ci"}
                        {nota.manifestacao === "confirmada" && "Co"}
                        {nota.manifestacao === "sem_manifestacao" && "?"}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {nota.dataEmissao.toLocaleDateString()}
                    <div className="text-xs">
                      {nota.dataEmissao.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {nota.emitente.nome}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nota.emitente.cnpj} - {nota.emitente.uf}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 group/key">
                      <code
                        className="bg-muted/50 px-2 py-1 rounded text-xs font-mono text-primary hover:bg-primary/10 hover:underline cursor-pointer transition-colors"
                        onClick={() =>
                          toast({ description: "Abrindo PDF da nota..." })
                        }
                        title="Clique para ver o PDF"
                      >
                        {nota.chave.replace(/(\d{4})/g, "$1 ").substring(0, 25)}
                        ...
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover/key:opacity-100"
                        onClick={() =>
                          navigator.clipboard.writeText(nota.chave)
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Nº {nota.numero} • Série {nota.serie}
                    </div>
                  </td>

                  <td className="p-4 text-right font-medium">
                    {formatCurrency(nota.valores.total)}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {nota.tags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            style={{
                              borderColor: tag.cor,
                              color: tag.cor,
                              backgroundColor: `${tag.cor}10`,
                            }}
                            className="text-[10px] h-5 px-1.5"
                          >
                            {tag.nome}
                          </Badge>
                        );
                      })}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                      >
                        <TagIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    {nota.statusSistema === "pendente" ? (
                      <Button
                        size="sm"
                        className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Escriturar
                      </Button>
                    ) : nota.statusSistema === "importada" ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Importada
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Erro</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ */}
      <div className="border-t p-4 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground shrink-0">
        <div>
          Mostrando <strong>{notasFiltradas.length}</strong> de{" "}
          <strong>{notas.length}</strong> notas
        </div>
        <div className="flex gap-4">
          <span>
            Total Selecionado:{" "}
            <strong>
              {formatCurrency(
                notasFiltradas
                  .filter((n) => selectedNotas.includes(n.id))
                  .reduce((acc, n) => acc + n.valores.total, 0),
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
