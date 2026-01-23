"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Building2,
  Save,
  Loader2,
  UploadCloud,
  LayoutGrid,
  Package,
  ShoppingCart,
  ScanBarcode,
  FileText,
  ClipboardList,
  Truck,
  ShieldAlert,
} from "lucide-react";
import { Usuario, UserPermissions } from "@/lib/mock/usuarios";
import { empresas } from "@/lib/mock/empresas";
import { setores } from "@/lib/mock/setores";

interface UserFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Usuario | null;
  onSave: (data: Partial<Usuario>) => void;
}

// Permissões padrão para novo usuário
const defaultPermissions: UserPermissions = {
  stock: true, // Core sempre ativo por padrão
  ordi: false,
  countify: false,
  val: false,
  brutos: false,
  rico: false,
  admin: false,
};

const emptyUser: Partial<Usuario> = {
  ativo: true,
  avatar: "",
  cargo: "",
  empresaId: "",
  setorId: "",
  permissoes: defaultPermissions,
};

export function UserFormSheet({
  open,
  onOpenChange,
  initialData,
  onSave,
}: UserFormSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Usuario>>(emptyUser);
  const [activeTab, setActiveTab] = useState("identidade");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)));
      } else {
        setFormData(JSON.parse(JSON.stringify(emptyUser)));
      }
      setActiveTab("identidade");
    }
  }, [open, initialData]);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  const updateField = (field: keyof Usuario, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePermission = (module: keyof UserPermissions, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissoes: {
        ...prev.permissoes!,
        [module]: value,
      },
    }));
  };

  // Filtrar setores baseado na empresa selecionada
  const filteredSectors = setores.filter(
    (s) => s.empresaId === formData.empresaId,
  );

  const modulesConfig = [
    {
      id: "ordi",
      label: "Ordi - Pedidos",
      icon: ShoppingCart,
      desc: "Gestão de fluxo de pedidos de uso e consumo.",
    },
    {
      id: "countify",
      label: "Countify - App",
      icon: ScanBarcode,
      desc: "Acesso ao coletor de dados e inventário.",
    },
    {
      id: "val",
      label: "Val - Compras",
      icon: FileText,
      desc: "Assistente de cotações e compras.",
    },
    {
      id: "brutos",
      label: "Brutos - Engenharia",
      icon: ClipboardList,
      desc: "Ficha técnica e composição de produtos.",
    },
    {
      id: "rico",
      label: "Rico - Requisições",
      icon: Truck,
      desc: "Solicitação interna de materiais.",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[700px] p-0 flex flex-col bg-background border-l shadow-xl"
        side="right"
      >
        {/* HEADER */}
        <SheetHeader className="p-5 border-b shrink-0 bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {initialData ? "Editar Usuário" : "Novo Colaborador"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {initialData
                  ? "Gerencie os dados de acesso e permissões."
                  : "Cadastre um novo membro para a equipe."}
              </SheetDescription>
            </div>
            {initialData && (
              <Badge
                variant={initialData.ativo ? "default" : "secondary"}
                className="uppercase text-[10px]"
              >
                {initialData.ativo ? "Ativo" : "Inativo"}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            <div className="px-5 py-3 border-b shrink-0 bg-background">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="identidade" className="text-xs">
                  Identidade
                </TabsTrigger>
                <TabsTrigger value="corporativo" className="text-xs">
                  Corporativo
                </TabsTrigger>
                <TabsTrigger value="acessos" className="text-xs">
                  Acessos (Hub)
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5">
              {/* ABA IDENTIDADE */}
              <TabsContent value="identidade" className="space-y-6 mt-0">
                <div className="flex flex-col items-center justify-center gap-3 py-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-dashed border-muted-foreground/30">
                      <AvatarImage
                        src={formData.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl bg-muted">
                        {formData.nome?.substring(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <UploadCloud className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clique para alterar a foto
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <Label>Nome Completo</Label>
                    <Input
                      value={formData.nome || ""}
                      onChange={(e) => updateField("nome", e.target.value)}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>E-mail (Login)</Label>
                      <Input
                        value={formData.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="joao@empresa.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>CPF</Label>
                      <Input
                        value={formData.cpf || ""}
                        onChange={(e) => updateField("cpf", e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                  {!initialData && (
                    <div className="space-y-1.5">
                      <Label>Senha Inicial</Label>
                      <Input type="password" placeholder="••••••••" />
                      <p className="text-[10px] text-muted-foreground">
                        O usuário poderá alterar no primeiro acesso.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ABA CORPORATIVO */}
              <TabsContent value="corporativo" className="space-y-6 mt-0">
                <div className="bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-blue-700" />
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                      Vínculo Empresarial
                    </h4>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Defina a qual empresa e setor este usuário pertence. Isso
                    filtrará o que ele pode ver no sistema.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <Label>Empresa Principal</Label>
                    <Select
                      value={formData.empresaId}
                      onValueChange={(v) => {
                        updateField("empresaId", v);
                        updateField("setorId", ""); // Limpa setor ao mudar empresa
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a empresa..." />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.nomeFantasia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Setor / Departamento</Label>
                      <Select
                        value={formData.setorId}
                        onValueChange={(v) => updateField("setorId", v)}
                        disabled={!formData.empresaId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !formData.empresaId
                                ? "Selecione a empresa primeiro"
                                : "Selecione o setor..."
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSectors.map((setor) => (
                            <SelectItem key={setor.id} value={setor.id}>
                              {setor.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cargo</Label>
                      <Input
                        value={formData.cargo || ""}
                        onChange={(e) => updateField("cargo", e.target.value)}
                        placeholder="Ex: Almoxarife"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md border">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Usuário Ativo</Label>
                      <p className="text-[10px] text-muted-foreground">
                        Desative para bloquear o acesso sem excluir o histórico.
                      </p>
                    </div>
                    <Switch
                      checked={formData.ativo}
                      onCheckedChange={(v) => updateField("ativo", v)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ABA ACESSOS (HUB) */}
              <TabsContent value="acessos" className="space-y-5 mt-0">
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50 mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <LayoutGrid className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-900 dark:text-purple-200">
                        Centro de Permissões
                      </h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        Configure o acesso do usuário aos módulos disponíveis no
                        sistema
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Módulo Core (Sempre Ativo) */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Package className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Stock System (Core)
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Acesso básico ao painel, perfil e configurações
                          pessoais
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>

                  {/* Módulo Admin */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.permissoes?.admin
                        ? "bg-linear-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-900/50"
                        : "bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    }`}
                    onClick={() =>
                      updatePermission("admin", !formData.permissoes?.admin)
                    }
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-red-700 dark:text-red-400">
                          Administrador Global
                        </Label>
                        <p className="text-xs text-red-600/80 dark:text-red-400/70">
                          Acesso total a todas as configurações, usuários e
                          dados do sistema
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.permissoes?.admin
                            ? "bg-red-500 border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {formData.permissoes?.admin && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-3 text-xs text-muted-foreground font-medium">
                        MÓDULOS DISPONÍVEIS
                      </span>
                    </div>
                  </div>

                  {/* Módulos Dinâmicos */}
                  <div className="grid gap-2">
                    {modulesConfig.map((mod) => (
                      <div
                        key={mod.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.permissoes?.[mod.id as keyof UserPermissions]
                            ? "bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900/50"
                            : "bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        }`}
                        onClick={() =>
                          updatePermission(
                            mod.id as keyof UserPermissions,
                            !formData.permissoes?.[
                              mod.id as keyof UserPermissions
                            ],
                          )
                        }
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <div
                            className={`p-1.5 rounded-lg ${
                              formData.permissoes?.[
                                mod.id as keyof UserPermissions
                              ]
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            <mod.icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">
                              {mod.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {mod.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.permissoes?.[
                                mod.id as keyof UserPermissions
                              ]
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {formData.permissoes?.[
                              mod.id as keyof UserPermissions
                            ] && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                    <div className="flex gap-2">
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                          Dica de Segurança
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Conceda apenas as permissões necessárias para cada
                          função. Isso melhora a segurança e simplifica a
                          experiência do usuário.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* FOOTER */}
        <SheetFooter className="p-5 border-t bg-background shrink-0 flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Usuário
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
