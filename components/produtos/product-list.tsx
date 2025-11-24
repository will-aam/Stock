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
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname } from "next/navigation";
import {
  Plus,
  Search,
  Package,
  Barcode,
  Tag,
  AlertTriangle,
  ImageIcon,
  Pencil,
  Trash2,
  Download,
  Upload,
  FileText,
  Filter,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Dados mockados de produtos
  const [products, setProducts] = useState([
    {
      id: 1,
      internalCode: "PROD001",
      ean: "7891000100103",
      name: "Leite Integral 1L",
      category: "Laticínios",
      alertDays: 30,
    },
    {
      id: 2,
      internalCode: "PROD002",
      ean: "7894321711263",
      name: "Iogurte Natural 170g",
      category: "Laticínios",
      alertDays: 15,
    },
    {
      id: 3,
      internalCode: "PROD003",
      ean: "7896005800042",
      name: "Arroz Branco 5kg",
      category: "Cereais",
      alertDays: 60,
    },
  ]);

  // Função para lidar com a seleção de categorias no filtro
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // Filtragem combinada (por termo de busca e categorias)
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ean.includes(searchTerm) ||
      p.internalCode.includes(searchTerm);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);

    return matchesSearch && matchesCategory;
  });

  // Lista de categorias disponíveis para o filtro
  const availableCategories = [
    "Laticínios",
    "Cereais",
    "Bebidas",
    "Limpeza",
    "Higiene",
    "Bazar",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Catálogo de Produtos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie o catálogo mestre de produtos, marcas e regras de validade
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Link href="/produtos/cadastro" className="w-full sm:w-auto">
            <Button className="mobile-button flex items-center gap-2 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de Busca com Filtro */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, código EAN ou código interno..."
            className="pl-9 mobile-optimized"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro de Categoria */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {selectedCategories.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtrar por Categoria</h4>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Aqui você poderia aplicar os filtros
                    // Por enquanto, apenas fechar o popover
                  }}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Tabela de Produtos com Componentes do Shadcn UI */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Código</TableHead>
                <TableHead className="w-[150px]">EAN</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {product.internalCode}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {product.ean}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
