"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Plus,
  MapPin,
  Trash2,
  User,
  Store,
  Pencil,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function CompanyList() {
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [personType, setPersonType] = useState<"PJ" | "PF">("PJ");

  // Dados mockados de empresas - apenas um, com informações básicas
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Matriz - Centro",
      doc: "12.345.678/0001-90",
      address: "Av. Principal, 1000, Centro - Aracaju/SE",
      type: "PJ",
    },
  ]);

  // Estados do formulário (atualizado com campos fiscais)
  const [formData, setFormData] = useState({
    // Identificação
    name: "", // Nome Fantasia ou Nome Completo
    corporateName: "", // Razão Social (apenas PJ)
    doc: "", // CNPJ ou CPF
    stateDoc: "", // IE ou RG
    // Dados Fiscais (novos)
    regimeTributario: "", // CRT: 1,2,3 ou adaptado para PF
    regimePisCofins: "", // cumulativo / nao_cumulativo
    indicadorIE: "", // contribuinte / isento / nao_contribuinte
    inscricaoMunicipal: "", // IM
    cnaePrincipal: "", // CNAE principal
    dataAbertura: "", // Opcional: data de abertura
    // Endereço
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    // Contato
    email: "",
    phone: "",
    cellphone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Funções de formatação para CPF e CNPJ
  const formatCPF = (value: string): string => {
    value = value.replace(/\D/g, ""); // Remove não dígitos
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return value;
  };

  const formatCNPJ = (value: string): string => {
    value = value.replace(/\D/g, ""); // Remove não dígitos
    if (value.length > 14) value = value.slice(0, 14);
    value = value.replace(/(\d{2})(\d)/, "$1.$2");
    value = value.replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
    value = value.replace(
      /(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
    return value;
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (personType === "PJ") {
      val = formatCNPJ(val);
    } else {
      val = formatCPF(val);
    }
    handleInputChange("doc", val);
  };

  // Função de formatação para CEP
  const formatCEP = (value: string): string => {
    value = value.replace(/\D/g, ""); // Remove não dígitos
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = formatCEP(val);
    handleInputChange("cep", val);
  };

  // Função para buscar endereço via CEP usando ViaCEP
  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP e tente novamente.",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || "",
        district: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
        complement: data.complemento || prev.complement,
      }));
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description:
          "Não foi possível consultar o endereço. Tente manualmente.",
        variant: "destructive",
      });
    }
  };

  const handleAddCompany = () => {
    if (!formData.name || !formData.doc) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome e o documento (CPF/CNPJ).",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // Simulação de salvamento
    setTimeout(() => {
      const company = {
        id: companies.length + 1,
        name: formData.name,
        doc: formData.doc, // Já formatado
        address: `${formData.street}, ${formData.number} - ${formData.city}/${formData.state}`,
        type: personType,
      };
      setCompanies([...companies, company]);
      // Reset form
      setFormData({
        name: "",
        corporateName: "",
        doc: "",
        stateDoc: "",
        regimeTributario: "",
        regimePisCofins: "",
        indicadorIE: "",
        inscricaoMunicipal: "",
        cnaePrincipal: "",
        dataAbertura: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
        email: "",
        phone: "",
        cellphone: "",
      });
      setIsSheetOpen(false);
      setIsLoading(false);
      toast({
        title: "Empresa cadastrada",
        description: `${company.name} foi adicionada com sucesso.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="mobile-button">
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full gap-0">
            <div className="p-4 border-b flex-none">
              <SheetHeader>
                <SheetTitle>Cadastrar Nova Empresa</SheetTitle>
                <SheetDescription>
                  Preencha os dados completos da filial ou unidade de negócio.
                </SheetDescription>
              </SheetHeader>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-8">
                <div className="space-y-6">
                  {/* 1. Natureza da Empresa - Versão Compacta */}
                  <div className="space-y-3">
                    <Label className="text-base">Natureza Jurídica</Label>
                    <RadioGroup
                      defaultValue="PJ"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(val) => setPersonType(val as "PJ" | "PF")}
                    >
                      <div>
                        <RadioGroupItem
                          value="PJ"
                          id="pj"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="pj"
                          className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm font-medium transition-all"
                        >
                          <Store className="h-4 w-4" />
                          Pessoa Jurídica
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="PF"
                          id="pf"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="pf"
                          className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm font-medium transition-all"
                        >
                          <User className="h-4 w-4" />
                          Pessoa Física
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Separator />
                  {/* 2. Dados de Identificação */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      DADOS DE IDENTIFICAÇÃO
                    </h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doc">
                          {personType === "PJ" ? "CNPJ" : "CPF"}
                        </Label>
                        <Input
                          id="doc"
                          placeholder={
                            personType === "PJ"
                              ? "00.000.000/0000-00"
                              : "000.000.000-00"
                          }
                          className="mobile-optimized font-mono"
                          value={formData.doc}
                          onChange={handleDocChange}
                          maxLength={personType === "PJ" ? 18 : 14}
                        />
                      </div>
                      {personType === "PJ" && (
                        <div className="space-y-2">
                          <Label htmlFor="corporateName">Razão Social</Label>
                          <Input
                            id="corporateName"
                            placeholder="Razão Social da Empresa Ltda"
                            className="mobile-optimized"
                            value={formData.corporateName}
                            onChange={(e) =>
                              handleInputChange("corporateName", e.target.value)
                            }
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {personType === "PJ"
                            ? "Nome Fantasia"
                            : "Nome Completo"}
                        </Label>
                        <Input
                          id="name"
                          placeholder={
                            personType === "PJ"
                              ? "Nome da Loja"
                              : "Seu Nome Completo"
                          }
                          className="mobile-optimized"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stateDoc">
                          {personType === "PJ"
                            ? "Inscrição Estadual (IE)"
                            : "RG / Identidade"}
                        </Label>
                        <Input
                          id="stateDoc"
                          placeholder={
                            personType === "PJ"
                              ? "Isento ou número"
                              : "Número do RG"
                          }
                          className="mobile-optimized"
                          value={formData.stateDoc}
                          onChange={(e) =>
                            handleInputChange("stateDoc", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* 3. Dados Fiscais da Empresa (NOVA SEÇÃO) */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      DADOS FISCAIS DA EMPRESA
                    </h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="regimeTributario">
                          Regime Tributário (CRT)
                        </Label>
                        <Select
                          onValueChange={(val) =>
                            handleInputChange("regimeTributario", val)
                          }
                        >
                          <SelectTrigger className="mobile-optimized">
                            <SelectValue placeholder="Selecione o regime" />
                          </SelectTrigger>
                          <SelectContent>
                            {personType === "PJ" ? (
                              <>
                                <SelectItem value="1">
                                  Simples Nacional
                                </SelectItem>
                                <SelectItem value="2">
                                  Simples Nacional (excesso sublimite)
                                </SelectItem>
                                <SelectItem value="3">
                                  Regime Normal (Lucro Presumido/Real)
                                </SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="mei">MEI</SelectItem>
                                <SelectItem value="simples">
                                  Simples Nacional
                                </SelectItem>
                                <SelectItem value="autonomo">
                                  Autônomo
                                </SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regimePisCofins">
                          Regime de PIS/COFINS
                        </Label>
                        <Select
                          onValueChange={(val) =>
                            handleInputChange("regimePisCofins", val)
                          }
                        >
                          <SelectTrigger className="mobile-optimized">
                            <SelectValue placeholder="Selecione o regime" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cumulativo">
                              Cumulativo
                            </SelectItem>
                            <SelectItem value="nao_cumulativo">
                              Não Cumulativo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="indicadorIE">
                          Indicador de IE (ICMS)
                        </Label>
                        <Select
                          onValueChange={(val) =>
                            handleInputChange("indicadorIE", val)
                          }
                        >
                          <SelectTrigger className="mobile-optimized">
                            <SelectValue placeholder="Selecione o indicador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contribuinte">
                              Contribuinte (tem IE e recolhe ICMS)
                            </SelectItem>
                            <SelectItem value="isento">Isento</SelectItem>
                            <SelectItem value="nao_contribuinte">
                              Não Contribuinte
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {personType === "PJ" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="inscricaoMunicipal">
                              Inscrição Municipal (IM)
                            </Label>
                            <Input
                              id="inscricaoMunicipal"
                              placeholder="Número da IM (opcional)"
                              className="mobile-optimized"
                              value={formData.inscricaoMunicipal}
                              onChange={(e) =>
                                handleInputChange(
                                  "inscricaoMunicipal",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cnaePrincipal">
                              CNAE Principal
                            </Label>
                            <Input
                              id="cnaePrincipal"
                              placeholder="Ex: 47.51-2-01 (opcional)"
                              className="mobile-optimized"
                              value={formData.cnaePrincipal}
                              onChange={(e) =>
                                handleInputChange(
                                  "cnaePrincipal",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="dataAbertura">
                          Data de Abertura (opcional)
                        </Label>
                        <Input
                          id="dataAbertura"
                          type="date"
                          className="mobile-optimized"
                          value={formData.dataAbertura}
                          onChange={(e) =>
                            handleInputChange("dataAbertura", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* 4. Endereço */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      ENDEREÇO
                    </h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            className="mobile-optimized"
                            value={formData.cep}
                            onChange={handleCepChange}
                            onBlur={handleCepBlur}
                            maxLength={9}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            placeholder="Cidade"
                            className="mobile-optimized"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3 space-y-2">
                          <Label htmlFor="street">Logradouro</Label>
                          <Input
                            id="street"
                            placeholder="Rua, Avenida..."
                            className="mobile-optimized"
                            value={formData.street}
                            onChange={(e) =>
                              handleInputChange("street", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <Label htmlFor="number">Nº</Label>
                          <Input
                            id="number"
                            placeholder="123"
                            className="mobile-optimized"
                            value={formData.number}
                            onChange={(e) =>
                              handleInputChange("number", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="neighborhood">Bairro</Label>
                          <Input
                            id="neighborhood"
                            placeholder="Bairro"
                            className="mobile-optimized"
                            value={formData.district}
                            onChange={(e) =>
                              handleInputChange("district", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado (UF)</Label>
                          <Input
                            id="state"
                            placeholder="SP"
                            className="mobile-optimized"
                            value={formData.state}
                            onChange={(e) =>
                              handleInputChange(
                                "state",
                                e.target.value.toUpperCase()
                              )
                            }
                            maxLength={2}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          placeholder="Sala, Bloco, Referência..."
                          className="mobile-optimized"
                          value={formData.complement}
                          onChange={(e) =>
                            handleInputChange("complement", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {/* 5. Contato */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      CONTATO
                    </h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail Profissional</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="contato@empresa.com"
                          className="mobile-optimized"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cellphone">Celular</Label>
                          <Input
                            id="cellphone"
                            placeholder="(00) 90000-0000"
                            className="mobile-optimized"
                            value={formData.cellphone}
                            onChange={(e) =>
                              handleInputChange("cellphone", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone Fixo</Label>
                          <Input
                            id="phone"
                            placeholder="(00) 0000-0000"
                            className="mobile-optimized"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background flex-none">
              <SheetFooter className="sm:justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsSheetOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddCompany}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Salvando..." : "Cadastrar Empresa"}
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Lista de Empresas (Grid) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card
            key={company.id}
            className="relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-base">{company.name}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {company.type === "PJ"
                      ? "Pessoa Jurídica"
                      : "Pessoa Física"}
                  </span>
                </div>
              </div>
              <CardDescription className="font-mono text-xs pt-1">
                {company.doc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-sm text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{company.address}</span>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2 pt-0">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
