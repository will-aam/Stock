// app/(no-sidebar)/solicitar/page.tsx
"use client";

import { useState } from "react";
import { UserProfileSidebar } from "@/components/solicitar/user-profile-sidebar";
import { ProductCard, type Product } from "@/components/solicitar/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Search,
  ShoppingCart,
  Minus,
  Plus,
  PackageSearch,
  LayoutGrid,
  List,
  Trash2,
  CircleOff,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

// Dados Simulados de Produtos
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Papel A4 (Resma)",
    category: "Escritório",
    image:
      "https://livrariascuritiba.vteximg.com.br/arquivos/ids/1994849-1000-1000/PP000189.jpg?v=638430804495470000",
    stock: 150,
  },
  {
    id: 2,
    name: "Caneta Azul",
    category: "Escritório",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2R_nKNfcEw06hEyis3hQ5SWJUwaN116YSsw&s",
    stock: 500,
  },
  {
    id: 3,
    name: "Detergente Neutro",
    category: "Limpeza",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLeSKkBHlV-Lu21R34z_s1_Kh9_6hV3j_2vg&s",
    stock: 20,
  },
  {
    id: 4,
    name: "Café em Pó 500g",
    category: "Copa",
    image: "https://dfxe7ekqtze9q.cloudfront.net/produtos/produtos/90101.jpg",
    stock: 10,
  },
  {
    id: 5,
    name: "Mouse Óptico USB",
    category: "Informática",
    image:
      "https://images.tcdn.com.br/img/img_prod/1157659/mouse_optico_usb_fio_125cm_sensibilidade_1000dpi_vision_22598_1_f5269bc4b874a3486bc8729a285a3e9a.png",
    stock: 5,
  },
  {
    id: 6,
    name: "Teclado ABNT2",
    category: "Informática",
    image:
      "https://images.tcdn.com.br/img/img_prod/406359/teclado_usb_padrao_abnt2_107_teclas_13_teclas_multimidia_preto_monocron_mn8260_4733_1_91c7b7d66c7bf8fc9cf4861af1c4f151_20220707113241.jpg",
    stock: 0,
  },
  {
    id: 7,
    name: "Grampeador Médio",
    category: "Escritório",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnqYyTD-fiFZy9n65F2IjgThNzF4-mZhUqUg&s",
    stock: 12,
  },
  {
    id: 8,
    name: "Água Sanitária",
    category: "Limpeza",
    image: "", // Exemplo sem imagem
    stock: 30,
  },
  {
    id: 9,
    name: "Post-it Amarelo",
    category: "Escritório",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd5dR9TqYk6eNfdHfdxXyXlFFM6tDmZKIYzA&s",
    stock: 100,
  },
  {
    id: 10,
    name: "Cabo HDMI 2m",
    category: "Informática",
    image: "https://static3.tcdn.com.br/img/editor/up/332274/21702.jpg",
    stock: 8,
  },
];

const CATEGORIES = ["Todos", "Escritório", "Informática", "Limpeza", "Copa"];

export default function SolicitarPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Estado da visualização
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Lógica do Carrinho ---
  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) - 1;
      const newCart = { ...prev };
      if (newQty <= 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = newQty;
      }
      return newCart;
    });
  };

  const deleteFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // --- Filtros ---
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = () => {
    toast({
      title: "Solicitação Enviada!",
      description: `Pedido criado com ${totalItems} itens. Acompanhe pelo seu perfil.`,
    });
    setCart({});
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* --- CABEÇALHO --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-lg">
              O
            </div>
            <span className="font-bold hidden sm:inline-block">
              Ordi Solicitações
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Carrinho */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative mr-2 border-dashed"
                >
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center border-2 border-background animate-in zoom-in">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col h-full w-full sm:max-w-md p-0 bg-background">
                <SheetHeader className="p-6 border-b shrink-0">
                  <SheetTitle>Seu Pedido ({totalItems})</SheetTitle>
                </SheetHeader>

                {/* LISTA DO CARRINHO com Scroll Oculto */}
                <div className="flex-1 overflow-y-auto py-0 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {Object.keys(cart).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 space-y-4 p-6">
                      <CircleOff className="h-12 w-12" />
                    </div>
                  ) : (
                    <div className="divide-y">
                      {Object.entries(cart).map(([idStr, qty]) => {
                        const id = Number(idStr);
                        const product = MOCK_PRODUCTS.find((p) => p.id === id);
                        if (!product) return null;

                        return (
                          <div
                            key={id}
                            className="flex gap-3 items-center p-6 hover:bg-muted/10 transition-colors"
                          >
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border">
                              <PackageSearch className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded-md h-8 bg-background shadow-sm">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none hover:bg-muted"
                                  onClick={() => removeFromCart(id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-xs font-bold font-mono">
                                  {qty}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none hover:bg-muted text-primary"
                                  onClick={() => addToCart(id)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteFromCart(id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <SheetFooter className="p-6 border-t bg-muted/5 shrink-0 mt-auto">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total de Itens
                      </span>
                      <span className="text-lg font-bold">{totalItems} un</span>
                    </div>
                    <Button
                      className="w-full h-12 text-base font-semibold shadow-md"
                      disabled={totalItems === 0}
                      onClick={handleCheckout}
                    >
                      Confirmar Solicitação
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Perfil Sidebar */}
            <UserProfileSidebar />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6 max-w-5xl mx-auto">
        {/* --- BUSCA E FILTROS --- */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-2 -mx-4 px-4 border-b space-y-3 shadow-sm md:static md:shadow-none md:border-0 md:bg-transparent md:p-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 h-11 text-base shadow-sm bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="w-full whitespace-nowrap pb-1">
            <div className="flex w-max space-x-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full h-8 text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* --- CABEÇALHO DA LISTA E TOGGLE --- */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
            {filteredProducts.length} Produtos
          </h2>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as "grid" | "list")}
            className="border rounded-lg p-1 bg-muted/20"
          >
            <ToggleGroupItem
              value="grid"
              aria-label="Grade"
              className="h-7 w-7 p-0 data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="Lista"
              className="h-7 w-7 p-0 data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* --- LISTA DE PRODUTOS --- */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
            <PackageSearch className="h-10 w-10 mb-3 opacity-20" />
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-20" // GRID: 2 colunas no mobile
                : "flex flex-col gap-2 pb-20" // LISTA: Vertical
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qtyInCart={cart[product.id] || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
