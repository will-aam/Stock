// app/(app)/compras/entradas/page.tsx
"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Download,
  Upload,
  Tag as TagIcon,
  RefreshCw,
  ChevronDown,
  Building2,
  Copy,
  Layers,
  Plus,
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

  // Estados para a nova toolbar
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [searchType, setSearchType] = useState("chave");

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

      {/* --- TOOLBAR DE FILTROS E PESQUISA --- */}
      <div className="px-6 py-4 border-b space-y-4 shrink-0 bg-muted/10">
        {/* PRIMEIRA LINHA: PERÍODO E BUSCA COM COLUNAS */}
        <div className="flex gap-4">
          {/* Seção de Período - LARGURA FIXA MENOR */}
          <div className="shrink-0">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Período
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-52 h-10 justify-between">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Selecionar período</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              {/* Conteúdo do dropdown ajustado com botões alinhados aos lados */}
              <DropdownMenuContent
                className="w-52 p-3 max-h-96 overflow-y-auto"
                align="start"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  :global(.w-52)::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="text-xs font-medium">
                        Data inicial
                      </label>
                      <Input
                        type="date"
                        className="mt-1 h-8 text-xs"
                        value={dataInicial}
                        onChange={(e) => setDataInicial(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Data final</label>
                      <Input
                        type="date"
                        className="mt-1 h-8 text-xs"
                        value={dataFinal}
                        onChange={(e) => setDataFinal(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Datas rápidas</p>
                    <div className="grid grid-cols-1 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Últimos 30 dias
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Últimos 60 dias
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Últimos 90 dias
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Este mês
                      </Button>
                    </div>
                  </div>

                  {/* BOTÕES ALINHADOS AOS LADOS */}
                  <div className="flex justify-between pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setDataInicial("");
                        setDataFinal("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" className="h-7 text-xs">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Seção de Busca - PREENCHE TODO O ESPAÇO RESTANTE */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Buscar por
            </h3>
            <div className="flex gap-2 h-10">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-32 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chave">Chave</SelectItem>
                  <SelectItem value="numero">Número</SelectItem>
                  <SelectItem value="emitente">Emitente</SelectItem>
                  <SelectItem value="valor">Valor</SelectItem>
                  <SelectItem value="serie">Série</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite sua busca..."
                  className="pl-10 bg-background h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* BOTÃO COLUNAS AO LADO DA BUSCA */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    Colunas <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                {/* Dropdown com UMA COLUNA APENAS */}
                <DropdownMenuContent
                  className="w-56 p-2 max-h-64 overflow-y-auto"
                  align="end"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style jsx>{`
                    :global(.w-56)::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Emissão Data/Hora
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Etiquetas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Chave
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Emissão
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Número
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Série
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Tipo
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Valor
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Manifestação
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    CFOPs
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Origem
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Monitorado em
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Autorizada em
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                    Emitente
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    CNPJ/CPF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Nome
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    IE
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    UF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                    Destinatário
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    CNPJ/CPF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Nome
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    IE
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    UF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                    Transportador
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    CNPJ/CPF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Nome
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    IE
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    UF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked className="py-1">
                    Status
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Barra de Ações - SEGUNDA LINHA */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10">
              Relatório
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <TagIcon className="h-4 w-4 mr-2" />
                  Etiquetas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Gerenciar etiquetas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <TagIcon className="h-4 w-4 mr-2" />
                  Modificar etiquetas
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar nova etiqueta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* --- TABELA DE NOTAS --- */}
      {/* Tabela com borda externa e rolagem horizontal */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="border rounded-lg overflow-x-auto h-full">
          <table className="w-full min-w-[800px] text-sm text-left border-collapse">
            <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10 shadow-sm backdrop-blur-md border-b">
              <tr>
                <th className="p-4 w-10 border-r">
                  <Checkbox
                    checked={
                      selectedNotas.length === notasFiltradas.length &&
                      notasFiltradas.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 font-medium whitespace-nowrap border-r">
                  Emissão
                </th>
                <th className="p-4 font-medium whitespace-nowrap border-r">
                  Etiquetas
                </th>
                <th className="p-4 font-medium whitespace-nowrap border-r">
                  Chave
                </th>
                <th className="p-4 font-medium whitespace-nowrap border-r">
                  Número
                </th>
                <th className="p-4 font-medium text-right whitespace-nowrap border-r">
                  Valor
                </th>
                <th className="p-4 font-medium whitespace-nowrap border-r">
                  CNPJ/CPF
                </th>
                <th className="p-4 font-medium whitespace-nowrap">Nome</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-muted-foreground border"
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
                    className="hover:bg-muted/30 group transition-colors border-b"
                  >
                    <td className="p-4 border-r">
                      <Checkbox
                        checked={selectedNotas.includes(nota.id)}
                        onCheckedChange={() => toggleSelectNota(nota.id)}
                      />
                    </td>

                    {/* EMISSÃO - APENAS DATA, SEM HORA */}
                    <td className="p-4 text-muted-foreground whitespace-nowrap border-r">
                      {nota.dataEmissao.toLocaleDateString()}
                    </td>

                    {/* ETIQUETAS - SEM ÍCONE DE ADICIONAR */}
                    <td className="p-4 whitespace-nowrap border-r">
                      <div className="flex flex-wrap gap-1">
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
                      </div>
                    </td>

                    {/* CHAVE */}
                    <td className="p-4 whitespace-nowrap border-r">
                      <div className="flex items-center gap-2 group/key">
                        <code
                          className="bg-muted/50 px-2 py-1 rounded text-xs font-mono text-primary hover:bg-primary/10 hover:underline cursor-pointer transition-colors"
                          onClick={() =>
                            toast({ description: "Abrindo PDF da nota..." })
                          }
                          title="Clique para ver o PDF"
                        >
                          {nota.chave}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover/key:opacity-100"
                          onClick={() =>
                            toast({ description: "Baixando XML..." })
                          }
                          title="Baixar XML"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>

                    {/* NÚMERO - APENAS NÚMERO, SEM "Nº" */}
                    <td className="p-4 whitespace-nowrap border-r">
                      {nota.numero}
                    </td>

                    {/* VALOR */}
                    <td className="p-4 text-right font-medium whitespace-nowrap border-r">
                      {formatCurrency(nota.valores.total)}
                    </td>

                    {/* CNPJ/CPF - TEXTO NORMAL, SEM FONT-MONO */}
                    <td className="p-4 whitespace-nowrap border-r text-xs">
                      {nota.emitente.cnpj}
                    </td>

                    {/* NOME - SEM UF */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {nota.emitente.nome}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
