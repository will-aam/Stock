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
  Pencil,
  Store as StoreIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Simulando o Enum do Prisma para uso no Frontend
enum TaxRegime {
  SIMPLES_NACIONAL = "SIMPLES_NACIONAL",
  LUCRO_PRESUMIDO = "LUCRO_PRESUMIDO",
  LUCRO_REAL = "LUCRO_REAL",
}

export function CompanyList() {
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados alinhados com o modelo Store
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Matriz - Centro",
      cnpj: "12.345.678/0001-90", // CNPJ formatado
      uf: "SE",
      taxRegime: TaxRegime.LUCRO_REAL,
      address: "Av. Principal, 1000, Centro - Aracaju/SE",
    },
  ]);

  // Estado do formulário simplificado para PJ
  const [formData, setFormData] = useState({
    name: "", // Nome Fantasia
    corporateName: "", // Razão Social (opcional na visualização rápida, mas bom ter no form)
    cnpj: "",
    ie: "", // Inscrição Estadual
    taxRegime: "", // Será mapeado para o Enum

    // Endereço (Será serializado ou salvo em campos separados futuramente)
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "", // UF - Crucial para regras fiscais

    // Contato
    email: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCNPJ = (value: string): string => {
    value = value.replace(/\D/g, "");
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

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("cnpj", formatCNPJ(e.target.value));
  };

  const formatCEP = (value: string): string => {
    value = value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("cep", formatCEP(e.target.value));
  };

  // Busca de CEP (Mantida igual pois é útil UX)
  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast({ title: "CEP não encontrado", variant: "destructive" });
        return;
      }
      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || "",
        district: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "", // Importante: UF preenchida automaticamente
        complement: data.complemento || prev.complement,
      }));
    } catch {
      toast({ title: "Erro ao buscar CEP", variant: "destructive" });
    }
  };

  const handleAddCompany = () => {
    if (
      !formData.name ||
      !formData.cnpj ||
      !formData.state ||
      !formData.taxRegime
    ) {
      toast({
        title: "Dados incompletos",
        description: "Nome, CNPJ, UF e Regime Tributário são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      const newCompany = {
        id: companies.length + 1,
        name: formData.name,
        cnpj: formData.cnpj,
        uf: formData.state,
        taxRegime: formData.taxRegime as TaxRegime,
        address: `${formData.street}, ${formData.number} - ${formData.city}/${formData.state}`,
      };

      setCompanies([...companies, newCompany]);

      // Reset form
      setFormData({
        name: "",
        corporateName: "",
        cnpj: "",
        ie: "",
        taxRegime: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
        email: "",
        phone: "",
      });

      setIsSheetOpen(false);
      setIsLoading(false);

      toast({
        title: "Sucesso",
        description: `Empresa ${newCompany.name} cadastrada.`,
      });
    }, 1000);
  };

  // Helper para exibir nome amigável do regime
  const getRegimeLabel = (regime: string) => {
    switch (regime) {
      case TaxRegime.SIMPLES_NACIONAL:
        return "Simples Nacional";
      case TaxRegime.LUCRO_PRESUMIDO:
        return "Lucro Presumido";
      case TaxRegime.LUCRO_REAL:
        return "Lucro Real";
      default:
        return regime;
    }
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
                  Configure a filial e seus dados fiscais essenciais.
                </SheetDescription>
              </SheetHeader>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-8">
                {/* 1. Identificação */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <StoreIcon className="h-4 w-4" /> IDENTIFICAÇÃO
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0000-00"
                        className="mobile-optimized font-mono"
                        value={formData.cnpj}
                        onChange={handleCnpjChange}
                        maxLength={18}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Fantasia *</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Minha Loja - Centro"
                        className="mobile-optimized"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corporateName">Razão Social</Label>
                      <Input
                        id="corporateName"
                        className="mobile-optimized"
                        value={formData.corporateName}
                        onChange={(e) =>
                          handleInputChange("corporateName", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ie">Inscrição Estadual (IE)</Label>
                      <Input
                        id="ie"
                        className="mobile-optimized"
                        value={formData.ie}
                        onChange={(e) =>
                          handleInputChange("ie", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 2. Dados Fiscais (Alinhado com TaxRegime) */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    DADOS FISCAIS
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRegime">Regime Tributário *</Label>
                      <Select
                        value={formData.taxRegime}
                        onValueChange={(val) =>
                          handleInputChange("taxRegime", val)
                        }
                      >
                        <SelectTrigger className="mobile-optimized">
                          <SelectValue placeholder="Selecione o regime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TaxRegime.SIMPLES_NACIONAL}>
                            Simples Nacional
                          </SelectItem>
                          <SelectItem value={TaxRegime.LUCRO_PRESUMIDO}>
                            Lucro Presumido
                          </SelectItem>
                          <SelectItem value={TaxRegime.LUCRO_REAL}>
                            Lucro Real
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Define as regras de cálculo de impostos e créditos.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 3. Endereço */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    LOCALIZAÇÃO (UF É CRÍTICA)
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
                          className="mobile-optimized"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="street">Logradouro</Label>
                        <Input
                          id="street"
                          className="mobile-optimized"
                          value={formData.street}
                          onChange={(e) =>
                            handleInputChange("street", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-1 space-y-2">
                        <Label htmlFor="state">UF *</Label>
                        <Input
                          id="state"
                          placeholder="EX: SP"
                          className="mobile-optimized font-bold text-center"
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
                    {/* Demais campos de endereço simplificados para visualização */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={formData.number}
                          onChange={(e) =>
                            handleInputChange("number", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">Bairro</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) =>
                            handleInputChange("district", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background flex-none">
              <SheetFooter className="sm:justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCompany} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Empresa"}
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Lista de Cards */}
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
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {getRegimeLabel(company.taxRegime)}
                  </span>
                </div>
              </div>
              <CardDescription className="font-mono text-xs pt-1">
                {company.cnpj} •{" "}
                <span className="font-bold text-foreground">{company.uf}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-sm text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{company.address}</span>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2 pt-0">
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4 mr-2" /> Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remover
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
