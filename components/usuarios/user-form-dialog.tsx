"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ScanBarcode,
  Package,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShoppingCart,
  FileText,
  ClipboardList,
  Truck,
  LayoutGrid,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: any;
}

export function UserFormDialog({
  open,
  onOpenChange,
  userToEdit,
}: UserFormDialogProps) {
  // Estado básico do usuário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Estoquista");

  // Estado dos Módulos (Agora um objeto para facilitar gestão)
  const [selectedModules, setSelectedModules] = useState<
    Record<string, boolean>
  >({
    countifly: false,
    ordi: false,
    val: false,
    brutos: false,
    rikko: false,
  });

  // Estado da "Integração" Countifly
  const [countiflyUser, setCountiflyUser] = useState("");
  const [countiflyPass, setCountiflyPass] = useState("");
  const [isCountiflyAccountCreated, setIsCountiflyAccountCreated] =
    useState(false);

  // Definição dos Módulos Disponíveis (Configuração Visual)
  const systemModules = [
    {
      id: "countifly",
      label: "Countifly - Inventário",
      icon: ScanBarcode,
      desc: "Coletor digital, contagem cega e auditoria de estoque.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      requiresSetup: true, // Flag para indicar que precisa de config extra
    },
    {
      id: "ordi",
      label: "Ordi - Pedidos",
      icon: ShoppingCart,
      desc: "Gestão de fluxo de pedidos de venda e compra.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "val",
      label: "Val - Compras",
      icon: FileText,
      desc: "Gestão do setor de compras, cotações e fornecedores.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "brutos",
      label: "Brutos - Ficha Técnica",
      icon: ClipboardList,
      desc: "Engenharia de produto, receitas e composição.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "rikko",
      label: "Rikko - Requisições",
      icon: Truck,
      desc: "Solicitação de materiais internos e movimentação.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  // Resetar ou Preencher formulário
  useEffect(() => {
    if (open) {
      if (userToEdit) {
        setName(userToEdit.name);
        setEmail(userToEdit.email);
        setRole(userToEdit.role);

        // Simulação de carregar módulos do usuário
        // Na vida real viria do banco, aqui simulamos baseado em strings
        const mods: Record<string, boolean> = { ...selectedModules };
        systemModules.forEach((m) => {
          // Se o mock tiver a string (ex: "Countifly"), marca true
          if (
            userToEdit.modules.some((um: string) =>
              um.toLowerCase().includes(m.id)
            )
          ) {
            mods[m.id] = true;
          } else {
            mods[m.id] = false;
          }
        });
        setSelectedModules(mods);

        // Lógica específica do Countifly
        const hasCountifly = mods["countifly"];
        setIsCountiflyAccountCreated(hasCountifly);
        if (hasCountifly) {
          setCountiflyUser(userToEdit.email);
        } else {
          setCountiflyUser("");
          setCountiflyPass("");
        }
      } else {
        // Novo usuário
        setName("");
        setEmail("");
        setRole("Estoquista");
        setSelectedModules({
          countifly: false,
          ordi: false,
          val: false,
          brutos: false,
          rikko: false,
        });
        setCountiflyUser("");
        setCountiflyPass("");
        setIsCountiflyAccountCreated(false);
      }
    }
  }, [open, userToEdit]);

  const toggleModule = (moduleId: string, checked: boolean) => {
    setSelectedModules((prev) => ({ ...prev, [moduleId]: checked }));
  };

  const handleCreateCountiflyAccount = () => {
    console.log("Criando conta no Countifly...", {
      countiflyUser,
      countiflyPass,
    });
    setIsCountiflyAccountCreated(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {userToEdit ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados e selecione os módulos que este colaborador poderá
            acessar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Dados de Acesso (Hub)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="email">E-mail (Login Geral)</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="role">Cargo / Função</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Comprador"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Seleção de Módulos */}
          <div className="space-y-4">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Permissões de Módulos
            </h4>

            <div className="grid gap-3">
              {/* Módulo Stock (Sempre Ativo - Core) */}
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30 opacity-80">
                <Checkbox id="mod_stock" checked disabled />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="mod_stock"
                    className="font-semibold flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" /> Stock System (Core)
                    <Badge variant="outline" className="text-[10px]">
                      Nativo
                    </Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Acesso base ao painel, gestão de usuários e configurações.
                  </p>
                </div>
              </div>

              {/* Lista Dinâmica de Módulos */}
              {systemModules.map((module) => {
                const isSelected = selectedModules[module.id];

                return (
                  <div
                    key={module.id}
                    className={`flex flex-col border rounded-lg transition-all duration-200 ${
                      isSelected
                        ? "border-primary/50 bg-primary/5 shadow-sm"
                        : "border-input hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-start space-x-3 p-3">
                      <Checkbox
                        id={`mod_${module.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          toggleModule(module.id, checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none w-full">
                        <Label
                          htmlFor={`mod_${module.id}`}
                          className="font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <div
                            className={`p-1 rounded ${module.bgColor} ${module.color}`}
                          >
                            <module.icon className="w-4 h-4" />
                          </div>
                          {module.label}
                          {module.requiresSetup &&
                            isCountiflyAccountCreated &&
                            isSelected && (
                              <Badge
                                variant="default"
                                className="ml-auto text-[10px] h-5 bg-green-600 hover:bg-green-700"
                              >
                                Configurado
                              </Badge>
                            )}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {module.desc}
                        </p>
                      </div>
                    </div>

                    {/* Área de Configuração Específica (Ex: Countifly) */}
                    {module.requiresSetup && isSelected && (
                      <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="pl-7">
                          {" "}
                          {/* Indentação visual */}
                          <Separator className="my-3 bg-border/50" />
                          {!isCountiflyAccountCreated ? (
                            <div className="space-y-4 bg-background p-4 rounded-md border border-dashed border-yellow-300 dark:border-yellow-800">
                              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">
                                  Configuração Necessária
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                O {module.label} requer um login separado para o
                                aplicativo.
                              </p>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label htmlFor="c_user" className="text-xs">
                                    Usuário App
                                  </Label>
                                  <Input
                                    id="c_user"
                                    value={countiflyUser}
                                    onChange={(e) =>
                                      setCountiflyUser(e.target.value)
                                    }
                                    placeholder={email || "user@app.com"}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="c_pass" className="text-xs">
                                    Senha Numérica
                                  </Label>
                                  <Input
                                    id="c_pass"
                                    type="text"
                                    value={countiflyPass}
                                    onChange={(e) =>
                                      setCountiflyPass(e.target.value)
                                    }
                                    placeholder="Ex: 123456"
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>

                              <Button
                                type="button"
                                size="sm"
                                className="w-full"
                                onClick={handleCreateCountiflyAccount}
                                disabled={!countiflyUser || !countiflyPass}
                              >
                                <KeyRound className="w-4 h-4 mr-2" />
                                Criar Credencial no Módulo
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded">
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 dark:bg-green-800 p-1.5 rounded-full">
                                  <CheckCircle2 className="w-4 h-4 text-green-700 dark:text-green-300" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-green-800 dark:text-green-300">
                                    Acesso Habilitado
                                  </p>
                                  <p className="text-[10px] text-green-700 dark:text-green-400">
                                    Login: {countiflyUser || email}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] h-6 px-2"
                                onClick={() =>
                                  setIsCountiflyAccountCreated(false)
                                }
                              >
                                Editar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              console.log("Salvando usuário e permissões...");
              onOpenChange(false);
            }}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
